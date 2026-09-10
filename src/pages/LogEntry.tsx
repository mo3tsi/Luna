import { useState, type FormEvent } from 'react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

const MOODS = ['Happy', 'Calm', 'Tired', 'Irritable', 'Anxious', 'Sad', 'Energetic']
const SYMPTOMS = ['Cramps', 'Headache', 'Bloating', 'Acne', 'Tender breasts', 'Backache', 'Nausea', 'Cravings']
const FLOW_OPTIONS = ['spotting', 'light', 'medium', 'heavy'] as const

export default function LogEntry() {
  const { user } = useAuth()
  const today = format(new Date(), 'yyyy-MM-dd')

  const [periodStartDate, setPeriodStartDate] = useState(today)
  const [savingPeriod, setSavingPeriod] = useState(false)
  const [periodMsg, setPeriodMsg] = useState<string | null>(null)

  const [flow, setFlow] = useState<(typeof FLOW_OPTIONS)[number] | ''>('')
  const [mood, setMood] = useState<string[]>([])
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [savingLog, setSavingLog] = useState(false)
  const [logMsg, setLogMsg] = useState<string | null>(null)

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const savePeriodStart = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSavingPeriod(true)
    setPeriodMsg(null)
    const { error } = await supabase.from('cycles').insert({ user_id: user.id, start_date: periodStartDate })
    setPeriodMsg(error ? error.message : 'Period logged.')
    setSavingPeriod(false)
  }

  const saveDailyLog = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSavingLog(true)
    setLogMsg(null)
    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: user.id,
        log_date: today,
        flow_intensity: flow || null,
        mood,
        symptoms,
        note: note || null,
      },
      { onConflict: 'user_id,log_date' }
    )
    setLogMsg(error ? error.message : 'Saved for today.')
    setSavingLog(false)
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl text-plum-900 mb-3">Start a new period</h2>
        <form onSubmit={savePeriodStart} className="flex gap-3 items-end">
          <div>
            <label className="block text-sm text-plum-700 mb-1">Start date</label>
            <input
              type="date"
              value={periodStartDate}
              onChange={(e) => setPeriodStartDate(e.target.value)}
              className="rounded-lg border border-plum-200 bg-white px-3 py-2"
            />
          </div>
          <button
            disabled={savingPeriod}
            className="rounded-lg bg-blue-600 text-cream-50 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
          >
            Save
          </button>
        </form>
        {periodMsg && <p className="text-sm text-plum-700 mt-2">{periodMsg}</p>}
      </section>

      <section>
        <h2 className="font-display text-2xl text-plum-900 mb-3">Today — {format(new Date(), 'EEEE, MMM d')}</h2>
        <form onSubmit={saveDailyLog} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-plum-800 mb-2">Flow</p>
            <div className="flex gap-2 flex-wrap">
              {FLOW_OPTIONS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFlow(f === flow ? '' : f)}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize border transition-colors ${
                    flow === f ? 'bg-rose-500 text-cream-50 border-rose-500' : 'border-plum-200 text-plum-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-plum-800 mb-2">Mood</p>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggle(mood, setMood, m)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    mood.includes(m) ? 'bg-sage-500 text-cream-50 border-sage-500' : 'border-plum-200 text-plum-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-plum-800 mb-2">Symptoms</p>
            <div className="flex gap-2 flex-wrap">
              {SYMPTOMS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggle(symptoms, setSymptoms, s)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    symptoms.includes(s) ? 'bg-gold-500 text-plum-900 border-gold-500' : 'border-plum-200 text-plum-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-plum-800 mb-2">Private note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Only you can ever see this — not even a linked partner."
              className="w-full rounded-lg border border-plum-200 bg-white px-3 py-2"
            />
          </div>

          <button
            disabled={savingLog}
            className="rounded-lg bg-blue-600 text-cream-50 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
          >
            Save today's log
          </button>
          {logMsg && <p className="text-sm text-plum-700 mt-2">{logMsg}</p>}
        </form>
      </section>
    </div>
  )
}
