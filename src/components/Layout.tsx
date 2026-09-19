import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import LogFab from './LogFab'

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream-50 pb-[calc(5.5rem+var(--safe-bottom))]">
      <header className="sticky top-0 z-10 border-b border-plum-100 bg-cream-50/90 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <span className="font-display text-3xl text-plum-900">Luna</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-8">
        <Outlet />
      </main>

      <BottomNav />
      <LogFab />
    </div>
  )
}
