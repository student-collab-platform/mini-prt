import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import toast from 'react-hot-toast'

export default function WorkspaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState(null)
  const [boards, setBoards] = useState([])
  const [boardName, setBoardName] = useState('')
  const [showBoardForm, setShowBoardForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [editingBoard, setEditingBoard] = useState(null)
  const [editingBoardName, setEditingBoardName] = useState('')
  const [activeTab, setActiveTab] = useState('boards')
  const [activities, setActivities] = useState([])

  useEffect(() => {
    client.get(`/workspaces/${id}/`).then(res => setWorkspace(res.data))
    client.get(`/boards/workspace/${id}/`).then(res => setBoards(res.data))
    client.get(`/boards/activity/${id}/`).then(res => setActivities(res.data))
  }, [id])

  const createBoard = async (e) => {
    e.preventDefault()
    if (!boardName.trim()) return
    const res = await client.post(`/boards/workspace/${id}/`, { name: boardName })
    setBoards([...boards, res.data])
    setBoardName('')
    setShowBoardForm(false)
    toast.success('Board created')
  }

  const inviteMember = async (e) => {
    e.preventDefault()
    try {
      await client.post(`/workspaces/${id}/invite/`, { email: inviteEmail, role: 'member' })
      setInviteEmail('')
      const res = await client.get(`/workspaces/${id}/`)
      setWorkspace(res.data)
      toast.success('Member invited successfully')
    } catch {
      toast.error('User not found or already a member.')
    }
  }

  const saveEditingBoard = async (boardId) => {
    await client.patch(`/boards/${boardId}/`, { name: editingBoardName })
    setBoards(boards.map(b => b.id === boardId ? { ...b, name: editingBoardName } : b))
    setEditingBoard(null)
    toast.success('Board renamed')
  }

  const deleteBoard = async (boardId) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Delete this board?</span>
        <button
          onClick={async () => {
            toast.dismiss(t.id)
            await client.delete(`/boards/${boardId}/`)
            setBoards(boards.filter(b => b.id !== boardId))
            toast.success('Board deleted')
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

  if (!workspace) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
        >
          ← Back to workspaces
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
            <span className={`mt-1 inline-block text-xs px-2 py-1 rounded-full font-medium ${
              workspace.my_role === 'admin'
                ? 'bg-indigo-50 text-indigo-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {workspace.my_role}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {/* Boards tab - visible to all */}
          <button
            onClick={() => setActiveTab('boards')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'boards'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Boards ({boards.length})
          </button>

          {/* Members tab - admin only */}
          {workspace.my_role === 'admin' && (
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'members'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Members ({workspace.members.length})
            </button>
          )}

          {/* Activity tab - visible to all */}
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Boards Tab */}
      {activeTab === 'boards' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Boards</h2>
            <button
              onClick={() => setShowBoardForm(!showBoardForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              + New Board
            </button>
          </div>

          {showBoardForm && (
            <form onSubmit={createBoard} className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex gap-2">
                <input
                  autoFocus
                  placeholder="Board name"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={boardName}
                  onChange={e => setBoardName(e.target.value)}
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowBoardForm(false)}
                  className="text-gray-500 px-4 py-2 rounded-lg text-sm border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {boards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <span className="text-3xl">📌</span>
              <p className="text-gray-500 mt-2 text-sm">No boards yet. Create your first board.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {boards.map(board => (
                <div key={board.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
                  {editingBoard === board.id ? (
                    <div className="flex gap-2">
                      <input
                        className="border border-gray-300 rounded-lg px-2 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingBoardName}
                        onChange={e => setEditingBoardName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEditingBoard(board.id)
                          if (e.key === 'Escape') setEditingBoard(null)
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveEditingBoard(board.id)}
                        className="text-indigo-600 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBoard(null)}
                        className="text-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <h3
                        className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => navigate(`/boards/${board.id}`)}
                      >
                        {board.name}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingBoard(board.id); setEditingBoardName(board.name) }}
                          className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteBoard(board.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                  <p
                    className="text-xs text-indigo-500 mt-2 cursor-pointer hover:underline"
                    onClick={() => navigate(`/boards/${board.id}`)}
                  >
                    Open board →
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab - admin only */}
      {activeTab === 'members' && workspace.my_role === 'admin' && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Member</h2>
            <form onSubmit={inviteMember} className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@example.com"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Invite
              </button>
            </form>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Members</h2>
          <div className="space-y-2">
            {workspace.members.map(m => (
              <div key={m.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: m.user.avatar_color || '#6366f1' }}
                  >
                    <span className="text-white font-semibold text-sm">
                      {m.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.user.username}</p>
                    <p className="text-xs text-gray-400">{m.user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  m.role === 'admin'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab - visible to all members */}
      {activeTab === 'activity' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Feed</h2>
          {activities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <span className="text-3xl">📜</span>
              <p className="text-gray-500 mt-2 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: activity.user.avatar_color || '#6366f1' }}
                  >
                    <span className="text-white font-semibold text-xs">
                      {activity.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{activity.user.username}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(activity.created_at).toLocaleDateString()} at{' '}
                      {new Date(activity.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}