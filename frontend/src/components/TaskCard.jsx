import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import client from '../api/client'
import toast from 'react-hot-toast'

const PRIORITY_STYLES = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const PRIORITY_DOT = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
}

export default function TaskCard({ task, onUpdate, onDelete, boardLabels = [] }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    due_date: task.due_date || '',
    assigned_to_id: task.assigned_to?.id || null,
    label_ids: task.labels?.map(l => l.id) || [],
  })
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(task.comments || [])

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  const handleToggle = async (e) => {
    e.stopPropagation()
    const res = await client.patch(`/boards/tasks/${task.id}/toggle/`)
    onUpdate(res.data)
  }

  const handleSave = async () => {
    const res = await client.patch(`/boards/tasks/${task.id}/`, form)
    onUpdate(res.data)
    setEditing(false)
    toast.success('Task updated')
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Delete this task?</span>
        <button
          onClick={async () => {
            toast.dismiss(t.id)
            await client.delete(`/boards/tasks/${task.id}/`)
            onDelete(task.id)
            toast.success('Task deleted')
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

  const handleAddComment = async () => {
    if (!comment.trim()) return
    const res = await client.post(`/boards/tasks/${task.id}/comments/`, { content: comment })
    setComments([...comments, res.data])
    setComment('')
    toast.success('Comment added')
  }

  const toggleLabel = (labelId) => {
    const ids = form.label_ids.includes(labelId)
      ? form.label_ids.filter(id => id !== labelId)
      : [...form.label_ids, labelId]
    setForm({ ...form, label_ids: ids })
  }

  const isOverdue = task.due_date && !task.is_completed && new Date(task.due_date) < new Date()

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`bg-white border rounded-lg shadow-sm text-sm select-none transition-shadow ${
          task.is_completed ? 'opacity-60 border-gray-200' : 'border-gray-200 hover:shadow-md'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className="p-3">
          <div className="flex items-start gap-2">
            {/* Checkbox */}
            <button
              onClick={handleToggle}
              className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                task.is_completed
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              {task.is_completed && (
                <span className="text-white text-xs">✓</span>
              )}
            </button>

            {/* Title */}
            <div
              className="flex-1"
              {...listeners}
              onClick={() => setExpanded(!expanded)}
            >
              <p className={`font-medium text-gray-800 leading-tight ${
                task.is_completed ? 'line-through text-gray-400' : ''
              }`}>
                {task.title}
              </p>

              {/* Labels on card */}
              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {task.labels.map(label => (
                    <span
                      key={label.id}
                      className="px-1.5 py-0.5 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${PRIORITY_STYLES[task.priority]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`}></span>
                  {task.priority}
                </span>

                {task.due_date && (
                  <span className={`text-xs flex items-center gap-1 ${
                    isOverdue ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    📅 {task.due_date}
                    {isOverdue && ' (overdue)'}
                  </span>
                )}

                {task.assigned_to && (
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-xs font-medium">
                        {task.assigned_to.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{task.assigned_to.username}</span>
                  </div>
                )}

                {comments.length > 0 && (
                  <span className="text-xs text-gray-400">💬 {comments.length}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(true); setExpanded(true) }}
                className="p-1 text-gray-300 hover:text-indigo-500 rounded"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-300 hover:text-red-500 rounded"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* Expanded section */}
        {expanded && (
          <div className="border-t border-gray-100 p-3 space-y-3">
            {editing ? (
              <div className="space-y-2">
                <input
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="Task title"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Description..."
                />
                <div className="flex gap-2">
                  <select
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.priority}
                    onChange={e => setForm({...form, priority: e.target.value})}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.due_date}
                    onChange={e => setForm({...form, due_date: e.target.value})}
                  />
                </div>

                {/* Label selector */}
                {boardLabels.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Labels</p>
                    <div className="flex flex-wrap gap-1">
                      {boardLabels.map(label => (
                        <button
                          key={label.id}
                          type="button"
                          onClick={() => toggleLabel(label.id)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium text-white transition-opacity ${
                            form.label_ids.includes(label.id) ? 'opacity-100 ring-2 ring-offset-1 ring-gray-400' : 'opacity-40'
                          }`}
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="text-gray-500 text-xs px-3 py-1.5 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              task.description && (
                <p className="text-xs text-gray-500">{task.description}</p>
              )
            )}

            {/* Comments */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">
                Comments ({comments.length})
              </p>
              <div className="space-y-2 mb-2">
                {comments.map(c => (
                  <div key={c.id} className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-medium text-indigo-600">
                        {c.author.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{c.content}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="bg-indigo-600 text-white px-2 py-1.5 rounded-lg text-xs"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}