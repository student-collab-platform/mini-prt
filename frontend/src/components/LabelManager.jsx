import { useState } from 'react'
import client from '../api/client'
import toast from 'react-hot-toast'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#6366f1', '#8b5cf6', '#ec4899',
]

export default function LabelManager({ boardId, labels, onLabelsChange }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')

  const createLabel = async () => {
    if (!name.trim()) return
    const res = await client.post(`/boards/${boardId}/labels/`, { name, color })
    onLabelsChange([...labels, res.data])
    setName('')
    setColor('#6366f1')
    setShowForm(false)
    toast.success('Label created')
  }

  const deleteLabel = async (labelId) => {
    await client.delete(`/boards/labels/${labelId}/`)
    onLabelsChange(labels.filter(l => l.id !== labelId))
    toast.success('Label deleted')
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Labels</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-indigo-600 hover:underline"
        >
          + New label
        </button>
      </div>

      {showForm && (
        <div className="mb-3 space-y-2">
          <input
            autoFocus
            placeholder="Label name"
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="flex gap-1 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={createLabel}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 text-xs border border-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {labels.map(label => (
          <div
            key={label.id}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
            <button
              onClick={() => deleteLabel(label.id)}
              className="ml-1 hover:opacity-70"
            >
              ×
            </button>
          </div>
        ))}
        {labels.length === 0 && !showForm && (
          <p className="text-xs text-gray-400">No labels yet</p>
        )}
      </div>
    </div>
  )
}