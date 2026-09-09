import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { predictCycle, PHASE_LABELS, PHASE_COLORS, type CyclePrediction } from '../utils/cyclePredictions'

interface Profile {
  average_cycle_length: number
  average_period_length: number
  display_name: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const [{ data: profileData }, { data: cycleData }] = await Promise.all([
        supabase
          .from('profiles')
          .select('average_cycle_length, average_period_length, display_name')
          .eq('id', user.id)
          .single(),
        supabase
          .from('cycles')
          .select('start_date')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])
      setProfile(profileData)
      setLastPeriodStart(cycleData ? new Date(cycleData.start_date) : null)
      setLoading(false)
    })()
  }, [user])

  if (loading) return <p className="text-plum-700">Loading…</p>

  if (!profile) return <p className="text-plum-700">Couldn't load your profile.</p>

  if (!lastPeriodStart) {
    return (
      <div className="text-center py-16">
        <p className="font-display text-2xl text-plum-900 mb-2">Welcome, {profile.display_name}</p>
        <p className="text-plum-700 mb-6">Log your most recent period to start seeing predictions.</p>
        <a
          href="/log"
          className="inline-block rounded-full bg-plum-900 text-cream-50 px-6 py-2.5 font-medium hover:bg-plum-800"
        >
          Log a period
        </a>
      </div>
    )
  }

  const prediction: CyclePrediction = predictCycle(
    lastPeriodStart,
    profile.average_cycle_length,
    profile.average_period_length
  )

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 text-cream-50 ${PHASE_COLORS[prediction.phase]}`}>
        <p className="text-sm uppercase tracking-wide opacity-80">Day {prediction.cycleDay} of cycle</p>
        <p className="font-display text-3xl mt-1">{PHASE_LABELS[prediction.phase]}</p>
        <p className="mt-3 text-sm opacity-90">
          {prediction.daysUntilNextPeriod >= 0
            ? `Next period expected in ${prediction.daysUntilNextPeriod} day${prediction.daysUntilNextPeriod === 1 ? '' : 's'} (${format(prediction.nextPeriodStart, 'MMM d')})`
            : `Period may be ${Math.abs(prediction.daysUntilNextPeriod)} day(s) late — that's normal sometimes, but log it once it starts.`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-plum-100 p-4">
          <p className="text-xs uppercase tracking-wide text-plum-700">Fertile window</p>
          <p className="font-display text-lg text-plum-900 mt-1">
            {format(prediction.fertileWindowStart, 'MMM d')} – {format(prediction.fertileWindowEnd, 'MMM d')}
          </p>
        </div>
        <div className="rounded-xl border border-plum-100 p-4">
          <p className="text-xs uppercase tracking-wide text-plum-700">Ovulation</p>
          <p className="font-display text-lg text-plum-900 mt-1">{format(prediction.ovulationDate, 'MMM d')}</p>
        </div>
      </div>

      <a
        href="/log"
        className="block text-center rounded-full border border-plum-900 text-plum-900 py-2.5 font-medium hover:bg-plum-900 hover:text-cream-50 transition-colors"
      >
        Log today
      </a>
    </div>
  )
}
