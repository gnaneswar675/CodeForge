# 🚀 CodeForge - Customizable DSA Tracker & Practice Sheet

An interactive, modern Data Structures & Algorithms preparation workspace and practice sheet. Customize your DSA curriculum, track solved problems in real-time, reorder topics and questions with drag-and-drop, and seamlessly sync your progress to the cloud with Clerk authentication and MongoDB.

![CodeForge DSA Tracker](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat&logo=clerk&logoColor=white)

---

## ✨ Key Features

- **📊 Visual Progress Dashboard**: Real-time progress ring, solved counters, completion percentages, and balanced dashboard statistics.
- **🎯 Fully Customizable Curriculum**: Create, rename, and delete custom topics, subtopics, and coding questions.
- **🖱️ Drag & Drop Reordering**: Effortlessly reorder topics and questions using `@hello-pangea/dnd`.
- **🔗 Problem & Editorial Links**: Attach direct problem links (LeetCode, GFG, etc.) and video solution links with difficulty tags (*Easy*, *Medium*, *Hard*).
- **🌓 Light & Dark Theme**: Built-in theme switcher with orange accents, clean borders, and soft shadows. Defaults to light mode with persistent theme preference.
- **📱 100% Mobile & Desktop Responsive**:
  - Unified desktop header with collapsible sidebar navigation.
  - Mobile slide-over drawer and touch-friendly interface.
- **🔐 Secure Authentication (Clerk)**: Seamless sign-in and sign-up with Clerk.
- **☁️ Per-User MongoDB Persistence**: Automatic cloud synchronization for authenticated users. Each user maintains their own independent curriculum and progress.
- **👀 Guest Preview Mode**: Instant read-only access for guests to explore the DSA sheet before signing in.
- **↺ 1-Click Default Reset**: Restore the default curated DSA sheet anytime.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Parcel 2](https://parceljs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Drag & Drop**: `@hello-pangea/dnd`
- **Auth SDK**: `@clerk/clerk-react`
- **Icons**: Custom SVG icons & Lucide Icons

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 4](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose 8](https://mongoosejs.com/)
- **Auth Middleware**: `@clerk/express`
- **CORS & Security**: Configured for local development and production deployments (Vercel & Render)

---

## 📂 Project Structure

```text
coding-management-sheet/
├── server/                      # Express backend API
│   ├── models/                  # Mongoose schemas
│   │   └── UserSheet.js         # User sheet schema (keyed by clerkUserId)
│   └── index.js                 # Express server & API routes
├── src/                         # React frontend source
│   ├── components/              # UI components
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Collapsible desktop sidebar & mobile drawer
│   │   ├── DashboardHero.jsx    # Hero section, feature chips & stats cards
│   │   ├── Topic.jsx            # Topic container & accordion
│   │   ├── SubTopic.jsx         # Subtopic container
│   │   ├── Question.jsx         # Question row with links & checkboxes
│   │   ├── ProgressCard.jsx     # Progress ring & bar
│   │   ├── StatsCard.jsx        # Statistics card
│   │   └── Modals...            # Add topic, confirmation, auth prompt modals
│   ├── data/
│   │   └── initialSheet.js      # Default curated DSA syllabus
│   ├── hooks/
│   │   └── useTheme.js          # Dark/light theme management hook
│   ├── store/
│   │   └── sheetStore.js        # Global state with Zustand
│   ├── App.jsx                  # Main application component
│   ├── index.css                # Global styles & Tailwind CSS imports
│   └── index.js                 # React DOM mount point
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
└── .env.example                 # Environment variable templates
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18 or higher
- **npm** or **pnpm**
- A **MongoDB** database (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A free **Clerk** account ([clerk.com](https://clerk.com))

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/gnaneswar675/coding-management-sheet.git
cd coding-management-sheet
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Configure your `.env` file:
```env
# Clerk Authentication Keys
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/coding-sheet?retryWrites=true&w=majority

# API Configuration
API_URL=http://localhost:3001
API_PORT=3001
CLIENT_ORIGIN=http://localhost:1234
```

> **Note**: In your Clerk Dashboard under **Configure > Domains / URLs**, ensure `http://localhost:1234` (and your production frontend URL) is added to the allowed origins.

---

## 💻 Running Locally

You need to run both the API backend and the frontend bundler:

### 1. Start the Backend API (Terminal 1)
```bash
npm run dev:server
```
*API will run at `http://localhost:3001` (health check at `http://localhost:3001/api/health`).*

### 2. Start the Frontend (Terminal 2)
```bash
npm run dev
```
*Frontend will be served by Parcel at `http://localhost:1234`.*

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Parcel development server on port `1234` |
| `npm run dev:server` | Starts the Express server in watch mode using `node --watch` |
| `npm run build` | Builds optimized production assets to the `dist/` directory |
| `npm start` | Starts the production Express server |
| `npm run lint` | Runs ESLint to check for code issues |

---

## 🌐 API Reference

All sheet endpoints require a valid Clerk Bearer token (`Authorization: Bearer <token>`).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root server status and database connectivity check |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/sheet` | Fetches the authenticated user's DSA sheet from MongoDB |
| `PUT` | `/api/sheet` | Saves/updates the user's customized DSA sheet to MongoDB |

---

## 🚀 Deployment Guide

### Backend on [Render](https://render.com)
1. Create a new **Web Service** on Render and connect your repository.
2. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
3. Add Environment Variables in Render:
   - `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `CLIENT_ORIGIN`: Your frontend URL (e.g., `https://coding-management-sheet.vercel.app`)

### Frontend on [Vercel](https://vercel.com)
1. Import the repository into Vercel.
2. Configure settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables in Vercel:
   - `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `API_URL`: Your deployed Render backend URL (e.g., `https://coding-sheet-api.onrender.com`)

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
