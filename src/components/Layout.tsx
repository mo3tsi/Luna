import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Today', end: true },
  { to: '/log', label: 'Log' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/partner', label: 'Partner' },
  { to: '/settings', label: 'Settings' },
]

export default function Layout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-plum-100 bg-cream-50/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-display text-2xl text-plum-900">Luna</span>
          <button onClick={() => signOut()} className="text-sm text-blue-600 hover:text-blue-500">
            Sign out
          </button>
        </div>
        <nav className="max-w-2xl mx-auto px-4 flex gap-1 pb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-cream-50' : 'text-plum-700 hover:bg-blue-100 hover:text-blue-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
