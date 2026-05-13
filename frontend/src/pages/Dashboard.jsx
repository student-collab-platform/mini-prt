import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workspacesRes = await client.get('/workspaces/')
        const workspaces = workspacesRes.data

        const allTasks = []
        const overdueTasks = []

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (const ws of workspaces) {
          try {
            const boardsRes = await client.get(`/boards/workspace/${ws.id}/`)

            for (const board of boardsRes.data) {
              try {
                const boardRes = await client.get(`/boards/${board.id}/`)

                for (const col of boardRes.data.columns) {
                  for (const task of col.tasks) {
                    const taskWithMeta = {
                      ...task,
                      boardName: board.name,
                      workspaceName: ws.name,
                      boardId: board.id,
                    }

                    allTasks.push(taskWithMeta)

                    if (task.due_date && !task.is_completed) {
                      const due = new Date(task.due_date)

                      if (due < today) {
                        overdueTasks.push(taskWithMeta)
                      }
                    }
                  }
                }
              } catch (e) {
                console.error('Board fetch error', e)
              }
            }
          } catch (e) {
            console.error('Workspace boards fetch error', e)
          }
        }

        const completed = allTasks.filter(t => t.is_completed).length
        const pending = allTasks.filter(t => !t.is_completed).length
        const high = allTasks.filter(
          t => t.priority === 'high' && !t.is_completed
        ).length

        setData({
          workspaces,
          allTasks,
          overdueTasks,
          stats: {
            completed,
            pending,
            high,
            total: allTasks.length,
          },
        })
      } catch (e) {
        console.error(e)
        setError('Failed to load dashboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const PRIORITY_STYLES = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-slate-400 text-lg animate-pulse">
          Loading your workspace...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-2xl">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Good{' '}
          {new Date().getHours() < 12
            ? 'morning'
            : new Date().getHours() < 18
            ? 'afternoon'
            : 'evening'}
          , {user.username} 👋
        </h1>

        <p className="text-slate-500 text-lg mt-3">
          Here's an overview of your productivity and workspace activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        {[
          {
            label: 'Total Tasks',
            value: data.stats.total,
            icon: '📋',
          },
          {
            label: 'Completed',
            value: data.stats.completed,
            icon: '✅',
          },
          {
            label: 'Pending',
            value: data.stats.pending,
            icon: '⏳',
          },
          {
            label: 'High Priority',
            value: data.stats.high,
            icon: '🔥',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="
              bg-white
              rounded-3xl
              p-6
              border border-slate-100
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            <div className="text-3xl mb-4">
              {stat.icon}
            </div>

            <h2 className="text-4xl font-bold text-slate-900">
              {stat.value}
            </h2>

            <p className="text-slate-500 mt-2 text-sm font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Overdue */}
        <div className="
          bg-white
          rounded-3xl
          border border-slate-100
          shadow-sm
          p-6
        ">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Overdue Tasks
            </h2>

            {data.overdueTasks.length > 0 && (
              <span className="
                ml-auto
                px-3 py-1
                rounded-full
                bg-red-100
                text-red-600
                text-xs
                font-semibold
              ">
                {data.overdueTasks.length}
              </span>
            )}
          </div>

          {data.overdueTasks.length === 0 ? (
            <div className="text-slate-400 text-sm">
              No overdue tasks 🎉
            </div>
          ) : (
            <div className="space-y-3">
              {data.overdueTasks.slice(0, 5).map(task => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/boards/${task.boardId}`)}
                  className="
                    group
                    p-4
                    rounded-2xl
                    bg-red-50
                    hover:bg-red-100
                    transition
                    cursor-pointer
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-black">
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {task.boardName} · {task.workspaceName}
                      </p>
                    </div>

                    <span className="text-xs text-red-500 font-medium whitespace-nowrap">
                      {task.due_date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Priority */}
        <div className="
          bg-white
          rounded-3xl
          border border-slate-100
          shadow-sm
          p-6
        ">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            High Priority
          </h2>

          {data.allTasks.filter(
            t => t.priority === 'high' && !t.is_completed
          ).length === 0 ? (
            <div className="text-slate-400 text-sm">
              No high priority tasks
            </div>
          ) : (
            <div className="space-y-3">
              {data.allTasks
                .filter(t => t.priority === 'high' && !t.is_completed)
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/boards/${task.boardId}`)}
                    className="
                      p-4
                      rounded-2xl
                      bg-slate-50
                      hover:bg-slate-100
                      transition
                      cursor-pointer
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {task.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {task.boardName}
                        </p>
                      </div>

                      <span className={`
                        text-xs
                        px-3 py-1
                        rounded-full
                        font-medium
                        ${PRIORITY_STYLES[task.priority]}
                      `}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Workspaces */}
        <div className="
          bg-white
          rounded-3xl
          border border-slate-100
          shadow-sm
          p-6
        ">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            My Workspaces
          </h2>

          {data.workspaces.length === 0 ? (
            <div className="text-slate-400 text-sm">
              No workspaces yet
            </div>
          ) : (
            <div className="space-y-3">
              {data.workspaces.map((ws, index) => {
                const colors = [
                  'bg-indigo-500',
                  'bg-violet-500',
                  'bg-pink-500',
                  'bg-blue-500',
                ]

                return (
                  <div
                    key={ws.id}
                    onClick={() => navigate(`/workspaces/${ws.id}`)}
                    className="
                      flex items-center gap-4
                      p-4
                      rounded-2xl
                      hover:bg-slate-50
                      transition
                      cursor-pointer
                    "
                  >
                    <div className={`
                      w-11 h-11
                      rounded-2xl
                      flex items-center justify-center
                      text-white font-bold
                      shadow-sm
                      ${colors[index % colors.length]}
                    `}>
                      {ws.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {ws.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {ws.members.length} members
                      </p>
                    </div>

                    <span className={`
                      ml-auto
                      text-xs
                      px-3 py-1
                      rounded-full
                      font-medium
                      ${
                        ws.my_role === 'admin'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }
                    `}>
                      {ws.my_role}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="
          bg-white
          rounded-3xl
          border border-slate-100
          shadow-sm
          p-6
        ">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Upcoming Deadlines
          </h2>

          {data.allTasks.filter(
            t => t.due_date && !t.is_completed
          ).length === 0 ? (
            <div className="text-slate-400 text-sm">
              No upcoming deadlines
            </div>
          ) : (
            <div className="space-y-3">
              {data.allTasks
                .filter(t => t.due_date && !t.is_completed)
                .sort(
                  (a, b) =>
                    new Date(a.due_date) - new Date(b.due_date)
                )
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/boards/${task.boardId}`)}
                    className="
                      p-4
                      rounded-2xl
                      bg-slate-50
                      hover:bg-slate-100
                      transition
                      cursor-pointer
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {task.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {task.boardName}
                        </p>
                      </div>

                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {task.due_date}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}