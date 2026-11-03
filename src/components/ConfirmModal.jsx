import Modal from './Modal'

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false 
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="mb-6">
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed m-0">
          {message}
        </p>
      </div>
            <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 ${
              danger 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
    </Modal>
  )
}
