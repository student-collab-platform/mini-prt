import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function WorkspaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState(null)
  const [boards, setBoards] = useState([])
  const [boardName, setBoardName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [editingBoard, setEditingBoard] = useState(null)
  const [editingBoardName, setEditingBoardName] = useState('')

  useEffect(() => {
    client.get(`/workspaces/${id}/`).then(res => setWorkspace(res.data))
    client.get(`/boards/workspace/${id}/`).then(res => setBoards(res.data))
  }, [id])

  const createBoard = async (e) => {
    e.preventDefault()
    const res = await client.post(`/boards/workspace/${id}/`, { name: boardName })
    setBoards([...boards, res.data])
    setBoardName('')
  }

  const inviteMember = async (e) => {
    e.preventDefault()
    try {
      await client.post(`/workspaces/${id}/invite/`, { email: inviteEmail, role: 'member' })
      setInviteEmail('')
      const res = await client.get(`/workspaces/${id}/`)
      setWorkspace(res.data)
    } catch {
      alert('User not found or already a member.')
    }
  }

  const startEditingBoard = (board) => {
    setEditingBoard(board.id)
    setEditingBoardName(board.name)
  }

  const saveEditingBoard = async (boardId) => {
    await client.patch(`/boards/${boardId}/`, { name: editingBoardName })
    setBoards(boards.map(b => b.id === boardId ? { ...b, name: editingBoardName } : b))
    setEditingBoard(null)
  }

  const deleteBoard = async (boardId) => {
    if (!window.confirm('Delete this board?')) return
    await client.delete(`/boards/${boardId}/`)
    setBoards(boards.filter(b => b.id !== boardId))
  }

  if (!workspace) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{workspace.name}</h1>
      <p className="text-gray-500 mb-6">Your role: <strong>{workspace.my_role}</strong></p>

      {/* Boards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Boards</h2>
        <form onSubmit={createBoard} className="flex gap-2 mb-4">
          <input
            placeholder="New board name"
            className="border p-2 rounded flex-1"
            value={boardName}
            onChange={e => setBoardName(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Board</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {boards.map(board => (
            <div key={board.id} className="bg-white p-4 rounded shadow">
              {editingBoard === board.id ? (
                <div className="flex gap-2">
                  <input
                    className="border p-1 rounded flex-1 text-sm"
                    value={editingBoardName}
                    onChange={e => setEditingBoardName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEditingBoard(board.id)}
                    autoFocus
                  />
                  <button
                    onClick={() => saveEditingBoard(board.id)}
                    className="text-green-600 text-sm font-medium"
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
                    className="font-semibold cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/boards/${board.id}`)}
                  >
                    {board.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditingBoard(board)}
                      className="text-xs text-gray-400 hover:text-blue-500"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteBoard(board.id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Members — only admins can invite */}
      {workspace.my_role === 'admin' && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <form onSubmit={inviteMember} className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Invite by email"
              className="border p-2 rounded flex-1"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">Invite</button>
          </form>
          <ul className="space-y-2">
            {workspace.members.map(m => (
              <li key={m.id} className="flex justify-between bg-white p-3 rounded shadow">
                <span>{m.user.email}</span>
                <span className="text-sm text-gray-500">{m.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}