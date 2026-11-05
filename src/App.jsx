// src/App.jsx
import { useCallback, useEffect, useRef, useState } from "react"
import { SignIn, SignUp, useAuth, useClerk, useUser } from "@clerk/clerk-react"
import { useSheetStore } from "./store/sheetStore"
import { initialSheet } from "./data/initialSheet"
import Topic from "./components/Topic"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import DashboardHero from "./components/DashboardHero"
import Modal from "./components/Modal"
import ConfirmModal from "./components/ConfirmModal"
import AuthPromptModal from "./components/AuthPromptModal"
import { IconPlus, IconSearch, IconMoon, IconSun, IconUser, IconRotateCcw } from "./components/Icons"
import Loader from "./components/Loader"
import { useTheme } from "./hooks/useTheme"

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd"

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const clerk = useClerk()
  const { isLoaded: isUserLoaded, user } = useUser()
  const [authMode, setAuthMode] = useState("sign-in")
  const [showAuth, setShowAuth] = useState(false)
  const [authPromptOpen, setAuthPromptOpen] = useState(false)
  const [authPromptMessage, setAuthPromptMessage] = useState("")

  const flushPendingSave = useRef(async () => true)
  const status = useSheetStore((s) => s.status)
  const storeReadOnly = useSheetStore((s) => s.readOnly)
  const error = useSheetStore((s) => s.error)
  const saveStatus = useSheetStore((s) => s.saveStatus)
  const loadSheet = useSheetStore((s) => s.loadSheet)
  const setPreviewSheet = useSheetStore((s) => s.setPreviewSheet)
  const saveSheet = useSheetStore((s) => s.saveSheet)

  const openSignIn = useCallback(() => {
    setAuthPromptOpen(false)
    setAuthMode("sign-in")
    setShowAuth(true)
    window.location.hash = "/sign-in"
  }, [])

  const openSignUp = useCallback(() => {
    setAuthPromptOpen(false)
    setAuthMode("sign-up")
    setShowAuth(true)
    window.location.hash = "/sign-up"
  }, [])

  const promptAuth = useCallback((action) => {
    let message = "Please sign in or sign up to make changes to the coding sheet. Your progress will be saved to your account."
    if (action === "update progress") {
      message = "Please sign in or sign up using Clerk to check off questions and update your progress."
    } else if (action === "add") {
      message = "Please sign in or sign up using Clerk to add new topics, subtopics, or questions."
    } else if (action === "edit") {
      message = "Please sign in or sign up using Clerk to edit topics, subtopics, or questions."
    } else if (action === "delete") {
      message = "Please sign in or sign up using Clerk to delete topics, subtopics, or questions."
    } else if (action === "reorder") {
      message = "Please sign in or sign up using Clerk to reorder topics, subtopics, or questions."
    } else if (action === "reset") {
      message = "Please sign in or sign up using Clerk to reset your coding sheet."
    }
    setAuthPromptMessage(message)
    setAuthPromptOpen(true)
  }, [])

  // Synchronize hash routing with auth mode
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash.includes("sign-up")) {
        setAuthMode("sign-up")
        setShowAuth(true)
      } else if (hash.includes("sign-in")) {
        setAuthMode("sign-in")
        setShowAuth(true)
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // Automatically clean up URL hash when authenticated
  useEffect(() => {
    if (isSignedIn && (window.location.hash.includes("sign-in") || window.location.hash.includes("sign-up"))) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
    }
  }, [isSignedIn])

  useEffect(() => {
    if (!isLoaded || !isUserLoaded) return undefined
    if (!isSignedIn || !user) {
      setPreviewSheet(structuredClone(initialSheet), promptAuth)
      return undefined
    }

    let cancelled = false
    let saveTimer
    let lastSheet
    let lastSavedSheet
    let saveQueue = Promise.resolve()
    let unsubscribe
    const queueSave = (snapshot) => {
      saveQueue = saveQueue.then(async () => {
        const saved = await saveSheet(user.id, getToken, snapshot)
        if (saved) lastSavedSheet = snapshot
        return saved
      })
      return saveQueue
    }

    const initializeSheet = async () => {
      await loadSheet(user.id, getToken)
      if (cancelled) return

      const current = useSheetStore.getState()
      if (current.status !== "ready" || current.userId !== user.id) return
      lastSheet = current.sheet
      lastSavedSheet = current.sheet

      flushPendingSave.current = async () => {
        if (saveTimer) {
          clearTimeout(saveTimer)
          saveTimer = undefined
        }
        if (!lastSheet || lastSheet === lastSavedSheet) return true
        return queueSave(lastSheet)
      }

      unsubscribe = useSheetStore.subscribe((state) => {
        if (state.userId !== user.id || state.status !== "ready" || state.sheet === lastSheet) return
        lastSheet = state.sheet
        const sheetSnapshot = state.sheet
        clearTimeout(saveTimer)
        useSheetStore.getState().setSaveStatus("pending")
        saveTimer = setTimeout(() => {
          saveTimer = undefined
          void queueSave(sheetSnapshot)
        }, 700)
      })
    }

    void initializeSheet()

    return () => {
      cancelled = true
      unsubscribe?.()
      void flushPendingSave.current()
      flushPendingSave.current = async () => true
    }
  }, [getToken, isLoaded, isSignedIn, isUserLoaded, loadSheet, promptAuth, saveSheet, setPreviewSheet, user])

  const handleSignOut = async () => {
    try {
      await flushPendingSave.current()
    } catch {
      // Continue signing out even if save failed
    }
    setShowAuth(false)
    setAuthPromptOpen(false)
    useSheetStore.getState().reset()
    await clerk.signOut({ redirectUrl: "/" })
  }

  if (!isLoaded || !isUserLoaded) return <Loader />

  if (!isSignedIn) {
    if (!showAuth) {
      if (status !== "ready" || !storeReadOnly) return <Loader />
      return (
        <>
          <SheetApplication
            readOnly
            onSignIn={openSignIn}
            onSignUp={openSignUp}
            promptAuth={promptAuth}
            saveStatus="idle"
            error={null}
          />
          <AuthPromptModal
            isOpen={authPromptOpen}
            onClose={() => setAuthPromptOpen(false)}
            onSignIn={openSignIn}
            onSignUp={openSignUp}
            actionMessage={authPromptMessage}
          />
        </>
      )
    }

    const AuthComponent = authMode === "sign-in" ? SignIn : SignUp
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
        <SignedOutActions onOpenSignIn={openSignIn} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Question Management Sheet</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {authMode === "sign-in"
              ? "Sign in to modify questions and save your progress"
              : "Create an account to track your DSA coding preparation"}
          </p>
        </div>
        <AuthComponent
          routing="hash"
          signUpUrl="#/sign-up"
          signInUrl="#/sign-in"
          fallbackRedirectUrl="/"
        />
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const newMode = authMode === "sign-in" ? "sign-up" : "sign-in"
              setAuthMode(newMode)
              window.location.hash = `/${newMode}`
            }}
            className="text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors cursor-pointer"
          >
            {authMode === "sign-in" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAuth(false)
              window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
            }}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            ← Back to coding sheet (view as guest)
          </button>
        </div>
      </div>
    )
  }

  if (status === "loading" || status === "idle") return <Loader />

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900 p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error || "Could not load your sheet."}</p>
        <button
          type="button"
          onClick={() => loadSheet(user.id, getToken)}
          className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-900 cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <SheetApplication
      onSignIn={openSignIn}
      onSignUp={openSignUp}
      promptAuth={promptAuth}
      saveStatus={saveStatus}
      error={error}
      onSignOut={handleSignOut}
      retrySave={() => saveSheet(user.id, getToken, useSheetStore.getState().sheet)}
    />
  )
}

