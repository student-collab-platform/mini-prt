import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const workspacesRes = await client.get('/workspaces/')
      const workspaces = workspacesRes.data

      const allTasks = []
      const overdueTasks = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (const ws of workspaces) {
        const boardsRes = await client.get(`/boards/workspace/${ws.id}/`)
        for (const board of boardsRes.data) {
          const boardRes = await client.get(`/boards/${board.id}/`)
          for (const col of boardRes.data.columns) {
            for (const task of col.tasks) {
              const taskWithMeta = {
                ...task,
                boardName: board.name,
                workspaceName: ws.name,
                boardId: board.id,
              }
              if (task.assigned_to?.id === user.id || !task.assigned_to) {
                allTasks.push(taskWithMeta)
              }
              if (task.due_date && !task.is_completed) {
                const due = new Date(task.due_date)
                if (due < today) {
                  overdueTasks.push(taskWithMeta)
                }
              }
            }
          }
        }
      }

      const completed = allTasks.filter(t => t.is_completed).length
      const pending = allTasks.filter(t => !t.is_completed).length
      const high = allTasks.filter(t => t.priority === 'high' && !t.is_completed).length

      setData({
        workspaces,
        allTasks,
        overdueTasks,
        stats: { completed, pending, high, total: allTasks.length }
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  const PRIORITY_STYLES = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading dashboard...
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.username} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening across your workspaces
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: data.stats.total, color: 'bg-indigo-50 text-indigo-700', icon: '📋' },
          { label: 'Completed', value: data.stats.completed, color: 'bg-green-50 text-green-700', icon: '✅' },
          { label: 'Pending', value: data.stats.pending, color: 'bg-yellow-50 text-yellow-700', icon: '⏳' },
          { label: 'High Priority', value: data.stats.high, color: 'bg-red-50 text-red-700', icon: '🔴' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm font-medium opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overdue tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            Overdue Tasks
            {data.overdueTasks.length > 0 && (
              <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                {data.overdueTasks.length}
              </span>
            )}
          </h2>
          {data.overdueTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No overdue tasks 🎉</p>
          ) : (
            <div className="space-y-2">
              {data.overdueTasks.slice(0, 5).map(task => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/boards/${task.boardId}`)}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.boardName} · {task.workspaceName}</p>
                  </div>
                  <span className="text-xs text-red-500 font-medium">{task.due_date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High priority tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔴</span>
            High Priority
          </h2>
          {data.allTasks.filter(t => t.priority === 'high' && !t.is_completed).length === 0 ? (
            <p className="text-gray-400 text-sm">No high priority tasks</p>
          ) : (
            <div className="space-y-2">
              {data.allTasks
                .filter(t => t.priority === 'high' && !t.is_completed)
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/boards/${task.boardId}`)}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.boardName}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent workspaces */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">My Workspaces</h2>
          <div className="space-y-2">
            {data.workspaces.map((ws, index) => {
              const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500']
              return (
                <div
                  key={ws.id}
                  onClick={() => navigate(`/workspaces/${ws.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 ${colors[index % colors.length]} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">
                      {ws.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{ws.name}</p>
                    <p className="text-xs text-gray-400">{ws.members.length} members</p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                    ws.my_role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {ws.my_role}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming due dates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span>
            Upcoming Due Dates
          </h2>
          {data.allTasks.filter(t => t.due_date && !t.is_completed).length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming deadlines</p>
          ) : (
            <div className="space-y-2">
              {data.allTasks
                .filter(t => t.due_date && !t.is_completed)
                .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/boards/${task.boardId}`)}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.boardName}</p>
                    </div>
                    <span className="text-xs text-gray-500">{task.due_date}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}