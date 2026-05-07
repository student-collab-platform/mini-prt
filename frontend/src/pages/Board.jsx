import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  DndContext,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import client from '../api/client'
import KanbanColumn from '../components/KanbanColumn'

export default function Board() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [columnName, setColumnName] = useState('')
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  useEffect(() => {
    client.get(`/boards/${id}/`).then(res => setBoard(res.data))
  }, [id])

  const addColumn = async (e) => {
    e.preventDefault()
    if (!columnName.trim()) return
    const res = await client.post(`/boards/${id}/columns/`, {
      name: columnName,
      order: board.columns.length
    })
    setBoard({ ...board, columns: [...board.columns, { ...res.data, tasks: [] }] })
    setColumnName('')
  }

  const addTask = async (columnId, title) => {
    const res = await client.post(`/boards/columns/${columnId}/tasks/`, { title, order: 0 })
    setBoard({
      ...board,
      columns: board.columns.map(col =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, res.data] } : col
      )
    })
  }

  const handleDragStart = ({ active }) => {
    const task = board.columns
      .flatMap(col => col.tasks)
      .find(t => t.id === active.id)
    setActiveTask(task)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null)
    if (!over) return

    const sourceColumn = board.columns.find(col =>
      col.tasks.some(t => t.id === active.id)
    )

    const targetColumn = board.columns.find(col => col.id === over.id)

    if (!sourceColumn || !targetColumn) return
    if (sourceColumn.id === targetColumn.id) return

    const movedTask = sourceColumn.tasks.find(t => t.id === active.id)

    try {
      await client.patch(`/boards/tasks/${active.id}/move/`, {
        column_id: targetColumn.id,
        order: 0
      })
    } catch (err) {
      console.error('Failed to move task', err)
      return
    }

    setBoard({
      ...board,
      columns: board.columns.map(col => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== active.id) }
        }
        if (col.id === targetColumn.id) {
          return { ...col, tasks: [...col.tasks, movedTask] }
        }
        return col
      })
    })
  }

  if (!board) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{board.name}</h1>
      <form onSubmit={addColumn} className="flex gap-2 mb-6">
        <input
          placeholder="New column name"
          className="border p-2 rounded"
          value={columnName}
          onChange={e => setColumnName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Column
        </button>
      </form>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map(col => (
            <KanbanColumn key={col.id} column={col} onAddTask={addTask} />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white p-3 rounded shadow text-sm opacity-90 w-64">
              <p className="font-medium">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}