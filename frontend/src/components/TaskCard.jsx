import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded shadow text-sm select-none"
    >
      <p className="font-medium">{task.title}</p>
      {task.description && (
        <p className="text-gray-500 text-xs mt-1">{task.description}</p>
      )}
      {task.assigned_to && (
        <p className="text-xs text-blue-500 mt-1">@{task.assigned_to.username}</p>
      )}
    </div>
  )
}