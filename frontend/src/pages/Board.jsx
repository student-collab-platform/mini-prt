import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import LabelManager from '../components/LabelManager'

export default function Board() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [columnName, setColumnName] = useState('')
  const [activeTask, setActiveTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [labels, setLabels] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  useEffect(() => {
    client.get(`/boards/${id}/`).then(res => {
      setBoard(res.data)
      setLabels(res.data.labels || [])
    })
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

  const updateTask = (updatedTask) => {
    setBoard({
      ...board,
      columns: board.columns.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
      }))
    })
  }

  const deleteTask = (taskId) => {
    setBoard({
      ...board,
      columns: board.columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t.id !== taskId)
      }))
    })
  }

  const updateColumn = (columnId, newName) => {
    setBoard({
      ...board,
      columns: board.columns.map(col =>
        col.id === columnId ? { ...col, name: newName } : col
      )
    })
  }

  const deleteColumn = (columnId) => {
    setBoard({
      ...board,
      columns: board.columns.filter(col => col.id !== columnId)
    })
  }

  const handleDragStart = ({ active }) => {
    const task = board.columns.flatMap(col => col.tasks).find(t => t.id === active.id)
    setActiveTask(task)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null)
    if (!over) return

    const sourceColumn = board.columns.find(col => col.tasks.some(t => t.id === active.id))
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
        if (col.id === sourceColumn.id) return { ...col, tasks: col.tasks.filter(t => t.id !== active.id) }
        if (col.id === targetColumn.id) return { ...col, tasks: [...col.tasks, movedTask] }
        return col
      })
    })
  }

  if (!board) return (
    <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
  )

  const totalTasks = board.columns.flatMap(col => col.tasks).length
  const completedTasks = board.columns.flatMap(col => col.tasks).filter(t => t.is_completed).length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
          <div className="text-sm text-gray-500">
            {completedTasks}/{totalTasks} tasks completed
          </div>
        </div>

        {/* Board progress bar */}
        {totalTasks > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{progress}% complete</p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <form onSubmit={addColumn} className="flex gap-2">
          <input
            placeholder="New column name"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={columnName}
            onChange={e => setColumnName(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Add Column
          </button>
        </form>

        <div className="mb-4">
          <LabelManager
            boardId={id}
            labels={labels}
            onLabelsChange={setLabels}
          />
        </div>
        {/* Search */}
        <input
          placeholder="🔍 Search tasks..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map(col => (
            <KanbanColumn
              key={col.id}
              column={col}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onUpdateColumn={updateColumn}
              onDeleteColumn={deleteColumn}
              searchQuery={searchQuery}
              boardLabels={labels}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white border border-indigo-200 p-3 rounded-lg shadow-lg text-sm w-72 opacity-95">
              <p className="font-medium text-gray-800">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}