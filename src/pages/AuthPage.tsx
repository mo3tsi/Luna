import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthPage() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'signUp') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName || 'Luna user' } },
        })
        if (error) throw error
        setInfo('Account created. Check your email to confirm, then sign in.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl text-plum-900 mb-1">Luna</h1>
        <p className="text-plum-700 mb-8">Private cycle tracking, just for you.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signUp' && (
            <div>
              <label className="block text-sm font-medium text-plum-800 mb-1">Name</label>
              <input
                className="w-full rounded-lg border border-plum-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="What should we call you?"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-plum-800 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-plum-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-plum-800 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-plum-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          {info && <p className="text-sm text-sage-500">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-plum-900 text-cream-50 py-2.5 font-medium hover:bg-plum-800 transition-colors disabled:opacity-50"
          >
            {mode === 'signUp' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button
          className="mt-6 text-sm text-plum-700 underline underline-offset-2"
          onClick={() => {
            setMode(mode === 'signUp' ? 'signIn' : 'signUp')
            setError(null)
            setInfo(null)
          }}
        >
          {mode === 'signUp' ? 'Already have an account? Sign in' : "New here? Create an account"}
        </button>
      </div>
    </div>
  )
}
