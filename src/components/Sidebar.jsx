// src/components/Sidebar.jsx
import { IconCodeForge, IconHome, IconX } from './Icons'

export default function Sidebar({
  isOpen = true,
  mobileOpen = false,
  onCloseMobile,
}) {
  // Only DSA Sheet is kept in the navigation menu as requested
  const navItems = [
    { id: 'dsa-sheet', label: 'DSA Sheet', icon: <IconHome size={18} /> },
  ]

  const navContent = (
    <div className="flex flex-col h-full justify-between min-w-[200px]">
      {/* Top Navigation */}
      <div>
        {/* On mobile drawer only: show brand + close button */}
        <div className="flex lg:hidden items-center justify-between px-2 py-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <IconCodeForge size={24} className="text-orange-500" />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              CodeForge
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Navigation Items (Only DSA Sheet - no duplicate hamburger) */}
        <nav className="space-y-1.5 pt-2" aria-label="Main Navigation">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 shadow-2xs"
            >
              <span className="text-orange-500">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Promo Card */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-500/15 dark:via-slate-900 dark:to-slate-900 border border-orange-200/60 dark:border-orange-500/20 relative overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 dark:bg-orange-500/20 flex items-center justify-center text-orange-500 mb-3 shadow-2xs">
            <IconCodeForge size={18} />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
            Track • Practice • Master
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Your all-in-one DSA preparation workspace.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Dynamic Sidebar with smooth width & opacity transition */}
      <aside
        className={`hidden lg:flex flex-col h-[calc(100vh-65px)] sticky top-[65px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121c] flex-shrink-0 z-30 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-60 xl:w-64 p-5 opacity-100'
            : 'w-0 p-0 border-r-0 opacity-0 overflow-hidden pointer-events-none'
        }`}
      >
        {isOpen && navContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-[#0d121c] border-r border-slate-200 dark:border-slate-800 p-5 shadow-2xl z-50 transform transition-transform ease-in-out duration-300">
            {navContent}
          </div>
        </div>
      )}
    </>
  )
}
