import mongoose from "mongoose"

const userSheetSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    sheet: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
)

export default mongoose.model("UserSheet", userSheetSchema)
