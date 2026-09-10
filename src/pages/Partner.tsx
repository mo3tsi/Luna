import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { predictCycle, PHASE_LABELS, PHASE_COLORS } from '../utils/cyclePredictions'

interface LinkRow {
  id: string
  invite_code: string
  status: 'pending' | 'accepted' | 'revoked'
  partner_id: string | null
}

interface PartnerSummaryRow {
  owner_id: string
  owner_display_name: string
  average_cycle_length: number
  average_period_length: number
  last_period_start: string | null
}

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function Partner() {
  const { user } = useAuth()
  const [myLinks, setMyLinks] = useState<LinkRow[]>([])
  const [linkedToMe, setLinkedToMe] = useState<PartnerSummaryRow[]>([])
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemMsg, setRedeemMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!user) return
    const [{ data: links }, { data: summaries }] = await Promise.all([
      supabase.from('partner_links').select('id, invite_code, status, partner_id').eq('owner_id', user.id),
      supabase.from('partner_summary').select('*'),
    ])
    setMyLinks(links ?? [])
    setLinkedToMe((summaries as PartnerSummaryRow[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const createInvite = async () => {
    if (!user) return
    const code = randomCode()
    const { error } = await supabase.from('partner_links').insert({ owner_id: user.id, invite_code: code })
    if (!error) load()
  }

  const revoke = async (id: string) => {
    await supabase.from('partner_links').update({ status: 'revoked' }).eq('id', id)
    load()
  }

  const redeem = async () => {
    setRedeemMsg(null)
    const { error } = await supabase.rpc('redeem_invite', { code: redeemCode.trim().toUpperCase() })
    if (error) {
      setRedeemMsg(error.message)
    } else {
      setRedeemMsg('Connected!')
      setRedeemCode('')
      load()
    }
  }

  if (loading) return <p className="text-plum-700">Loading…</p>

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl text-plum-900 mb-2">Share with a partner</h2>
        <p className="text-plum-700 text-sm mb-4">
          Generate a one-time code and send it to your partner yourself (text, in person, however you like).
          They enter it below to connect. They'll only ever see your cycle phase and predicted dates — never
          your private notes or full symptom log. You can revoke access at any time.
        </p>
        <button
          onClick={createInvite}
          className="rounded-lg bg-blue-600 text-cream-50 px-4 py-2 font-medium hover:bg-blue-500"
        >
          Generate invite code
        </button>

        <div className="mt-4 space-y-2">
          {myLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-plum-100 px-4 py-2.5"
            >
              <div>
                <span className="font-mono text-lg tracking-widest text-plum-900">{link.invite_code}</span>
                <span
                  className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                    link.status === 'accepted'
                      ? 'bg-sage-100 text-sage-500'
                      : link.status === 'pending'
                        ? 'bg-gold-100 text-gold-500'
                        : 'bg-plum-100 text-plum-700'
                  }`}
                >
                  {link.status}
                </span>
              </div>
              {link.status !== 'revoked' && (
                <button onClick={() => revoke(link.id)} className="text-sm text-red-600 hover:underline">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-plum-900 mb-2">Connect to someone who shared a code</h2>
        <div className="flex gap-3">
          <input
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            placeholder="ABC123"
            className="rounded-lg border border-plum-200 bg-white px-3 py-2 font-mono tracking-widest uppercase"
          />
          <button onClick={redeem} className="rounded-lg bg-blue-600 text-cream-50 px-4 py-2 font-medium hover:bg-blue-500">
            Connect
          </button>
        </div>
        {redeemMsg && <p className="text-sm text-plum-700 mt-2">{redeemMsg}</p>}
      </section>

      {linkedToMe.length > 0 && (
        <section>
          <h2 className="font-display text-2xl text-plum-900 mb-3">People who shared with you</h2>
          <div className="space-y-4">
            {linkedToMe.map((s) => {
              if (!s.last_period_start) {
                return (
                  <div key={s.owner_id} className="rounded-xl border border-plum-100 p-4">
                    <p className="font-display text-lg text-plum-900">{s.owner_display_name}</p>
                    <p className="text-sm text-plum-700">No period logged yet.</p>
                  </div>
                )
              }
              const prediction = predictCycle(
                new Date(s.last_period_start),
                s.average_cycle_length,
                s.average_period_length
              )
              return (
                <div key={s.owner_id} className={`rounded-xl p-4 text-cream-50 ${PHASE_COLORS[prediction.phase]}`}>
                  <p className="font-display text-lg">{s.owner_display_name}</p>
                  <p className="text-sm opacity-90 mt-1">
                    Day {prediction.cycleDay} · {PHASE_LABELS[prediction.phase]}
                  </p>
                  <p className="text-sm opacity-90">
                    Next period around {format(prediction.nextPeriodStart, 'MMM d')}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
