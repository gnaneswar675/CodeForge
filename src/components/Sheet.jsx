import { useSheetStore } from "../store/sheetStore"
import Topic from "./Topic"

export default function Sheet() {
  const sheet = useSheetStore((s) => s.sheet)

  if (!sheet) {
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Loading...
      </p>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      {/* SHEET TITLE */}
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center">
        {sheet.title}
      </h1>

      {/* TOPICS LIST */}
      <div className="space-y-8">
        {sheet.topics.map((topic) => (
          <Topic key={topic.id} topic={topic} subTopics={sheet.subTopics[topic] || {}} />
        ))}
      </div>
    </div>
  )
}
