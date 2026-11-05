// src/components/ProgressCard.jsx
import ProgressRing from './ProgressRing'

export default function ProgressCard({
  progress = 0,
  solvedCount = 0,
  totalCount = 0,
  isDesktop = false,
  className = '',
}) {
  if (isDesktop) {
    return (
      <div
        className={`h-full min-h-[116px] flex items-center gap-3.5 xl:gap-4 p-4 bg-gradient-to-r from-white via-white to-orange-50/50 dark:from-[#131926] dark:via-[#131926] dark:to-orange-950/25 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors hover:border-slate-300 dark:hover:border-slate-700 ${className}`}
      >
        {/* Circular Progress Ring sized to balance with StatsCard */}
        <div className="flex-shrink-0">
          <ProgressRing progress={progress} size={60} strokeWidth={6} />
        </div>

        {/* Info & Horizontal Bar with balanced typography and alignment */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Progress
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {solvedCount} / {totalCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0">
              Questions
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Mobile / Default View (Preserved exactly as is - do not modify)
  return (
    <div
      className={`flex items-center gap-4 p-4 md:p-5 bg-gradient-to-r from-white via-white to-orange-50/50 dark:from-[#131926] dark:via-[#131926] dark:to-orange-950/25 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors ${className}`}
    >
      {/* Circular Progress Ring */}
      <div className="flex-shrink-0">
        <ProgressRing progress={progress} size={70} strokeWidth={7} />
      </div>

      {/* Info & Horizontal Bar */}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          Progress
        </div>
        <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 truncate">
          {solvedCount} / {totalCount} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Questions</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </div>
  )
}
