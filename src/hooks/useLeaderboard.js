import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function useLeaderboard() {
  const [participants, setParticipants] = useState([])
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: queryError } = await supabase
      .from('participants')
      .select('id,name,total_score')
      .order('total_score', { ascending: false })
      .order('name', { ascending: true })

    if (queryError) {
      console.error(queryError)
      setError(queryError.message)
      setStatus('error')
      return
    }

    setParticipants((data ?? []).map((p, i) => ({ ...p, score: Number(p.total_score ?? 0), rank: i + 1 })))
    setError('')
    setStatus('live')
  }, [])

  useEffect(() => {
    if (!supabase) return
    let active = true
    load()
    const channel = supabase
      .channel('participants-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
        if (active) load()
      })
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === 'CHANNEL_ERROR' || subscriptionStatus === 'TIMED_OUT') {
          setStatus('error')
          setError('Realtime connection failed. The page will still refresh when reopened.')
        }
      })
    return () => { active = false; supabase.removeChannel(channel) }
  }, [load])

  return { participants, status, error, reload: load }
}
