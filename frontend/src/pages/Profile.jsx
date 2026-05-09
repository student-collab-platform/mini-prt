import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import toast from 'react-hot-toast'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#14b8a6',
]

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    username: user.username || '',
    bio: user.bio || '',
    job_title: user.job_title || '',
    avatar_color: user.avatar_color || '#6366f1',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  

// replace handleSave:
  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await client.patch('/users/me/', form)
      toast.success('Profile updated successfully')
      setTimeout(() => window.location.reload(), 1000)
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: form.avatar_color }}
          >
            {form.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{form.username}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
            {form.job_title && (
              <p className="text-indigo-600 text-sm mt-1">{form.job_title}</p>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              placeholder="e.g. Software Engineer"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.job_title}
              onChange={e => setForm({...form, job_title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              placeholder="Tell your team a bit about yourself..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({...form, avatar_color: color})}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    form.avatar_color === color
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
        <h2 className="font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-900">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Username</span>
            <span className="text-gray-900">{user.username}</span>
          </div>
        </div>
      </div>
    </div>
  )
}