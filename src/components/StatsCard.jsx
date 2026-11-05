export default function StatsCard({ label, value, icon, color = 'primary', className = '' }) {
  const colorClasses = {
    primary: 'text-orange-600 bg-orange-500/10 dark:text-orange-400 dark:bg-orange-500/15 border-orange-500/20',
    success: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/15 border-emerald-500/20',
    info: 'text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/15 border-blue-500/20',
    warning: 'text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/15 border-amber-500/20',
    error: 'text-rose-600 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/15 border-rose-500/20',
  }

  return (
    <div className={`flex flex-col justify-between p-4 bg-white dark:bg-[#131926] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        {icon && (
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${colorClasses[color]} transition-colors`}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white leading-tight transition-colors">
          {value}
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          {label}
        </div>
      </div>
    </div>
  )
}
