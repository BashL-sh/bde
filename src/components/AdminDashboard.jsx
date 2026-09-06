import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const STATIONS = Array.from({length:12}, (_, i) => ({ id:i+1, points:i<6?1:i<10?2:3 }))

export function AdminDashboard({ onSuccess }) {
  const [participants, setParticipants] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.from('participants').select('id,name').order('name').then(({data,error}) => { if(error) setMessage(error.message); else setParticipants(data ?? []) })
  }, [])

  async function award(station) {
    if (!selectedId || !supabase) return
    setBusy(true); setMessage('')
    const { error } = await supabase.rpc('award_points', { p_participant_id:selectedId, p_station_number:station.id, p_points:station.points })
    if (error) setMessage(error.message)
    else { const name = participants.find(p => p.id === selectedId)?.name || 'Participant'; const msg = `+${station.points} awarded to ${name}`; setMessage(msg); onSuccess?.(msg) }
    setBusy(false)
  }

  async function resetEvent() {
    if (!supabase) return
    const confirmed = window.confirm('Reset the event? This will set every participant score to 0 and delete all score history. This cannot be undone.')
    if (!confirmed) return

    setBusy(true)
    setMessage('Resetting event…')
    const { error } = await supabase.rpc('reset_event')
    if (error) {
      setMessage(error.message)
    } else {
      setSelectedId('')
      setMessage('Event reset successfully. All scores are now 0.')
      onSuccess?.('Event reset successfully')
    }
    setBusy(false)
  }

  return <section className="mx-auto mt-8 max-w-4xl"><div className="mb-7"><p className="text-sm font-bold text-indigo-600">Scoring control</p><h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950">Admin Dashboard</h1><p className="mt-2 text-sm text-slate-500">Choose a participant, then award the points for the completed station.</p><p className="mt-2 break-all font-mono text-xs text-slate-400">Admin link: {window.location.origin}/admin</p></div>
    <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-5 py-4">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-indigo-500">Share with participants</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-extrabold text-slate-900">Participant dashboard</p>
          <p className="text-sm text-slate-500">Give participants this read-only link. They will only see the live dashboard.</p>
        </div>
        <a href="/participant" target="_blank" rel="noreferrer" className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-indigo-600 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50">Open participant link ↗</a>
      </div>
      <p className="mt-2 break-all font-mono text-xs text-slate-400">{window.location.origin}/participant</p>
    </div>
    <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-rose-500">New event</p>
          <p className="mt-1 font-extrabold text-slate-900">Reset all scores</p>
          <p className="text-sm text-slate-500">Keeps all participant names, but sets every score to 0 and clears the scoring history.</p>
        </div>
        <button type="button" disabled={busy} onClick={resetEvent} className="shrink-0 rounded-xl bg-rose-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50">Reset Event</button>
      </div>
    </div>
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-soft"><label className="mb-2 block text-sm font-bold text-slate-700">Participant</label><select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-indigo-200"><option value="">Select a participant…</option>{participants.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-4">{STATIONS.map(s=><button key={s.id} disabled={busy || !selectedId} onClick={()=>award(s)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"><span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Station {s.id}</span><span className="mt-1 block text-xl font-black text-slate-900">+{s.points}</span></button>)}</div>
      {message && <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">{message}</div>}
    </div>
  </section>
}
