import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">CollabBoard</Link>
      {user && (
        <div className="flex items-center gap-4">
          <span>{user.username}</span>
          <button
            onClick={logout}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}