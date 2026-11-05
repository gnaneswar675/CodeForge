import { useState } from "react"
import { useSheetStore } from "../store/sheetStore"
import Question from "./Question"
import ConfirmModal from "./ConfirmModal"
import Modal from "./Modal"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { IconPlus, IconEdit, IconTrash, IconChevronDown, IconChevronRight, IconCheck } from "./Icons"

export default function SubTopic({ topic, subTopic, questions }) {
  const [isOpen, setIsOpen] = useState(false) // Manages question list visibility
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(subTopic)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Enhanced form state for adding questions with metadata
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    difficulty: "Medium",
    resource: "",
    problemUrl: "",
  })

  const readOnly = useSheetStore((s) => s.readOnly)
  const requestLogin = useSheetStore((s) => s.requestLogin)
  const addQuestion = useSheetStore((s) => s.addQuestion)
  const editSubTopic = useSheetStore((s) => s.editSubTopic)
  const deleteSubTopic = useSheetStore((s) => s.deleteSubTopic)
  const config = useSheetStore((s) => s.sheet?.sheet?.config || {})

  // Filter out placeholder questions
  const realQuestions = questions?.filter((q) => !q.isPlaceholder) || []

  // Get question order from config
  const key = `${topic}::${subTopic}`
  const questionOrder = config.questionOrder?.[key] || realQuestions.map((q) => q._id)

  // Sort questions by order
  const orderedQuestions = [...realQuestions].sort((a, b) => {
    const indexA = questionOrder.indexOf(a._id)
    const indexB = questionOrder.indexOf(b._id)
    return indexA - indexB
  })

  const handleSaveEdit = () => {
    if (readOnly) {
      setIsEditing(false)
      requestLogin?.("edit")
      return
    }
    if (editName.trim() && editName !== subTopic && editSubTopic) {
      editSubTopic(topic, subTopic, editName.trim())
    }
    setIsEditing(false)
  }

  const handleAddQuestion = () => {
    if (readOnly) {
      setShowAddModal(false)
      requestLogin?.("add")
      return
    }
    if (!newQuestion.title.trim()) return

    addQuestion({
      title: newQuestion.title.trim(),
      topic,
      subTopic,
      difficulty: newQuestion.difficulty,
      resource: newQuestion.resource,
      problemUrl: newQuestion.problemUrl,
      isSolved: false,
    })

    setNewQuestion({ title: "", difficulty: "Medium", resource: "", problemUrl: "" })
    setShowAddModal(false)
  }

  const solvedCount = realQuestions.filter((q) => q.isSolved).length

  return (
    <>
      <div className="w-full">
        {/* SubTopic Header - Toggles question visibility */}
        <div
          className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className={`transition-colors flex-shrink-0 ${isOpen ? "text-orange-500" : "text-slate-400 dark:text-slate-500"}`}>
              {isOpen ? <IconChevronDown size={15} /> : <IconChevronRight size={15} />}
            </div>

            {isEditing ? (
              <div
                className="flex items-center gap-1.5 flex-1 min-w-0 max-w-[160px] sm:max-w-[280px]"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit()
                    if (e.key === "Escape") {
                      setEditName(subTopic)
                      setIsEditing(false)
                    }
                  }}
                  autoFocus
                  className="w-full min-w-0 px-2.5 py-1 text-xs sm:text-sm bg-white dark:bg-[#0c101a] border border-orange-500 rounded-lg text-slate-900 dark:text-slate-100 outline-none"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveEdit()
                  }}
                  className="p-1 sm:p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer flex-shrink-0"
                >
                  <IconCheck size={14} />
                </button>
              </div>
            ) : (
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 m-0 truncate">
                {subTopic}
              </h3>
            )}

            {/* Solved/Total Count Badge */}
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0">
              {solvedCount}/{realQuestions.length}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                if (readOnly) {
                  requestLogin?.("add")
                  return
                }
                setShowAddModal(true)
              }}
              className="p-1.5 text-slate-400 hover:text-orange-500 transition-all active:scale-90 cursor-pointer"
              title="Add Question"
            >
              <IconPlus size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (readOnly) {
                  requestLogin?.("edit")
                  return
                }
                setIsEditing(true)
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all active:scale-90 cursor-pointer"
              title="Edit SubTopic"
            >
              <IconEdit size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (readOnly) {
                  requestLogin?.("delete")
                  return
                }
                setShowDeleteModal(true)
              }}
              className="p-1.5 text-slate-400 hover:text-rose-500 transition-all active:scale-90 cursor-pointer"
              title="Delete SubTopic"
            >
              <IconTrash size={14} />
            </button>
          </div>
        </div>

        {/* Questions List - Conditioned on isOpen */}
        {isOpen && (
          <Droppable droppableId={`questions::${topic}::${subTopic}`} type="QUESTION">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-2 mt-2 px-1 sm:px-2 py-2 bg-slate-50/70 dark:bg-[#0c101a]/70 rounded-xl border border-slate-100 dark:border-slate-800/60"
              >
                {orderedQuestions.length === 0 && (
                  <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    No questions yet.
                  </div>
                )}
                {orderedQuestions.map((q, index) => (
                  <Draggable key={q._id} draggableId={q._id} index={index}>
                    {(p, snapshot) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        className={`w-full transition-opacity duration-150 ${snapshot.isDragging ? "opacity-75" : "opacity-100"}`}
                        style={{ ...p.draggableProps.style }}
                      >
                        <Question question={q} dragHandleProps={p.dragHandleProps} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>

      {/* Add Question Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Question" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
              Question Title *
            </label>
            <input
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              placeholder="e.g., Search in a 2D matrix"
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Difficulty
              </label>
              <select
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 text-slate-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Problem Link
              </label>
              <input
                value={newQuestion.problemUrl}
                onChange={(e) => setNewQuestion({ ...newQuestion, problemUrl: e.target.value })}
                placeholder="LeetCode/GFG URL"
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
              Video/Resource Link
            </label>
            <input
              value={newQuestion.resource}
              onChange={(e) => setNewQuestion({ ...newQuestion, resource: e.target.value })}
              placeholder="YouTube/Article URL"
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            disabled={!newQuestion.title.trim()}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            Add Question
          </button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteSubTopic && deleteSubTopic(topic, subTopic)}
        title="Delete Subtopic"
        message={`Are you sure you want to delete "${subTopic}"? All questions in it will be removed.`}
        confirmText="Delete"
        danger
      />
    </>
  )
}
