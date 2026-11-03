import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const modalRef = useRef()

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-2xl",
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl transform transition-all animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 backdrop-blur rounded-t-xl transition-colors">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-slate-400 rounded-xl hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-slate-600 dark:text-slate-300 transition-colors">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
