export default function StatsCard({ label, value, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'text-amber-600 bg-amber-50 dark:text-amber-500 dark:bg-amber-500/10',
    success: 'text-green-600 bg-green-50 dark:text-green-500 dark:bg-green-500/10',
    warning: 'text-amber-600 bg-amber-50 dark:text-amber-500 dark:bg-amber-500/10',
    error: 'text-red-600 bg-red-50 dark:text-red-500 dark:bg-red-500/10',
    info: 'text-blue-600 bg-blue-50 dark:text-blue-500 dark:bg-blue-500/10',
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none transition-colors">
      {icon && (
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${colorClasses[color]}`}>
          {icon}
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none transition-colors">
          {value}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          {label}
        </div>
      </div>
    </div>
  )
}
