import { Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function LogFab() {
  const { pathname } = useLocation()

  if (pathname === '/log') return null

  return (
    <Link
      to="/log"
      aria-label="Quick log"
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-cream-50 shadow-xl shadow-blue-600/25 transition-transform hover:scale-105 active:scale-95"
      style={{ bottom: 'calc(4.7rem + var(--safe-bottom))' }}
    >
      <Plus className="h-7 w-7" strokeWidth={2.5} />
    </Link>
  )
}
