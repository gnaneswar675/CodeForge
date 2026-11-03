export default function DifficultyBadge({ difficulty }) {
  const normalizedDifficulty = difficulty?.toLowerCase() || 'medium'
  
  const styles = {
    easy: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-500 dark:border-transparent',
    medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-transparent',
    hard: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-transparent',
  }
  
  const className = styles[normalizedDifficulty] || styles.medium
  
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border capitalize tracking-wide ${className}`}
    >
      {difficulty || 'Medium'}
    </span>
  )
}
