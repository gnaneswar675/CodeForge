// src/components/DashboardHero.jsx
import ProgressCard from './ProgressCard'
import StatsCard from './StatsCard'
import {
  IconFolder,
  IconCheck,
  IconBookmark,
  IconGrip,
  IconRotateCcw,
  IconCloud,
  IconBookOpen,
} from './Icons'

export default function DashboardHero({ sheet, questions }) {
  // Calculate stats accurately from the questions list
  const totalQuestions = questions?.filter((q) => !q.isPlaceholder).length || 0
  const solvedQuestions = questions?.filter((q) => q.isSolved).length || 0
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
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Mobile Title View: Display title with orange accent bar on mobile (< sm) screens */}
      <div className="sm:hidden flex items-start gap-2.5 mb-3">
        <div className="w-1.5 h-8 bg-orange-500 rounded-full flex-shrink-0 mt-0.5" />
        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
          {displayTitle}
        </h1>
      </div>

      {/* Description paragraph */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        {displayDescription}
      </p>

      {/* FEATURE CHIPS ROW */}
      <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-5">
        {/* Orange Chip */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-2xs">
          <IconGrip size={13} />
          Drag & Drop Reordering
        </span>
        {/* Neutral Chip */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <IconFolder size={13} />
          Custom Topics & Questions
        </span>
        {/* Green Chip */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
          <IconCloud size={13} />
          Live Cloud Sync (MongoDB)
        </span>
        {/* Pink/Rose Chip */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-2xs">
          <IconRotateCcw size={13} />
          1-Click Default Reset
        </span>
        {/* Neutral Chip */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <IconBookOpen size={13} />
          LeetCode & Editorial Solutions
        </span>
      </div>

      {/* STATS SECTION */}
      {/* Desktop View: 4-Column Grid with equal height and balanced alignment */}
      <div className="hidden lg:grid grid-cols-4 gap-4 mt-6 items-stretch">
        <ProgressCard
          progress={progress}
          solvedCount={solvedQuestions}
          totalCount={totalQuestions}
          isDesktop
          className="h-full"
        />
        <StatsCard
          label="Total Questions"
          value={totalQuestions}
          icon={<IconBookmark size={18} />}
          color="primary"
          className="h-full min-h-[116px]"
        />
        <StatsCard
          label="Solved"
          value={solvedQuestions}
          icon={<IconCheck size={18} />}
          color="success"
          className="h-full min-h-[116px]"
        />
        <StatsCard
          label="Topics"
          value={totalTopics}
          icon={<IconFolder size={18} />}
          color="info"
          className="h-full min-h-[116px]"
        />
      </div>

      {/* Mobile View: Progress Card on top, 3-Column Stats Row underneath */}
      <div className="lg:hidden flex flex-col gap-3 mt-5">
        <ProgressCard progress={progress} solvedCount={solvedQuestions} totalCount={totalQuestions} />
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <StatsCard
            label="Total Questions"
            value={totalQuestions}
            icon={<IconBookmark size={16} />}
            color="primary"
          />
          <StatsCard
            label="Solved"
            value={solvedQuestions}
            icon={<IconCheck size={16} />}
            color="success"
          />
          <StatsCard
            label="Topics"
            value={totalTopics}
            icon={<IconFolder size={16} />}
            color="info"
          />
        </div>
      </div>
    </div>
  )
}

