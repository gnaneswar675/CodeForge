import { useState } from "react"
import { useSheetStore } from "../store/sheetStore"
import SubTopic from "./SubTopic"
import ConfirmModal from "./ConfirmModal"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import {
  IconGrip,
  IconPlus,
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconCheck,
  IconFolder,
  IconPlusCircle,
} from "./Icons"

// Add dragHandleProps as a prop for topic-level reordering
export default function Topic({ topic, subTopics, dragHandleProps }) {
  const [newSub, setNewSub] = useState("")
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(topic)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const readOnly = useSheetStore((s) => s.readOnly)
  const requestLogin = useSheetStore((s) => s.requestLogin)
  const addSubTopic = useSheetStore((s) => s.addSubTopic)
  const editTopic = useSheetStore((s) => s.editTopic)
  const deleteTopic = useSheetStore((s) => s.deleteTopic)
  const config = useSheetStore((s) => s.sheet?.sheet?.config || {})

  const orderedSubTopics = config.subTopicOrder?.[topic] || Object.keys(subTopics)

  const questionCount = Object.values(subTopics).reduce(
    (sum, qs) => sum + qs.filter((q) => !q.isPlaceholder).length,
    0,
  )
  const solvedCount = Object.values(subTopics).reduce(
    (sum, qs) => sum + qs.filter((q) => q.isSolved && !q.isPlaceholder).length,
    0,
  )
  const percentSolved = Math.round((solvedCount / (questionCount || 1)) * 100)

  const handleSaveEdit = () => {
    if (readOnly) {
      setIsEditing(false)
      requestLogin?.("edit")
      return
    }
    if (editName.trim() && editName !== topic) {
      editTopic(topic, editName.trim())
    }
    setIsEditing(false)
  }

  const handleAddSubTopic = () => {
    if (readOnly) {
      requestLogin?.("add")
      return
    }
    if (!newSub.trim()) return
    addSubTopic(topic, newSub.trim())
    setNewSub("")
  }

  return (
    <>
      <div
        className={`transition-all duration-200 rounded-2xl overflow-hidden ${
          open
            ? "border border-orange-300 dark:border-orange-500 ring-1 ring-orange-300/30 dark:ring-orange-500/25 bg-orange-500/[0.02] dark:bg-[#111724] shadow-sm"
            : "border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#131926] hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
        }`}
      >
        {/* TOPIC HEADER */}
        <div
          className={`flex items-center justify-between px-3.5 sm:px-5 py-3.5 sm:py-4 cursor-pointer transition-colors duration-150 ${
            open
              ? "bg-orange-500/[0.03] dark:bg-white/[0.02]"
              : "hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
          }`}
          onClick={() => setOpen((o) => !o)}
        >
          {/* Left side: Drag handle, Chevron, Folder Icon, and Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Topic Drag Handle Dots - Desktop Only */}
            <div
              {...dragHandleProps}
              className="hidden md:flex items-center justify-center p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors cursor-grab active:cursor-grabbing flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <IconGrip size={16} />
            </div>

            {/* Chevron */}
            <div className={`transition-colors ${open ? "text-orange-500" : "text-slate-400 dark:text-slate-500"}`}>
              {open ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </div>

            {/* Folder Icon in vibrant orange */}
            <div className="text-orange-500 flex-shrink-0">
              <IconFolder size={18} />
            </div>

            {isEditing ? (
              <div
                className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit()
                    if (e.key === "Escape") {
                      setEditName(topic)
                      setIsEditing(false)
                    }
                  }}
                  autoFocus
                  className="w-full min-w-0 max-w-[160px] sm:max-w-xs md:max-w-sm px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold bg-white dark:bg-[#0c101a] border border-orange-500 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-orange-500/10 outline-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveEdit()
                  }}
                  className="p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
                >
                  <IconCheck size={14} />
                </button>
              </div>
            ) : (
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white m-0 truncate">
                {topic}
              </h2>
            )}
          </div>

          {/* Right side: Progress percentage, Mini bar, Edit & Delete */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Progress indicator */}
            <div className="flex flex-col items-end gap-1 min-w-[50px] sm:min-w-[80px]">
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
                {percentSolved}%
              </span>
              <div className="w-14 sm:w-20 h-1.5 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentSolved}%` }}
                />
              </div>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:border-slate-800 mx-0.5 sm:mx-1" />

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-0.5 sm:gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (readOnly) {
                    requestLogin?.("edit")
                    return
                  }
                  setIsEditing(true)
                }}
                className="p-1.5 text-slate-400 hover:text-orange-500 dark:text-slate-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-all active:scale-90 cursor-pointer"
                title="Edit Topic"
              >
                <IconEdit size={15} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (readOnly) {
                    requestLogin?.("delete")
                    return
                  }
                  setShowDeleteModal(true)
                }}
                className="p-1.5 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all active:scale-90 cursor-pointer"
                title="Delete Topic"
              >
                <IconTrash size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        {open && (
          <div className="px-3.5 sm:px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
            {/* ADD SUBTOPIC UI */}
            <div className="my-3">
              <div className="flex items-center gap-1.5 mb-2">
                <IconPlusCircle size={16} className="text-orange-500" />
                <span className="text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400">
                  New Subtopic
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  placeholder="e.g. Priority Queue, Binary Search..."
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSub.trim()) {
                      handleAddSubTopic()
                    }
                  }}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleAddSubTopic}
                  disabled={!newSub.trim()}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-orange-500 dark:text-slate-950 dark:hover:bg-orange-400 hover:bg-slate-800 rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <IconPlus size={16} />
                  Add
                </button>
              </div>
            </div>

            {/* SUBTOPICS LIST */}
            <Droppable droppableId={`subtopics-${topic}`} type="SUBTOPIC">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-3.5 mt-4"
                >
                  {orderedSubTopics.map((sub, index) => (
                    <Draggable key={sub} draggableId={`${topic}-${sub}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#131926] transition-all overflow-hidden ${
                            snapshot.isDragging ? "shadow-xl z-50 ring-2 ring-orange-500" : "hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-stretch w-full">
                            {/* SubTopic Drag Handle Strip */}
                            <div
                              {...provided.dragHandleProps}
                              className="hidden sm:flex w-7 items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-r border-slate-100 dark:border-slate-800"
                            >
                              <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors">
                                <IconGrip size={13} />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 p-2.5 sm:p-3">
                              <SubTopic
                                topic={topic}
                                subTopic={sub}
                                questions={subTopics[sub] || []}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {orderedSubTopics.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                      <p className="text-slate-400 dark:text-slate-600 text-xs sm:text-sm">
                        No subtopics yet. Add one above to start organizing.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteTopic(topic)}
        title="Delete Topic"
        message={`Are you sure you want to delete "${topic}"? This will also remove all subtopics and questions under it.`}
        confirmText="Delete"
        danger
      />
    </>
  )
}
