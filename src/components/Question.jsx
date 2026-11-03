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

  const platform = question.questionId?.platform || 'generic'
  const difficulty = question.questionId?.difficulty || question.difficulty || 'Medium'
  const problemUrl = question.questionId?.problemUrl || question.problemUrl
  const resourceUrl = question.resource

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-amber-500 rounded-lg shadow-lg">
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
          autoFocus
          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none"
        />
        <button onClick={handleSaveEdit} className="p-2 bg-amber-500 text-slate-900 rounded-lg cursor-pointer">
          <IconCheck size={16} />
        </button>
        <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 cursor-pointer">
          <IconX size={16} />
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="group flex items-center gap-3 px-3 md:px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 shadow-sm">
        {/* Drag Handle */}
        <div {...dragHandleProps} className="text-slate-300 md:text-slate-400 cursor-grab">
          <IconGrip size={14} />
        </div>

        {/* Solved Checkbox */}
        <button
          onClick={handleToggleSolved}
          aria-label={question.isSolved ? "Mark as unsolved" : "Mark as solved"}
          className={`flex items-center justify-center w-5 h-5 min-w-[20px] rounded-lg border-2 transition-all cursor-pointer ${
            question.isSolved ? 'bg-green-500 border-green-500' : 'bg-transparent border-slate-300 dark:border-slate-600 hover:border-amber-500'
          }`}
        >
          {question.isSolved && <IconCheck size={12} className="text-white" />}
        </button>

        {/* Platform Icon - Hidden on Mobile */}
        <div className="hidden md:block flex-shrink-0">
          <PlatformIcon platform={platform} url={problemUrl} size={18} />
        </div>

        {/* Question Area - justify-between pushes difficulty to the right on mobile */}
        <div className="flex-1 flex items-center justify-between md:justify-start gap-3 min-w-0">
          {problemUrl ? (
            <a 
              href={problemUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm truncate transition-colors hover:text-amber-500 ${
                question.isSolved 
                  ? 'text-slate-400 line-through' 
                  : 'text-slate-700 dark:text-slate-200 font-medium'
              }`}
              title={question.title}
            >
              {question.title}
            </a>
          ) : (
            <span
              className={`text-sm truncate transition-colors ${
                question.isSolved 
                  ? 'text-slate-400 line-through' 
                  : 'text-slate-700 dark:text-slate-200 font-medium'
              }`}
              title={question.title}
            >
              {question.title}
            </span>
          )}
          
          {/* Difficulty Badge - Right-aligned on mobile via parent justify-between */}
          <div className="flex-shrink-0">
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>

        {/* Links and Actions - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-1">
          {problemUrl && (
            <a href={problemUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all" title="Open problem">
              <IconExternalLink size={18} />
            </a>
          )}
          {resourceUrl && (
            <a href={resourceUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all" title="Video solution">
              <IconVideo size={18} />
            </a>
          )}
          <button
            onClick={() => {
              if (readOnly) {
                requestLogin?.("delete")
                return
              }
              setShowDeleteModal(true)
            }}
            className="p-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
            title="Delete Question"
          >
            <IconTrash size={16} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteQuestion(question._id)}
        title="Delete Question"
        danger
      />
    </>
  )
}
