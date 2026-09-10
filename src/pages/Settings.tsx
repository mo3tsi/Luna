import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function Settings() {
  const { user } = useAuth()
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('average_cycle_length, average_period_length')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setCycleLength(data.average_cycle_length)
          setPeriodLength(data.average_period_length)
        }
      })
  }, [user])

  const save = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ average_cycle_length: cycleLength, average_period_length: periodLength })
      .eq('id', user.id)
    setMsg(error ? error.message : 'Saved.')
    setSaving(false)
  }

  const exportData = async () => {
    if (!user) return
    const [{ data: cycles }, { data: logs }] = await Promise.all([
      supabase.from('cycles').select('*').eq('user_id', user.id),
      supabase.from('daily_logs').select('*').eq('user_id', user.id),
    ])
    const blob = new Blob([JSON.stringify({ cycles, logs }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'luna-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteAllData = async () => {
    if (!user) return
    if (!confirm('This permanently deletes all your cycle and log data. This cannot be undone. Continue?')) return
    await supabase.from('cycles').delete().eq('user_id', user.id)
    await supabase.from('daily_logs').delete().eq('user_id', user.id)
    setMsg('All cycle and log data deleted.')
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl text-plum-900 mb-4">Cycle averages</h2>
        <div className="flex gap-6">
          <div>
            <label className="block text-sm text-plum-700 mb-1">Average cycle length (days)</label>
            <input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-24 rounded-lg border border-plum-200 bg-white px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-plum-700 mb-1">Average period length (days)</label>
            <input
              type="number"
              value={periodLength}
              onChange={(e) => setPeriodLength(Number(e.target.value))}
              className="w-24 rounded-lg border border-plum-200 bg-white px-3 py-2"
            />
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="mt-4 rounded-lg bg-blue-600 text-cream-50 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          Save
        </button>
        {msg && <p className="text-sm text-plum-700 mt-2">{msg}</p>}
      </section>

      <section>
        <h2 className="font-display text-2xl text-plum-900 mb-2">Your data</h2>
        <p className="text-sm text-plum-700 mb-4">
          Your data belongs to you. Export everything as a plain JSON file, or permanently delete it.
        </p>
        <div className="flex gap-3">
          <button
            onClick={exportData}
            className="rounded-lg border border-blue-600 text-blue-600 px-4 py-2 font-medium hover:bg-blue-600 hover:text-cream-50"
          >
            Export my data
          </button>
          <button
            onClick={deleteAllData}
            className="rounded-lg border border-red-600 text-red-600 px-4 py-2 font-medium hover:bg-red-600 hover:text-cream-50"
          >
            Delete all my data
          </button>
        </div>
      </section>
    </div>
  )
}
