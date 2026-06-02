import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import client from '../api/client'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'

export default function KanbanColumn({ column, onAddTask, onUpdateTask, onDeleteTask, onUpdateColumn, onDeleteColumn, searchQuery, boardLabels }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [columnName, setColumnName] = useState(column.name)

  const handleAdd = () => {
    if (!title.trim()) return
    onAddTask(column.id, title)
    setTitle('')
    setAdding(false)
  }

  const handleRenameColumn = async () => {
    if (!columnName.trim()) return
    await client.patch(`/boards/columns/${column.id}/`, { name: columnName })
    onUpdateColumn(column.id, columnName)
    setEditingName(false)
    toast.success('Column renamed')
  }
  const handleDeleteColumn = async () => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Delete column and all tasks?</span>
        <button
          onClick={async () => {
            toast.dismiss(t.id)
            await client.delete(`/boards/columns/${column.id}/`)
            onDeleteColumn(column.id)
            toast.success('Column deleted')
        }}
        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
      >
        Delete
      </button>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
      >
        Cancel
      </button>
     </div>
    ), { duration: 5000 })
  }

  const filteredTasks = searchQuery
    ? column.tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : column.tasks

  const completedCount = column.tasks.filter(t => t.is_completed).length
  const progress = column.tasks.length > 0
    ? Math.round((completedCount / column.tasks.length) * 100)
    : 0

  return (
    <div className={`rounded-xl p-4 w-72 flex-shrink-0 transition-all duration-150 ${
      isOver ? 'bg-indigo-50 ring-2 ring-indigo-300' : 'bg-gray-50 border border-gray-200'
    }`}>
      {/* Column header */}
      <div className="flex justify-between items-center mb-2">
        {editingName ? (
          <div className="flex gap-1 flex-1">
            <input
              autoFocus
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={columnName}
              onChange={e => setColumnName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRenameColumn()
                if (e.key === 'Escape') setEditingName(false)
              }}
            />
            <button onClick={handleRenameColumn} className="text-indigo-600 text-xs font-medium">
              Save
            </button>
          </div>
        ) : (
          <h3 className="font-semibold text-gray-700 text-sm">{column.name}</h3>
        )}
        <div className="flex items-center gap-1">
          <span className="text-xs bg-gray-200 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {column.tasks.length}
          </span>
          <button
            onClick={() => setEditingName(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <Pencil size={16} strokeWidth={2} />
          </button>
          <button
            onClick={handleDeleteColumn}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {column.tasks.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{completedCount}/{column.tasks.length} done</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tasks */}
      <div ref={setNodeRef} className="space-y-2 min-h-[200px]">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            boardLabels={boardLabels}
          />
        ))}
        {filteredTasks.length === 0 && searchQuery && (
          <p className="text-xs text-gray-400 text-center py-4">No matching tasks</p>
        )}
      </div>

      {/* Add task */}
      {adding ? (
        <div className="mt-3 space-y-2">
          <input
            autoFocus
            placeholder="Task title"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Add task
            </button>
            <button
              onClick={() => setAdding(false)}
              className="text-gray-500 text-xs px-3 py-1.5 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 w-full text-xs text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-dashed border-gray-300 hover:border-indigo-300 rounded-lg py-2 transition-colors"
        >
          + Add task
        </button>
      )}
    </div>
  )
}