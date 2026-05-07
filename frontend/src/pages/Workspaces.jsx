import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([])
  const [name, setName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    client.get('/workspaces/').then(res => setWorkspaces(res.data))
  }, [])

  const create = async (e) => {
    e.preventDefault()
    const res = await client.post('/workspaces/', { name })
    setWorkspaces([...workspaces, res.data])
    setName('')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Workspaces</h1>
      <form onSubmit={create} className="flex gap-2 mb-8">
        <input
          placeholder="New workspace name"
          className="border p-2 rounded flex-1"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map(ws => (
          <div
            key={ws.id}
            onClick={() => navigate(`/workspaces/${ws.id}`)}
            className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{ws.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Role: <span className="font-medium">{ws.my_role}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {ws.members.length} member(s)
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}