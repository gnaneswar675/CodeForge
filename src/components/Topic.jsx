import { useState } from "react"
import { useSheetStore } from "../store/sheetStore"
import SubTopic from "./SubTopic"
import ConfirmModal from "./ConfirmModal"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { IconGrip, IconPlus, IconEdit, IconTrash, IconChevronDown, IconCheck } from "./Icons"

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
    (sum, qs) => sum + qs.filter(q => !q.isPlaceholder).length, 
    0
  )
  const solvedCount = Object.values(subTopics).reduce(
    (sum, qs) => sum + qs.filter(q => q.isSolved && !q.isPlaceholder).length, 
    0
  )

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

  return (
    <>
      <div 
        className={`bg-white dark:bg-slate-800 border transition-all duration-300 rounded-xl overflow-hidden ${
          open 
            ? 'border-amber-500/30 ring-1 ring-amber-500/30 shadow-lg dark:shadow-slate-900/50' 
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
        }`}
      >
        {/* TOPIC HEADER */}
        <div
          className={`flex items-center justify-between px-4 md:px-6 py-4 md:py-5 cursor-pointer transition-colors duration-200 ${
            open ? 'bg-slate-50/50 dark:bg-slate-700/20' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'
          }`}
          onClick={() => setOpen((o) => !o)}
        >
          {/* Left side - Drag dots, Chevron, and Title */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            
            {/* Topic Drag Handle Dots - Desktop Only */}
            <div 
              {...dragHandleProps}
              className="hidden md:flex items-center justify-center p-1 text-slate-300 dark:text-slate-600 hover:text-slate-400 transition-colors cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()} // Stop click from collapsing topic
            >
              <IconGrip size={18} />
            </div>

            <div
              className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ease-out ${
                open ? 'rotate-0 text-amber-500' : '-rotate-90'
              }`}
            >
              <IconChevronDown size={18} />
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') {
                      setEditName(topic)
                      setIsEditing(false)
                    }
                  }}
                  autoFocus
                  className="flex-1 max-w-[300px] px-3 py-2 text-base font-semibold bg-white dark:bg-slate-900 border border-amber-500 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveEdit()
                  }}
                  className="p-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
                >
                  <IconCheck size={18} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col min-w-0">
                <h2 className={`text-base md:text-lg font-bold m-0 truncate transition-colors ${open ? 'text-amber-600 dark:text-amber-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {topic}
                </h2>
              </div>
            )}
          </div>

          {/* Right side - Progress and Actions */}
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex flex-col items-end gap-1 min-w-[50px] md:min-w-[120px]">
              <span className={`text-[11px] md:text-xs font-bold ${
                solvedCount === questionCount && questionCount > 0 
                  ? 'text-green-500' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                {Math.round((solvedCount / (questionCount || 1)) * 100)}%
              </span>
              <div className="hidden md:block w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    solvedCount === questionCount && questionCount > 0
                      ? 'bg-green-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${(solvedCount / (questionCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="w-px h-6 md:h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (readOnly) {
                    requestLogin?.("edit")
                    return
                  }
                  setIsEditing(true)
                }}
                className="p-2 text-slate-400 hover:text-amber-600 dark:text-slate-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-all active:scale-90 cursor-pointer"
                title="Edit Topic"
              >
                <IconEdit size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (readOnly) {
                    requestLogin?.("delete")
                    return
                  }
                  setShowDeleteModal(true)
                }}
                className="p-2 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all active:scale-90 cursor-pointer"
                title="Delete Topic"
              >
                <IconTrash size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        {open && (
          <div className="px-4 md:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-700/50 animate-fade-in origin-top">
            {/* ADD SUBTOPIC UI */}
            <div className="flex flex-col sm:flex-row gap-3 my-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex-1">
                <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1 ml-1">
                  New Subtopic
                </label>
                <input
                  placeholder="e.g. Priority Queue, Binary Search..."
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSub.trim()) {
                      if (readOnly) {
                        requestLogin?.("add")
                        return
                      }
                      addSubTopic(topic, newSub.trim())
                      setNewSub("")
                    }
                  }}
                  className="w-full px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all shadow-sm"
                />
              </div>
              <button
                onClick={() => {
                  if (readOnly) {
                    requestLogin?.("add")
                    return
                  }
                  if (!newSub.trim()) return
                  addSubTopic(topic, newSub.trim())
                  setNewSub("")
                }}
                className="group flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 min-h-[40px] sm:self-end cursor-pointer"
                disabled={!newSub.trim()}
              >
                <IconPlus size={16} className="transition-transform group-hover:rotate-90" />
                Add
              </button>
            </div>

            {/* SUBTOPICS LIST */}
            <Droppable droppableId={`subtopics-${topic}`} type="SUBTOPIC">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-4 mt-2 px-0.5" 
                >
                  {orderedSubTopics.map((sub, index) => (
                    <Draggable
                      key={sub}
                      draggableId={`${topic}-${sub}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group border rounded-xl bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 transition-all duration-200 overflow-hidden ${
                            snapshot.isDragging 
                              ? 'border-amber-500 shadow-xl z-50' 
                              : 'hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-stretch w-full">
                            {/* SubTopic Drag Handle Strip */}
                            <div
                              {...provided.dragHandleProps}
                              className="w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-l-lg transition-colors border-r border-slate-100 dark:border-slate-700"
                            >
                              <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors">
                                <IconGrip size={14} />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 p-3 pl-1">
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
                      <p className="text-slate-400 dark:text-slate-600 text-sm">
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
