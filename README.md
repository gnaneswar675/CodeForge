# Question Management Sheet

A React app for organizing coding questions with Clerk authentication and per-user MongoDB persistence. It retains the existing topic/question sheet, drag-and-drop ordering, progress tracking, search, and theme toggle.

## Stack

- React 19, Parcel, Tailwind CSS, Zustand
- Clerk authentication
- Express and Mongoose with MongoDB

## Setup

1. Install Node.js 18+ and MongoDB, then run `npm install`.
2. Copy `.env.example` to `.env` and set the Clerk keys and MongoDB connection string.
3. Configure the Clerk application to allow the frontend origin `http://localhost:1234`.
4. Start the API with `npm run dev:server`.
5. In another terminal, start the frontend with `npm run dev`.

The frontend is served by Parcel at `http://localhost:1234`; the API listens on `http://localhost:3001` by default. Keep these ports separate and open the frontend URL to use the app. Set `API_URL`, `API_PORT`, and `CLIENT_ORIGIN` in `.env` to change the API connection. The server also accepts `PORT` as a fallback for hosting platforms.

Run `npm run build` to create the production frontend in `dist/`, and `npm run lint` to lint the project. Run `npm start` to start the API without watch mode.

## Data behavior

The homepage opens directly to a read-only preview of the coding sheet when signed out. Signing in is required to make and save changes. Once authenticated, each user sees their independent sheet, initially created from `src/data/initialSheet.js`; later changes are automatically saved to that user's MongoDB document. The database keys each document by the verified Clerk user ID; clients cannot select another user’s record.
