import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import {
  getAverage,
  getCycleLengths,
  getFrequency,
  getPeriodLengths,
  getRegularityNote,
  type InsightCycle,
  type InsightLog,
} from '../utils/insightsStats'

const statValue = (value: number | null) => (value === null ? '--' : value)

function StatCard({ label, value, suffix }: { label: string; value: number | null; suffix: string }) {
  return (
    <div className="rounded-xl border border-plum-100 bg-white p-4">
      <p className="text-sm text-plum-700">{label}</p>
      <p className="mt-1 font-display text-2xl text-plum-900">
        {statValue(value)} <span className="font-sans text-sm text-plum-600">{value === null ? '' : suffix}</span>
      </p>
    </div>
  )
}

function FrequencyBars({ items, emptyMessage }: { items: { label: string; count: number }[]; emptyMessage: string }) {
  const maximum = items[0]?.count ?? 0

  if (!items.length) return <p className="text-sm text-plum-600">{emptyMessage}</p>

  return (
    <div className="space-y-3">
      {items.slice(0, 6).map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm text-plum-800">
            <span>{item.label}</span>
            <span className="text-plum-600">{item.count}</span>
          </div>
          <div className="h-2 rounded-full bg-plum-100">
            <div
              className="h-2 rounded-full bg-sage-500"
              style={{ width: `${(item.count / maximum) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Insights() {
  const { user } = useAuth()
  const [cycles, setCycles] = useState<InsightCycle[]>([])
  const [logs, setLogs] = useState<InsightLog[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setLoadError(false)
      const [{ data: cycleData, error: cycleError }, { data: logData, error: logError }] = await Promise.all([
        supabase.from('cycles').select('start_date, end_date').eq('user_id', user.id).order('start_date'),
        supabase.from('daily_logs').select('mood, symptoms').eq('user_id', user.id),
      ])

      if (!cancelled) {
        setCycles(cycleData ?? [])
        setLogs(logData ?? [])
        setLoadError(Boolean(cycleError || logError))
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user])

  if (loading) return <p className="text-plum-700">Loading insights...</p>
  if (loadError) return <p className="text-plum-700">Couldn&apos;t load your insights.</p>

  const cycleLengths = getCycleLengths(cycles)
  const periodLengths = getPeriodLengths(cycles)
  const symptoms = getFrequency(logs.map((log) => log.symptoms))
  const moods = getFrequency(logs.map((log) => log.mood))
  const averageCycle = getAverage(cycleLengths)
  const averagePeriod = getAverage(periodLengths)
  const shortestCycle = cycleLengths.length ? Math.min(...cycleLengths) : null
  const longestCycle = cycleLengths.length ? Math.max(...cycleLengths) : null
  const chartMinimum = cycleLengths.length ? Math.min(...cycleLengths) : 0
  const chartMaximum = cycleLengths.length ? Math.max(...cycleLengths) : 1

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-plum-700">Your patterns</p>
        <h1 className="font-display text-3xl text-plum-900">Insights</h1>
        <p className="mt-2 text-sm text-plum-700">A picture of your cycle and daily logs over time.</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-plum-900">Averages</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Average cycle" value={averageCycle} suffix="days" />
          <StatCard label="Average period" value={averagePeriod} suffix="days" />
          <StatCard label="Shortest cycle" value={shortestCycle} suffix="days" />
          <StatCard label="Longest cycle" value={longestCycle} suffix="days" />
        </div>
        <p className="rounded-lg bg-blue-100 px-4 py-3 text-sm text-plum-800">{getRegularityNote(cycleLengths)}</p>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-display text-xl text-plum-900">Cycle length</h2>
          <p className="text-sm text-plum-700">Each bar shows the days between logged period starts.</p>
        </div>
        {cycleLengths.length ? (
          <div className="flex h-40 items-end gap-2 border-b border-plum-200 px-1 pt-4">
            {cycleLengths.map((length, index) => {
              const height = chartMaximum === chartMinimum ? 100 : ((length - chartMinimum) / (chartMaximum - chartMinimum)) * 70 + 30
              return (
                <div key={`${length}-${index}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs text-plum-700">{length}</span>
                  <div className="w-full max-w-8 rounded-t bg-rose-400" style={{ height: `${height}%` }} title={`${length} days`} />
                  <span className="text-xs text-plum-600">{index + 1}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-plum-200 px-4 py-6 text-sm text-plum-600">
            Log at least two period starts to see your cycle lengths.
          </p>
        )}
      </section>

      <div className="grid gap-8 sm:grid-cols-2">
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-xl text-plum-900">Most-logged symptoms</h2>
            <p className="text-sm text-plum-700">From your daily logs</p>
          </div>
          <FrequencyBars items={symptoms} emptyMessage="Log symptoms to see patterns here." />
        </section>
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-xl text-plum-900">Most-logged moods</h2>
            <p className="text-sm text-plum-700">From your daily logs</p>
          </div>
          <FrequencyBars items={moods} emptyMessage="Log moods to see patterns here." />
        </section>
      </div>
    </div>
  )
}
