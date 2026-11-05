// src/components/AuthPromptModal.jsx
import Modal from "./Modal"
import { IconUser } from "./Icons"

export default function AuthPromptModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  actionMessage,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In Required" size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 mb-4 border border-orange-500/20 shadow-xs">
          <IconUser size={28} />
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Authentication Required
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {actionMessage ||
            "You are viewing the DSA coding sheet in preview mode. To add, edit, delete, reorder questions, or track your progress, please sign in or create an account."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={() => {
              onClose()
              onSignIn()
            }}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onSignUp()
            }}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            Sign Up
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          Continue exploring as guest
        </button>
      </div>
    </Modal>
  )
}
