// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import {
  IconSun,
  IconMoon,
  IconUser,
  IconCodolio,
  IconMenu,
} from './Icons'
import { useTheme } from '../hooks/useTheme'

export default function Header({
  sheet,
  onSignOut,
  onSignIn,
  onOpenMobileMenu,
  onToggleSidebar,
  sidebarOpen = true,
}) {
  const { theme, toggleTheme } = useTheme()

  const defaultTitle = "Customizable DSA Tracker & Practice Sheet"
  const isOldDefaultTitle =
    !sheet?.name ||
    sheet.name === "Coding Interview Practice Sheet" ||
    sheet.name === "Striver SDE Sheet"
  const displayTitle = isOldDefaultTitle ? defaultTitle : sheet.name

  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onOpenMobileMenu?.()
    } else {
      onToggleSidebar?.()
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Single Hamburger Menu Button, Codolio Brand, Divider, Orange Bar, Title */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          {/* Only 1 Hamburger Menu Button on the entire interface */}
          <button
            type="button"
            onClick={handleMenuClick}
            aria-label={sidebarOpen ? "Toggle navigation menu" : "Open navigation menu"}
            title="Toggle navigation menu"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#131926] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-2xs active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            <IconMenu size={20} />
          </button>

          {/* Codolio Brand Logo & Name */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <IconCodolio size={26} className="text-orange-500" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              CodeForge
            </span>
          </div>

          {/* Subtle Vertical Gray Divider (visible on sm+) */}
          <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 flex-shrink-0" />

          {/* Orange Vertical Accent Bar + Sheet Title (visible on sm+) */}
          <div className="hidden sm:flex items-center gap-2.5 min-w-0">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full flex-shrink-0" />
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* Right: Dark/Light Mode Toggle + User Account Button (Global Search Bar removed) */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#131926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            {theme === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
          </button>

          <ProfileMenu onSignOut={onSignOut} onSignIn={onSignIn} />
        </div>
      </div>
    </header>
  )
}

function ProfileMenu({ onSignOut, onSignIn }) {
  const { user, isSignedIn } = useUser()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [signOutError, setSignOutError] = useState(null)
  const [imgError, setImgError] = useState(false)
  const menuRef = useRef(null)

  // Reset imgError if user or imageUrl changes
  useEffect(() => {
    setImgError(false)
  }, [user?.id, user?.imageUrl])

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

  // First letter of name in uppercase for avatar fallback
  const firstLetter = (
    user?.firstName?.[0] ||
    user?.fullName?.[0] ||
    user?.username?.[0] ||
    userEmail?.[0] ||
    "U"
  ).toUpperCase()

  const hasProfileImage = Boolean(user?.imageUrl && !imgError)

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={handleIconClick}
        aria-label={isSignedIn ? "Open account menu" : "Sign In with Clerk"}
        title={isSignedIn ? (userDisplayName || "Account menu") : "Sign In"}
        aria-expanded={isSignedIn ? accountMenuOpen : undefined}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#131926] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-2xs active:scale-95 transition-all cursor-pointer overflow-hidden"
      >
        {!isSignedIn || !user ? (
          /* Default User Outline Icon for Signed-Out Users */
          <IconUser size={19} />
        ) : hasProfileImage ? (
          /* User's Profile Picture (Google / Clerk imageUrl) */
          <img
            src={user.imageUrl}
            alt={userDisplayName || "User profile"}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-orange-500/30"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Circular Avatar with First Letter of Name in Uppercase */
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {firstLetter}
          </div>
        )}
      </button>

      {isSignedIn && user && accountMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] p-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5 px-2 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-2">
            {hasProfileImage ? (
              <img
                src={user.imageUrl}
                alt={userDisplayName || "User profile"}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-orange-500/30 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                {firstLetter}
              </div>
            )}
            <div className="min-w-0 flex-1">
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
          </div>

          {signOutError && (
            <p role="alert" className="px-3 py-1 mb-2 text-xs text-rose-600 dark:text-rose-400">
              {signOutError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}
