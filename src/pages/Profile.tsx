import { HeartHandshake, LogOut, Settings2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const quickLinks = [
  {
    to: '/partner',
    title: 'Partner',
    description: 'Share cycle info privately',
    Icon: HeartHandshake,
  },
  {
    to: '/settings',
    title: 'Settings',
    description: 'Cycle preferences & data controls',
    Icon: Settings2,
  },
]

export default function Profile() {
  const { signOut } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.14em] text-plum-700">Account</p>
        <h1 className="font-display text-3xl text-plum-900">Profile</h1>
      </div>

      <div className="space-y-3">
        {quickLinks.map(({ to, title, description, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-between rounded-2xl border border-plum-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Icon className="h-5 w-5" strokeWidth={2.1} />
              </div>
              <div>
                <div className="font-medium text-plum-900">{title}</div>
                <div className="text-sm text-plum-700">{description}</div>
              </div>
            </div>
            <span aria-hidden="true" className="text-xl text-plum-500">›</span>
          </Link>
        ))}

        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50 p-4 text-left text-red-700 transition-colors hover:bg-red-100"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <LogOut className="h-5 w-5" strokeWidth={2.1} />
            </div>
            <div>
              <div className="font-medium">Sign out</div>
              <div className="text-sm text-red-600/80">End your Luna session</div>
            </div>
          </div>
          <span aria-hidden="true" className="text-xl">›</span>
        </button>
      </div>
    </div>
  )
}
