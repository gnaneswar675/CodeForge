import { useState } from "react"

export default function EditableText({ value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)

  return editing ? (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        onSave(text)
        setEditing(false)
      }}
      autoFocus
      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer text-gray-800 text-sm md:text-base hover:bg-indigo-50 px-2 py-1 rounded transition"
    >
      {value}
    </span>
  )
}
