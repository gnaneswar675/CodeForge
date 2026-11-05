// src/components/DashboardHero.jsx
import ProgressCard from './ProgressCard'
import StatsCard from './StatsCard'
import FloatingDsaVisual from './FloatingDsaVisual'
import {
  IconFolder,
  IconCheck,
  IconBookmark,
} from './Icons'

export default function DashboardHero({ sheet, questions }) {
  // Calculate stats accurately from the questions list
  const totalQuestions = questions?.filter((q) => !q.isPlaceholder).length || 0
  const solvedQuestions = questions?.filter((q) => q.isSolved).length || 0
  const totalTopics = sheet?.config?.topicOrder?.length || 0
  const progress = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0

  const defaultTitle = "Customizable DSA Tracker & Practice Sheet"
  const defaultDescription =
    "Your personalized workspace to master Data Structures & Algorithms. Build your custom study curriculum, track your problem-solving progress in real time, customize topics and questions with drag-and-drop ordering, and keep your practice seamlessly saved to your account."

  const isOldDefaultTitle =
    !sheet?.name ||
    sheet.name === "Coding Interview Practice Sheet" ||
    sheet.name === "Striver SDE Sheet"
  const displayTitle = isOldDefaultTitle ? defaultTitle : sheet.name

  const isOldDefaultDesc =
    !sheet?.description ||
    sheet.description.includes("A curated collection of coding interview questions") ||
    sheet.description.includes("Flipkart, etc") ||
    sheet.description.includes("MongoDB")
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

      {/* Hero Header Area: Description on Left, Subtle Floating DSA Elements on Right */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-8 min-h-[85px]">
        {/* Description paragraph */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl xl:max-w-3xl">
          {displayDescription}
        </p>

        {/* Subtle Floating DSA Themed Visual (Desktop Only) */}
        <FloatingDsaVisual />
      </div>

      {/* STATS SECTION */}
      {/* Desktop View: 4-Column Grid with equal height and balanced alignment */}
      <div className="hidden lg:grid grid-cols-4 gap-4 mt-5 sm:mt-6 items-stretch">
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
