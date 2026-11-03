export default function ProgressRing({ 
  progress = 0, 
  size = 80, 
  strokeWidth = 6,
  showLabel = true 
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="-rotate-90 transition-all duration-300"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className="transition-[stroke-dashoffset] duration-300 stroke-amber-500"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      
      {showLabel && (
        <span
          className="absolute text-slate-900 dark:text-slate-100 font-semibold translate-y-[1px]"
          style={{ fontSize: size > 60 ? '1.125rem' : '0.875rem' }}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
