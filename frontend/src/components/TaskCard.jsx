import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import client from '../api/client'
import toast from 'react-hot-toast'
import { Pencil, Trash2, CalendarDays } from 'lucide-react'
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

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
  boardLabels = [],
}) {
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

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const handleToggle = async e => {
    e.stopPropagation()

    const res = await client.patch(
      `/boards/tasks/${task.id}/toggle/`
    )

    onUpdate(res.data)
  }

  const handleSave = async () => {
    const res = await client.patch(
      `/boards/tasks/${task.id}/`,
      form
    )

    onUpdate(res.data)
    setEditing(false)

    toast.success('Task updated')
  }

  const handleDelete = async e => {
    e.stopPropagation()

    toast(
      t => (
        <div className="flex items-center gap-3">
          <span>Delete this task?</span>

          <button
            onClick={async () => {
              toast.dismiss(t.id)

              await client.delete(`/boards/tasks/${task.id}/`)

              onDelete(task.id)

              toast.success('Task deleted')
            }}
            className="
              bg-red-500
              text-white
              px-3 py-1
              rounded-xl
              text-xs
            "
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="
              bg-slate-100
              text-slate-700
              px-3 py-1
              rounded-xl
              text-xs
            "
          >
            Cancel
          </button>
        </div>
      ),
      { duration: 5000 }
    )
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return

    const res = await client.post(
      `/boards/tasks/${task.id}/comments/`,
      { content: comment }
    )

    setComments([...comments, res.data])
    setComment('')

    toast.success('Comment added')
  }

  const toggleLabel = labelId => {
    const ids = form.label_ids.includes(labelId)
      ? form.label_ids.filter(id => id !== labelId)
      : [...form.label_ids, labelId]

    setForm({
      ...form,
      label_ids: ids,
    })
  }

  const isOverdue =
    task.due_date &&
    !task.is_completed &&
    new Date(task.due_date) < new Date()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        group
        bg-white
        rounded-3xl
        border border-slate-100
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        overflow-hidden
        ${
          task.is_completed
            ? 'opacity-60'
            : ''
        }
        ${
          isDragging
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }
      `}
    >

      {/* Main Card */}
      <div className="p-5">

        <div className="flex items-start gap-3">

          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`
              mt-1
              w-5 h-5
              rounded-full
              border-2
              flex items-center justify-center
              transition-all
              ${
                task.is_completed
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-slate-300 hover:border-indigo-400'
              }
            `}
          >
            {task.is_completed && (
              <span className="text-white text-xs">
                ✓
              </span>
            )}
          </button>

          {/* Content */}
          <div
            className="flex-1"
            {...listeners}
            onClick={() => setExpanded(!expanded)}
          >

            {/* Title */}
            <h3
              className={`
                text-sm
                font-semibold
                leading-relaxed
                text-slate-800
                transition
                ${
                  task.is_completed
                    ? 'line-through text-slate-400'
                    : ''
                }
              `}
            >
              {task.title}
            </h3>

            {/* Description Preview */}
            {task.description && (
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Labels */}
            {task.labels &&
              task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {task.labels.map(label => (
                    <span
                      key={label.id}
                      className="
                        px-2 py-1
                        rounded-full
                        text-white
                        text-[10px]
                        font-medium
                        shadow-sm
                      "
                      style={{
                        backgroundColor: label.color,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mt-4">

              {/* Priority */}
              <span
                className={`
                  px-2.5 py-1
                  rounded-full
                  text-xs
                  font-medium
                  flex items-center gap-1.5
                  ${PRIORITY_STYLES[task.priority]}
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full
                    ${PRIORITY_DOT[task.priority]}
                  `}
                ></span>

                {task.priority}
              </span>

              {/* Due Date */}
              {task.due_date && (
                <span
                  className={`
                    inline-flex items-center gap-1
                    text-xs
                    px-2 py-1
                    rounded-full
                    ${
                      isOverdue
                        ? 'bg-red-50 text-red-500'
                        : 'bg-slate-100 text-slate-500'
                    }
                  `}
                >
                  <CalendarDays size={12} strokeWidth={2} /> {task.due_date}
                </span>
              )}

              {/* Assigned User */}
              {task.assigned_to && (
                <div className="
                  flex items-center gap-2
                  bg-slate-100
                  px-2 py-1
                  rounded-full
                ">
                  <div className="
                    w-5 h-5
                    rounded-full
                    bg-indigo-500
                    flex items-center justify-center
                  ">
                    <span className="text-white text-[10px] font-bold">
                      {task.assigned_to.username
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>

                  <span className="text-xs text-slate-600">
                    {task.assigned_to.username}
                  </span>
                </div>
              )}

              {/* Comments */}
              {comments.length > 0 && (
                <span className="
                  text-xs
                  text-slate-400
                ">
                  💬 {comments.length}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="
            flex flex-col gap-2
            opacity-0
            group-hover:opacity-100
            transition
          ">
            <button
              onClick={e => {
                e.stopPropagation()
                setEditing(true)
                setExpanded(true)
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
            
              <Pencil size={16} strokeWidth={2} />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div className="
          border-t border-slate-100
          bg-slate-50/50
          p-5
          space-y-5
        ">

          {/* Editing */}
          {editing ? (
            <div className="space-y-4">

              <input
                value={form.title}
                onChange={e =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Task title"
                className="
                  w-full
                  bg-white
                  border border-slate-200
                  rounded-2xl
                  px-4 py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                "
              />

              <textarea
                rows={4}
                value={form.description}
                onChange={e =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Description..."
                className="
                  w-full
                  bg-white
                  border border-slate-200
                  rounded-2xl
                  px-4 py-3
                  text-sm
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                "
              />

              <div className="grid grid-cols-2 gap-3">

                <select
                  value={form.priority}
                  onChange={e =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                  className="
                    bg-white
                    border border-slate-200
                    rounded-2xl
                    px-4 py-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                >
                  <option value="low">
                    🟢 Low
                  </option>

                  <option value="medium">
                    🟡 Medium
                  </option>

                  <option value="high">
                    🔴 High
                  </option>
                </select>

                <input
                  type="date"
                  value={form.due_date}
                  onChange={e =>
                    setForm({
                      ...form,
                      due_date: e.target.value,
                    })
                  }
                  className="
                    bg-white
                    border border-slate-200
                    rounded-2xl
                    px-4 py-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                />
              </div>

              {/* Labels */}
              {boardLabels.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    Labels
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {boardLabels.map(label => (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() =>
                          toggleLabel(label.id)
                        }
                        style={{
                          backgroundColor: label.color,
                        }}
                        className={`
                          px-3 py-1.5
                          rounded-full
                          text-white
                          text-xs
                          font-medium
                          transition
                          ${
                            form.label_ids.includes(label.id)
                              ? 'opacity-100 ring-2 ring-offset-2 ring-slate-300'
                              : 'opacity-40 hover:opacity-80'
                          }
                        `}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="
                    px-5 py-2.5
                    rounded-2xl
                    bg-black
                    text-white
                    text-sm
                    font-medium
                    hover:scale-105
                    active:scale-95
                    transition
                  "
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="
                    px-5 py-2.5
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    text-slate-600
                    text-sm
                    hover:bg-slate-50
                    transition
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            task.description && (
              <div className="
                bg-white
                border border-slate-100
                rounded-2xl
                p-4
              ">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )
          )}

          {/* Comments */}
          <div>

            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700">
                Comments
              </h4>

              <span className="
                text-xs
                bg-slate-200
                text-slate-600
                px-2 py-1
                rounded-full
              ">
                {comments.length}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {comments.map(c => (
                <div
                  key={c.id}
                  className="
                    bg-white
                    border border-slate-100
                    rounded-2xl
                    p-4
                  "
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="
                      w-7 h-7
                      rounded-full
                      bg-indigo-500
                      flex items-center justify-center
                    ">
                      <span className="text-white text-xs font-bold">
                        {c.author.username
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {c.author.username}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {new Date(
                          c.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="flex gap-3">
              <input
                value={comment}
                onChange={e =>
                  setComment(e.target.value)
                }
                onKeyDown={e =>
                  e.key === 'Enter' &&
                  handleAddComment()
                }
                placeholder="Write a comment..."
                className="
                  flex-1
                  bg-white
                  border border-slate-200
                  rounded-2xl
                  px-4 py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                "
              />

              <button
                onClick={handleAddComment}
                className="
                  px-5
                  rounded-2xl
                  bg-black
                  text-white
                  text-sm
                  font-medium
                  hover:scale-105
                  active:scale-95
                  transition
                "
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}