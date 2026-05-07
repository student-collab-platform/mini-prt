import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

export default function KanbanColumn({ column, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  const handleAdd = () => {
    if (!title.trim()) return
    onAddTask(column.id, title)
    setTitle('')
    setAdding(false)
  }

  return (
    <div
      className={`rounded p-4 w-72 flex-shrink-0 transition-colors duration-150 ${
        isOver ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
      }`}
    >
      <h3 className="font-semibold mb-3">{column.name}</h3>

      <div
        ref={setNodeRef}
        className="space-y-2 min-h-[200px]"
      >
        {column.tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {adding ? (
        <div className="mt-3 space-y-2">
          <input
            autoFocus
            placeholder="Task title"
            className="w-full border p-2 rounded text-sm"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') setAdding(false)
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="text-gray-500 text-sm px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded py-1"
        >
          + Add task
        </button>
      )}
    </div>
  )
}