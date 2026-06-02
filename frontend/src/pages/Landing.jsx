import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg">CollabBoard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          Free for students and educators
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Manage your academic
          <span className="text-indigo-600"> projects together</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          CollabBoard helps students and supervisors organize tasks, track progress,
          and collaborate effectively — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-base font-medium transition-colors shadow-lg shadow-indigo-200"
          >
            Start for free →
          </Link>
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 px-8 py-3.5 rounded-xl text-base font-medium border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Fake board preview */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-xl">
          {/* Fake toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">Final Year Project</h3>
              <p className="text-xs text-gray-400 mt-0.5">3 members · 2 boards</p>
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-7 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-20 h-7 bg-indigo-100 rounded-lg"></div>
            </div>
          </div>

          {/* Fake kanban columns */}
          <div className="flex gap-4 overflow-x-auto">
            {/* Column 1 */}
            <div className="bg-white rounded-xl p-4 w-60 flex-shrink-0 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700 text-sm">To Do</span>
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Research phase', priority: 'high', label: 'research', labelColor: '#6366f1' },
                  { title: 'Write introduction', priority: 'medium', label: 'writing', labelColor: '#8b5cf6' },
                  { title: 'Setup environment', priority: 'low', label: 'setup', labelColor: '#06b6d4' },
                ].map((task, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-800 mb-1.5">{task.title}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {task.priority}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: task.labelColor }}
                      >
                        {task.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div className="bg-white rounded-xl p-4 w-60 flex-shrink-0 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700 text-sm">In Progress</span>
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Backend API development', priority: 'high', assignee: 'Y', color: '#6366f1' },
                  { title: 'UI design mockups', priority: 'medium', assignee: 'I', color: '#8b5cf6' },
                ].map((task, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-800 mb-1.5">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {task.priority}
                      </span>
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: task.color }}
                      >
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>1/2 done</span>
                  <span>50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="bg-white rounded-xl p-4 w-60 flex-shrink-0 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700 text-sm">Done</span>
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Project proposal', assignee: 'Y', color: '#6366f1' },
                  { title: 'Literature review', assignee: 'I', color: '#8b5cf6' },
                  { title: 'Team formation', assignee: 'A', color: '#ec4899' },
                ].map((task, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 p-3 rounded-lg opacity-70">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-xs font-medium text-gray-500 line-through">{task.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>3/3 done</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Built specifically for academic teams who need to stay organized and on track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                title: 'Kanban Boards',
                description: 'Visualize your workflow with drag-and-drop task management. Move tasks across columns as your work progresses.',
              },
              {
                icon: '👥',
                title: 'Team Workspaces',
                description: 'Create shared workspaces, invite your teammates and supervisor, and assign roles to control access.',
              },
              {
                icon: '🎯',
                title: 'Task Priorities',
                description: 'Set priorities and due dates for every task. Never miss a deadline with overdue alerts and progress tracking.',
              },
              {
                icon: '🏷️',
                title: 'Custom Labels',
                description: 'Create color-coded labels to categorize tasks by type, area, or any system that works for your team.',
              },
              {
                icon: '💬',
                title: 'Task Comments',
                description: 'Discuss tasks directly in context. Leave comments, ask questions, and keep all communication in one place.',
              },
              {
                icon: '📊',
                title: 'Progress Dashboard',
                description: 'Get a bird\'s eye view of all your tasks across workspaces. Track completion rates and upcoming deadlines.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 text-lg">Get started in minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Create account', desc: 'Sign up for free in seconds. No credit card required.' },
            { step: '2', title: 'Create workspace', desc: 'Set up a workspace for your project and invite your team.' },
            { step: '3', title: 'Build your board', desc: 'Create a Kanban board with columns that match your workflow.' },
            { step: '4', title: 'Start collaborating', desc: 'Add tasks, assign them, set deadlines and track progress.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">{item.step}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to organize your project?
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join students and supervisors already using CollabBoard to manage their academic projects.
          </p>
          <Link
            to="/register"
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3.5 rounded-xl text-base font-semibold transition-colors inline-block"
          >
            Get started for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">CB</span>
            </div>
            <span className="font-semibold text-gray-700">CollabBoard</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 CollabBoard — Built for academic collaboration
          </p>
        </div>
      </footer>

    </div>
  )
}