function SignedOutActions({ onOpenSignIn }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 dark:bg-slate-800 dark:hover:text-white transition-all shadow-sm cursor-pointer"
      >
        {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
      </button>
      <button
        type="button"
        onClick={onOpenSignIn}
        aria-label="Open sign in"
        title="Sign In with Clerk"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 dark:bg-slate-800 dark:hover:text-white transition-all shadow-sm cursor-pointer"
      >
        <IconUser size={22} />
      </button>
    </div>
  )
}

function SheetApplication({
  saveStatus,
  error,
  onSignOut,
  onSignIn,
  onSignUp,
  promptAuth,
  retrySave,
  readOnly = false,
}) {
  const sheetData = useSheetStore((s) => s.sheet)

  const addTopic = useSheetStore((s) => s.addTopic)
  const resetToDefault = useSheetStore((s) => s.resetToDefault)
  const reorderTopics = useSheetStore((s) => s.reorderTopics)
  const reorderSubTopics = useSheetStore((s) => s.reorderSubTopics)
  const reorderQuestions = useSheetStore((s) => s.reorderQuestions)

  const [showAddTopic, setShowAddTopic] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem("codolio_sidebar_open")
      if (saved !== null) return saved === "true"
      return typeof window !== "undefined" ? window.innerWidth >= 1024 : true
    } catch {
      return true
    }
  })

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev
      try {
        localStorage.setItem("codolio_sidebar_open", String(next))
      } catch {}
      return next
    })
  }

  useEffect(() => {
    if (sheetData) {
      const qTotal = sheetData.questions.filter((q) => !q.isPlaceholder).length
      const qSolved = sheetData.questions.filter((q) => !q.isPlaceholder && q.isSolved).length
      const percent = qTotal > 0 ? Math.round((qSolved / qTotal) * 100) : 0
      const sheetName = sheetData.sheet.name || "Question Management"

      document.title = `${sheetName} | ${percent}% Solved`
    }
  }, [sheetData])

  const sheet = sheetData.sheet
  const topics = sheet.config.topicOrder
  const questions = sheetData.questions
  const subTopicOrder = sheet.config.subTopicOrder || {}

  const hierarchy = {}

  topics.forEach((topic) => {
    hierarchy[topic] = {}
    const subs = subTopicOrder[topic] || []
    subs.forEach((s) => (hierarchy[topic][s] = []))
  })

  questions.forEach((q) => {
    const t = q.topic
    const s = q.subTopic || "General"
    if (!hierarchy[t]) hierarchy[t] = {}
    if (!hierarchy[t][s]) hierarchy[t][s] = []
    hierarchy[t][s].push(q)
  })

  const filteredTopics = searchQuery.trim()
    ? topics.filter((topic) => {
        const matchesTopic = topic.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubtopic = Object.keys(hierarchy[topic] || {}).some((sub) =>
          sub.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        const matchesQuestion = Object.values(hierarchy[topic] || {}).some((qs) =>
          qs.some((q) => q.title?.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        return matchesTopic || matchesSubtopic || matchesQuestion
      })
    : topics

  const onDragEnd = (result) => {
    if (!result.destination) return

    if (readOnly) {
      promptAuth?.("reorder")
      return
    }

    const { type, source, destination } = result

    if (type === "TOPIC") {
      reorderTopics(source.index, destination.index)
      return
    }

    if (type === "SUBTOPIC") {
      const topic = source.droppableId.replace("subtopics-", "")
      reorderSubTopics(topic, source.index, destination.index)
      return
    }

    if (type === "QUESTION") {
      const [, topic, subTopic] = destination.droppableId.split("::")

      reorderQuestions(
        topic,
        subTopic,
        source.index,
        destination.index,
      )
    }
  }

  const handleAddTopic = () => {
    if (readOnly) {
      setShowAddTopic(false)
      promptAuth?.("add")
      return
    }
    if (!newTopic.trim()) return
    addTopic(newTopic.trim())
    setNewTopic("")
    setShowAddTopic(false)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Full-width Top Horizontal Header Row */}
        <Header
          sheet={sheet}
          onSignOut={onSignOut}
          onSignIn={onSignIn}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        {/* Content Area below Header: Dynamic Sidebar + Main Workspace */}
        <div className="flex-1 flex min-w-0">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />

          {/* Main Workspace Column */}
          <div className="flex-1 min-w-0 flex flex-col">
            {readOnly && (
              <div className="mx-auto mt-3 max-w-[1400px] w-full px-4 sm:px-6 lg:px-8" role="status">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-xs sm:text-sm text-orange-950 dark:text-orange-200">
                  <p>
                    <strong>Guest Preview:</strong> You are exploring the DSA sheet in read-only mode. Sign in to save changes, add topics, and sync to MongoDB.
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={onSignIn}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-xs cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={onSignUp}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            )}

            {saveStatus === "error" && (
              <div className="mx-auto mt-3 flex max-w-[1400px] w-full items-center justify-between gap-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                <span>{error || "Your latest changes could not be saved."}</span>
                <button type="button" onClick={retrySave} className="font-bold underline cursor-pointer">
                  Retry save
                </button>
              </div>
            )}
            {saveStatus === "saving" && (
              <p className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 pt-2 text-right text-xs text-slate-500">
                Saving changes…
              </p>
            )}
            {saveStatus === "saved" && (
              <p className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 pt-2 text-right text-xs text-slate-500">
                All changes saved
              </p>
            )}

            {/* Dashboard Hero: Description, Feature Chips, Stats Cards */}
            <DashboardHero
              sheet={sheet}
              questions={questions}
            />

            {/* Main Dashboard Topics */}
            <main className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            {/* Search, Add Topic, and Reset Sheet Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <IconSearch size={16} />
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#131926] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 transition-all shadow-2xs text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (readOnly) {
                      promptAuth?.("add")
                      return
                    }
                    setShowAddTopic(true)
                  }}
                  className="group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-orange-500 dark:text-slate-950 dark:hover:bg-orange-400 rounded-xl hover:bg-slate-800 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <IconPlus size={16} className="transition-transform group-hover:rotate-90 flex-shrink-0" />
                  <span className="truncate">Add Topic</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (readOnly) {
                      promptAuth?.("reset")
                      return
                    }
                    setShowResetConfirm(true)
                  }}
                  className="group flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131926] border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/50 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer"
                  title="Restore sheet to default questions and topics"
                >
                  <IconRotateCcw size={16} className="transition-transform group-hover:-rotate-90 flex-shrink-0" />
                  <span className="truncate">Reset Sheet</span>
                </button>
              </div>
            </div>

            {/* Droppable Topic Cards */}
            <Droppable droppableId="topics" type="TOPIC">
              {(p) => (
                <div ref={p.innerRef} {...p.droppableProps} className="flex flex-col gap-3.5 sm:gap-4">
                  {filteredTopics.length === 0 && searchQuery && (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                  {filteredTopics.map((topic, i) => (
                    <Draggable key={topic} draggableId={topic} index={i}>
                      {(p, snapshot) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className={`transition-opacity duration-150 ${
                            snapshot.isDragging ? "opacity-75" : "opacity-100"
                          }`}
                          style={{
                            ...p.draggableProps.style,
                          }}
                        >
                          <Topic topic={topic} subTopics={hierarchy[topic] || {}} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {p.placeholder}
                </div>
              )}
            </Droppable>

            {topics.length === 0 && (
              <div className="py-16 text-center text-slate-500 dark:text-slate-500">
                <div className="text-base sm:text-lg font-bold mb-1 text-slate-800 dark:text-slate-200">
                  No topics yet
                </div>
                <div className="text-xs sm:text-sm">Click "Add Topic" to get started</div>
              </div>
            )}
          </main>

          <Modal
            isOpen={showAddTopic}
            onClose={() => {
              setShowAddTopic(false)
              setNewTopic("")
            }}
            title="Create New Topic"
            size="sm"
          >
            <div className="flex flex-col">
              <div className="flex flex-col gap-2 mb-6">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Topic Name <span className="text-orange-500">*</span>
                </label>
                <input
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g., Dynamic Programming, Trees..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-900 dark:text-slate-100 transition-all shadow-2xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTopic()
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 cursor-pointer"
                  disabled={!newTopic.trim()}
                >
                  Create Topic
                </button>
              </div>
            </div>
          </Modal>

          <ConfirmModal
            isOpen={showResetConfirm}
            onClose={() => setShowResetConfirm(false)}
            onConfirm={() => {
              resetToDefault(initialSheet)
              setShowResetConfirm(false)
            }}
            title="Reset Sheet to Default"
            message="Are you sure you want to reset the sheet? All your custom topics, questions, solved progress, and reordering will be restored to the default DSA coding sheet. This will be saved to your account."
            confirmText="Reset Sheet"
            cancelText="Cancel"
            danger
          />
        </div>
      </div>
    </div>
    </DragDropContext>
  )
}

export default App
