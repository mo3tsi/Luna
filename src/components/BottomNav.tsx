import { BookOpenText, CalendarDays, ChartColumnBig, House, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Today', Icon: House, end: true },
  { to: '/calendar', label: 'Calendar', Icon: CalendarDays },
  { to: '/insights', label: 'Insights', Icon: ChartColumnBig },
  { to: '/learn', label: 'Learn', Icon: BookOpenText },
  { to: '/profile', label: 'Profile', Icon: UserRound },
]

export default function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-plum-100 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/85"
      style={{ paddingBottom: 'calc(0.5rem + var(--safe-bottom))' }}
    >
      <div className="mx-auto flex max-w-2xl items-stretch justify-around gap-1 px-2 pt-2">
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-plum-600 hover:text-blue-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} strokeWidth={2.1} />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
