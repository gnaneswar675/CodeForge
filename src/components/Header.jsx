// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import ProgressRing from './ProgressRing'
import StatsCard from './StatsCard'
import { IconFolder, IconCheck, IconBookmark, IconSun, IconMoon, IconUser, IconGrip, IconRotateCcw } from './Icons'
import { useTheme } from '../hooks/useTheme'

export default function Header({ sheet, questions, onSignOut, onSignIn }) {
  const { theme, toggleTheme } = useTheme()

  // Calculate stats accurately from the questions list
  const totalQuestions = questions?.filter(q => !q.isPlaceholder).length || 0
  const solvedQuestions = questions?.filter(q => q.isSolved).length || 0
  const totalTopics = sheet?.config?.topicOrder?.length || 0
  const progress = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0

  const defaultTitle = "Customizable DSA Tracker & Practice Sheet"
  const defaultDescription =
    "Your personalized workspace to master Data Structures & Algorithms. Build your custom curriculum with drag-and-drop ordering, track real-time topic progress, attach curated problem & video links, and sync your personalized sheet seamlessly to MongoDB."

  const isOldDefaultTitle =
    !sheet?.name ||
    sheet.name === "Coding Interview Practice Sheet" ||
    sheet.name === "Striver SDE Sheet"
  const displayTitle = isOldDefaultTitle ? defaultTitle : sheet.name

  const isOldDefaultDesc =
    !sheet?.description ||
    sheet.description.includes("A curated collection of coding interview questions") ||
    sheet.description.includes("Flipkart, etc")
  const displayDescription = isOldDefaultDesc ? defaultDescription : sheet.description

  return (
    <header className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 relative">
        
        {/* Main Layout Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          
          {/* Left Section: Title, Description & Feature Badges */}
          <div className="flex-grow min-w-0 md:pr-4"> 
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white transition-colors leading-tight min-w-0">
                {displayTitle}
              </h1>
              
              {/* Mobile Controls: Theme toggle + User Account Icon */}
              <div className="flex items-center gap-2 flex-shrink-0 md:hidden">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
                </button>
                <ProfileMenu onSignOut={onSignOut} onSignIn={onSignIn} />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-3">
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {displayDescription}
              </p>
            </div>
            
            {/* FEATURE CHIPS */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
                <IconGrip size={12} />
                Drag & Drop Reordering
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
                <IconFolder size={12} />
                Custom Topics & Questions
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                <IconCheck size={12} />
                Live Cloud Sync (MongoDB)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-xs">
                <IconRotateCcw size={12} />
                1-Click Default Reset
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                <IconBookmark size={12} />
                LeetCode & Editorial Solutions
              </span>
            </div>
          </div>

          {/* Right Section: Progress & Desktop Toggle */}
          <div className="flex-shrink-0 flex items-center justify-start sm:justify-center md:justify-end gap-5 md:gap-8 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
            
            {/* Progress Container */}
            <div className="flex items-center gap-3 sm:gap-4">
              <ProgressRing progress={progress} size={72} strokeWidth={7} />
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {solvedQuestions} / {totalQuestions}
                </span>
              </div>
            </div>

            {/* Desktop Theme Toggle & User Account Icon */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
              >
                {theme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
              </button>
              <ProfileMenu onSignOut={onSignOut} onSignIn={onSignIn} />
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
          <StatsCard
            label="Total Questions"
            value={totalQuestions}
            icon={<IconBookmark size={20} />}
            color="primary"
          />
          <StatsCard
            label="Solved"
            value={solvedQuestions}
            icon={<IconCheck size={20} />}
            color="success"
          />
          <StatsCard
            label="Topics"
            value={totalTopics}
            icon={<IconFolder size={20} />}
            color="info"
          />
        </div>
      </div>
    </header>
  )
}

function ProfileMenu({ onSignOut, onSignIn }) {
  const { user, isSignedIn } = useUser()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [signOutError, setSignOutError] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!accountMenuOpen) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAccountMenuOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setAccountMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [accountMenuOpen])

  const handleSignOut = async () => {
    setSignOutError(null)
    try {
      setAccountMenuOpen(false)
      await onSignOut()
    } catch (error) {
      setSignOutError(error.message)
    }
  }

  const handleIconClick = () => {
    if (!isSignedIn || !user) {
      onSignIn()
    } else {
      setAccountMenuOpen((open) => !open)
    }
  }

  const userDisplayName = user?.fullName || user?.username || ""
  const userEmail = user?.primaryEmailAddress?.emailAddress || ""

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleIconClick}
        aria-label={isSignedIn ? "Open account menu" : "Sign In with Clerk"}
        title={isSignedIn ? "Account menu" : "Sign In"}
        aria-expanded={isSignedIn ? accountMenuOpen : undefined}
        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
      >
        <IconUser size={22} />
      </button>

      {isSignedIn && user && accountMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800 animate-fade-in">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-2">
            {userDisplayName ? (
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {userDisplayName}
              </p>
            ) : null}
            {userEmail ? (
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {userEmail}
              </p>
            ) : null}
          </div>

          {signOutError && (
            <p role="alert" className="px-3 py-1 mb-2 text-xs text-red-600 dark:text-red-400">
              {signOutError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}
