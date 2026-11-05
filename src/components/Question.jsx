// src/components/Question.jsx
import { useState } from "react"
import { useSheetStore } from "../store/sheetStore"
import DifficultyBadge from "./DifficultyBadge"
import ConfirmModal from "./ConfirmModal"
import { IconGrip, IconTrash, IconCheck, IconX, IconExternalLink, IconVideo, PlatformIcon } from "./Icons"

export default function Question({ question, dragHandleProps }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(question.title)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const readOnly = useSheetStore((s) => s.readOnly)
  const requestLogin = useSheetStore((s) => s.requestLogin)
  const editQuestion = useSheetStore((s) => s.editQuestion)
  const deleteQuestion = useSheetStore((s) => s.deleteQuestion)
  const toggleSolved = useSheetStore((s) => s.toggleSolved)

  const handleSaveEdit = () => {
    if (readOnly) {
      setIsEditing(false)
      requestLogin?.("edit")
      return
    }
    if (editText.trim()) {
      editQuestion(question._id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleToggleSolved = () => {
    if (readOnly) {
      requestLogin?.("update progress")
      return
    }
    if (toggleSolved) {
      toggleSolved(question._id)
    }
  }

  const platform = question.questionId?.platform || "generic"
  const difficulty = question.questionId?.difficulty || question.difficulty || "Medium"
  const problemUrl = question.questionId?.problemUrl || question.problemUrl
  const resourceUrl = question.resource

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-white dark:bg-[#131926] border border-orange-500 rounded-xl shadow-lg">
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
          autoFocus
          className="flex-1 min-w-0 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-[#0c101a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-orange-500"
        />
        <button
          type="button"
          onClick={handleSaveEdit}
          className="p-1.5 sm:p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer flex-shrink-0"
        >
          <IconCheck size={16} />
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex-shrink-0"
        >
          <IconX size={16} />
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="group flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3.5 py-2.5 bg-white dark:bg-[#131926] border border-slate-200/90 dark:border-slate-800 rounded-xl transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs">
        {/* Drag Handle */}
        <div {...dragHandleProps} className="text-slate-300 dark:text-slate-600 hover:text-slate-400 cursor-grab flex-shrink-0">
          <IconGrip size={14} />
        </div>

        {/* Solved Checkbox */}
        <button
          type="button"
          onClick={handleToggleSolved}
          aria-label={question.isSolved ? "Mark as unsolved" : "Mark as solved"}
          className={`flex items-center justify-center w-5 h-5 min-w-[20px] rounded-md border-2 transition-all cursor-pointer flex-shrink-0 ${
            question.isSolved
              ? "bg-emerald-500 border-emerald-500"
              : "bg-white dark:bg-[#0c101a] border-slate-300 dark:border-slate-600 hover:border-orange-500"
          }`}
        >
          {question.isSolved && <IconCheck size={12} className="text-white" />}
        </button>

        {/* Platform / Codolio Icon */}
        <div className="flex-shrink-0">
          <PlatformIcon platform={platform} url={problemUrl} size={16} />
        </div>

        {/* Question Area - title and difficulty */}
        <div className="flex-1 flex items-center justify-between md:justify-start gap-2 sm:gap-3 min-w-0">
          {problemUrl ? (
            <a
              href={problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs sm:text-sm truncate transition-colors hover:text-orange-500 ${
                question.isSolved
                  ? "text-slate-400 dark:text-slate-500 line-through"
                  : "text-slate-800 dark:text-slate-100 font-medium"
              }`}
              title={question.title}
            >
              {question.title}
            </a>
          ) : (
            <span
              className={`text-xs sm:text-sm truncate transition-colors ${
                question.isSolved
                  ? "text-slate-400 dark:text-slate-500 line-through"
                  : "text-slate-800 dark:text-slate-100 font-medium"
              }`}
              title={question.title}
            >
              {question.title}
            </span>
          )}

          {/* Difficulty Badge */}
          <div className="flex-shrink-0">
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>

        {/* Mobile Quick Action Buttons (Video & Delete) */}
        <div className="flex md:hidden items-center gap-0.5 flex-shrink-0">
          {resourceUrl && (
            <a
              href={resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-all"
              title="Video solution"
            >
              <IconVideo size={14} />
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              if (readOnly) {
                requestLogin?.("delete")
                return
              }
              setShowDeleteModal(true)
            }}
            className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded transition-all active:scale-90 cursor-pointer"
            title="Delete question"
          >
            <IconTrash size={13} />
          </button>
        </div>

        {/* Links and Actions - Desktop */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {problemUrl && (
            <a
              href={problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
              title="Open problem"
            >
              <IconExternalLink size={16} />
            </a>
          )}
          {resourceUrl && (
            <a
              href={resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
              title="Video solution"
            >
              <IconVideo size={16} />
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              if (readOnly) {
                requestLogin?.("delete")
                return
              }
              setShowDeleteModal(true)
            }}
            className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all active:scale-90 cursor-pointer"
            title="Delete question"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteQuestion(question._id)}
        title="Delete Question"
        message={`Are you sure you want to delete "${question.title}"?`}
        confirmText="Delete"
        danger
      />
    </>
  )
}
