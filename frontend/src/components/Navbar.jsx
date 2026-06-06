import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="
      sticky top-0 z-50
      backdrop-blur-xl
      bg-white/70
      border-b border-slate-200
    ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center gap-2"
        >
          <div className="
            w-10 h-10
            rounded-2xl
            bg-gradient-to-br from-indigo-500 to-violet-600
            flex items-center justify-center
            shadow-md
            group-hover:scale-105
            transition
          ">
            <span className="text-white font-bold text-sm">
              CB
            </span>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              CollabBoard
            </h1>

            <p className="text-xs text-slate-500 -mt-1">
              Team Workspace
            </p>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-600 hover:text-black hover:bg-slate-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-600 hover:text-black hover:bg-slate-100"
              }`
            }
          >
            Projects
          </NavLink>

          
        </div>

        {/* Right Section */}
        {user && (
          <div className="flex items-center gap-4">

            {/* Profile */}
            <Link
              to="/profile"
              className="
                flex items-center gap-3
                px-3 py-2
                rounded-2xl
                hover:bg-slate-100
                transition
              "
            >
              <div
                className="
                  w-10 h-10
                  rounded-full
                  flex items-center justify-center
                  shadow-sm
                "
                style={{
                  backgroundColor: user.avatar_color || '#6366f1',
                }}
              >
                <span className="text-white font-semibold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {user.username}
                </p>

                <p className="text-xs text-slate-500">
                  Active now
                </p>
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="
                px-4 py-2
                rounded-xl
                bg-black
                text-white
                text-sm
                font-medium
                hover:scale-105
                active:scale-95
                transition
              "
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}