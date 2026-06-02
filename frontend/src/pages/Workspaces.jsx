import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([])
  const [name, setName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    client.get('/workspaces/').then(res => {
      setWorkspaces(res.data)
      setLoading(false)
    })
  }, [])

  const create = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const res = await client.post('/workspaces/', { name })
    setWorkspaces([...workspaces, res.data])
    setName('')
    setShowForm(false)
  }

  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
    'bg-blue-500', 'bg-green-500', 'bg-orange-500'
  ]

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Workspaces</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your projects and collaborate with your team
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          New Workspace
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workspace name
          </label>
          <div className="flex gap-2">
            <input
              autoFocus
              placeholder="e.g. Final Year Project"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 px-4 py-2 rounded-lg text-sm border border-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">No workspaces yet</h3>
          <p className="text-gray-400 text-sm">Create your first workspace to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, index) => (
            <div
              key={ws.id}
              onClick={() => navigate(`/workspaces/${ws.id}`)}
              className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className={`w-10 h-10 ${colors[index % colors.length]} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white font-bold text-lg">
                  {ws.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {ws.name}
              </h2>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  ws.my_role === 'admin'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {ws.my_role}
                </span>
                <span className="text-xs text-gray-400">
                  {ws.members.length} member{ws.members.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}