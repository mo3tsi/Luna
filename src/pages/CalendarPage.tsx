import { useEffect, useState } from 'react'
import { addMonths, format, isSameMonth, subMonths } from 'date-fns'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import BottomSheet from '../components/BottomSheet'
import { getCalendarDays, type CalendarDay, type CalendarLog } from '../utils/cycleCalendar'

interface Profile {
  average_cycle_length: number
  average_period_length: number
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const markerClass = (day: CalendarDay) => {
  if (day.actualPeriod) return 'bg-rose-500 text-cream-50'
  if (day.predictedPeriod) return 'border border-dashed border-rose-500 text-rose-600'
  if (day.ovulation) return 'bg-gold-500 text-plum-900'
  if (day.fertile) return 'bg-sage-100 text-sage-500'
  return 'text-plum-800 hover:bg-blue-100'
}

function LogDetails({ log }: { log: CalendarLog }) {
  return (
    <div className="space-y-4 text-sm text-plum-700">
      {log.flow_intensity && (
        <div>
          <p className="font-medium text-plum-900">Flow</p>
          <p className="capitalize">{log.flow_intensity}</p>
        </div>
      )}
      {log.mood?.length ? (
        <div>
          <p className="font-medium text-plum-900">Mood</p>
          <p>{log.mood.join(', ')}</p>
        </div>
      ) : null}
      {log.symptoms?.length ? (
        <div>
          <p className="font-medium text-plum-900">Symptoms</p>
          <p>{log.symptoms.join(', ')}</p>
        </div>
      ) : null}
      {log.sexual_activity && (
        <div>
          <p className="font-medium text-plum-900">Sexual activity</p>
          <p className="capitalize">{log.sexual_activity}</p>
        </div>
      )}
      {log.note && (
        <div>
          <p className="font-medium text-plum-900">Private note</p>
          <p>{log.note}</p>
        </div>
      )}
    </div>
  )
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [month, setMonth] = useState(new Date())
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cycles, setCycles] = useState<{ start_date: string; end_date: string | null }[]>([])
  const [logs, setLogs] = useState<CalendarLog[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const load = async () => {
      setLoading(true)
      const [{ data: profileData }, { data: cycleData }, { data: logData }] = await Promise.all([
        supabase.from('profiles').select('average_cycle_length, average_period_length').eq('id', user.id).single(),
        supabase.from('cycles').select('start_date, end_date').eq('user_id', user.id).order('start_date'),
        supabase
          .from('daily_logs')
          .select('log_date, flow_intensity, mood, symptoms, note, sexual_activity')
          .eq('user_id', user.id),
      ])
      if (!cancelled) {
        setProfile(profileData)
        setCycles(cycleData ?? [])
        setLogs(logData ?? [])
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user])

  if (loading) return <p className="text-plum-700">Loading calendar...</p>
  if (!profile) return <p className="text-plum-700">Couldn't load your calendar.</p>

  const days = getCalendarDays(
    month,
    cycles,
    logs,
    profile.average_cycle_length,
    profile.average_period_length
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-plum-700">Your cycle</p>
          <h1 className="font-display text-3xl text-plum-900">Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth((current) => subMonths(current, 1))}
            className="grid h-9 w-9 place-items-center rounded-full border border-plum-200 text-plum-800 hover:border-blue-500 hover:text-blue-600"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth((current) => addMonths(current, 1))}
            className="grid h-9 w-9 place-items-center rounded-full border border-plum-200 text-plum-800 hover:border-blue-500 hover:text-blue-600"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 key={format(month, 'yyyy-MM')} className="font-display text-xl text-plum-900 animate-fade-in">
          {format(month, 'MMMM yyyy')}
        </h2>
        {!isSameMonth(month, new Date()) && (
          <button type="button" onClick={() => setMonth(new Date())} className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Today
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-plum-700">
        {WEEKDAYS.map((weekday) => <div key={weekday} className="py-2">{weekday}</div>)}
        {days.map((day) => (
          <button
            key={day.date.toISOString()}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`relative aspect-square rounded-lg p-1 text-sm transition-colors ${
              day.isCurrentMonth ? markerClass(day) : 'text-plum-300'
            } ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
          >
            {format(day.date, 'd')}
            {day.log && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-plum-700 sm:grid-cols-4">
        <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />Actual period</span>
        <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-dashed border-rose-500" />Predicted</span>
        <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-sage-500" />Fertile</span>
        <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-gold-500" />Ovulation</span>
      </div>

      <BottomSheet
        open={selectedDay !== null}
        title={selectedDay ? format(selectedDay.date, 'EEEE, MMMM d') : 'Date details'}
        onClose={() => setSelectedDay(null)}
      >
        {selectedDay && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 text-sm">
              {selectedDay.actualPeriod && <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-600">Actual period</span>}
              {selectedDay.predictedPeriod && <span className="rounded-full border border-dashed border-rose-500 px-3 py-1 text-rose-600">Predicted period</span>}
              {selectedDay.fertile && <span className="rounded-full bg-sage-100 px-3 py-1 text-sage-500">Fertile window</span>}
              {selectedDay.ovulation && <span className="rounded-full bg-gold-100 px-3 py-1 text-gold-500">Ovulation</span>}
            </div>
            {selectedDay.log ? <LogDetails log={selectedDay.log} /> : <p className="text-sm text-plum-700">No daily log for this date.</p>}
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
