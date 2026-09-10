import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import LogEntry from './pages/LogEntry'
import Partner from './pages/Partner'
import Settings from './pages/Settings'
import CalendarPage from './pages/CalendarPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-plum-700">Loading…</div>
  if (!session) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function Routed() {
  const { session } = useAuth()
  return (
    <Routes>
      <Route path="/auth" element={session ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogEntry />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routed />
      </AuthProvider>
    </BrowserRouter>
  )
}
