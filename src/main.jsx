import React from "react"
import ReactDOM from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"
import App from "./App"
import "./index.css"

const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <App />
      </ClerkProvider>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 text-white">
        <p>Set CLERK_PUBLISHABLE_KEY in the frontend environment to start the application.</p>
      </div>
    )}
  </React.StrictMode>,
)
