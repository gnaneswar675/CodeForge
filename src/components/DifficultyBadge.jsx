export default function DifficultyBadge({ difficulty }) {
  const normalizedDifficulty = difficulty?.toLowerCase() || 'medium'
  
  const styles = {
    easy: 'bg-emerald-100 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20',
    medium: 'bg-amber-100 text-amber-700 border-amber-200/50 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20',
    hard: 'bg-rose-100 text-rose-700 border-rose-200/50 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/20',
  }
  
  const className = styles[normalizedDifficulty] || styles.medium
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize tracking-wide ${className}`}
    >
      {difficulty || 'Medium'}
    </span>
  )
}
