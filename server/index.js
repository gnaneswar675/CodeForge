import "dotenv/config"
import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import { clerkMiddleware, getAuth } from "@clerk/express"
import { initialSheet } from "../src/data/initialSheet.js"
import UserSheet from "./models/UserSheet.js"

const app = express()
const port = Number(process.env.API_PORT || process.env.PORT) || 3001
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:1234")
  .split(",")
  .map((origin) => origin.trim())

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error("Origin is not allowed by CORS"))
    },
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json({ limit: "2mb" }))
app.use(clerkMiddleware())

const requireUser = (req, res, next) => {
  try {
    const auth = getAuth(req)
    if (!auth?.userId) {
      console.warn("Unauthorized request to", req.path, "- missing or unverified Clerk token.")
      res.status(401).json({ error: "Authentication is required." })
      return
    }
    req.clerkUserId = auth.userId
    next()
  } catch (error) {
    console.error("Clerk auth verification error on", req.path, ":", error.message)
    res.status(401).json({ error: "Authentication is required." })
  }
}

const isStringArray = (value) =>
  Array.isArray(value) && value.every((item) => typeof item === "string")

const isValidSheet = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  if (!value.sheet || typeof value.sheet !== "object") return false
  if (!value.sheet.config || typeof value.sheet.config !== "object") return false
  if (!isStringArray(value.sheet.config.topicOrder)) return false
  if (!Array.isArray(value.questions)) return false

  const { subTopicOrder = {}, questionOrder = {} } = value.sheet.config
  if (!subTopicOrder || typeof subTopicOrder !== "object" || Array.isArray(subTopicOrder)) return false
  if (!questionOrder || typeof questionOrder !== "object" || Array.isArray(questionOrder)) return false
  if (!Object.values(subTopicOrder).every(isStringArray)) return false
  if (!Object.values(questionOrder).every(isStringArray)) return false

  return value.questions.every(
    (question) =>
      question &&
      typeof question === "object" &&
      !Array.isArray(question) &&
      typeof question._id === "string" &&
      typeof question.title === "string" &&
      typeof question.topic === "string",
  )
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.get("/api/sheet", requireUser, async (req, res, next) => {
  try {
    let userSheet = await UserSheet.findOne({ clerkUserId: req.clerkUserId })
    if (!userSheet) {
      try {
        userSheet = await UserSheet.create({
          clerkUserId: req.clerkUserId,
          sheet: initialSheet,
        })
      } catch (error) {
        if (error?.code !== 11000) throw error
        userSheet = await UserSheet.findOne({ clerkUserId: req.clerkUserId })
      }
    }

    res.json({ sheet: userSheet.sheet })
  } catch (error) {
    next(error)
  }
})

app.put("/api/sheet", requireUser, async (req, res, next) => {
  try {
    if (!isValidSheet(req.body?.sheet)) {
      res.status(400).json({ error: "The submitted sheet data is invalid." })
      return
    }

    const userSheet = await UserSheet.findOneAndUpdate(
      { clerkUserId: req.clerkUserId },
      { $set: { sheet: req.body.sheet } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    )
    res.json({ sheet: userSheet.sheet, updatedAt: userSheet.updatedAt })
  } catch (error) {
    next(error)
  }
})

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found." })
})

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error)
  if (res.headersSent) return
  res.status(error.status || 500).json({
    error: error.status && error.status < 500 ? error.message : "An unexpected server error occurred.",
  })
})

const start = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be configured.")
  }
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY must be configured.")
  }
  const secretKey = process.env.CLERK_SECRET_KEY
  if (secretKey.includes("…") || secretKey.includes("...") || secretKey.length < 30) {
    console.error("\n❌ [CRITICAL CONFIGURATION ERROR]");
    console.error("Your CLERK_SECRET_KEY in .env is truncated with an ellipsis ('…') or is incomplete (only " + secretKey.length + " characters).");
    console.error("Please go to https://dashboard.clerk.com -> API Keys and click the 'Copy' icon to copy the entire secret key.\n");
  }
  await mongoose.connect(process.env.MONGODB_URI)
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}

start().catch((error) => {
  console.error("Could not start API server:", error)
  process.exitCode = 1
})