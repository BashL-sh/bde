import { useEffect, useState } from 'react'
import { AdminDashboard } from './components/AdminDashboard'
import { LeaderboardView } from './components/LeaderboardView'
import { SetupNotice } from './components/SetupNotice'
import { TopNav } from './components/TopNav'
import { useLeaderboard } from './hooks/useLeaderboard'
import { isSupabaseConfigured } from './lib/supabase'

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const admin = path === '/admin' || path.startsWith('/admin/')
  const participant = path === '/participant' || path.startsWith('/participant/')

  // Keep the participant URL explicit. The root URL is a convenience redirect.
  useEffect(() => {
    if (!admin && !participant && path === '/') {
      window.history.replaceState({}, '', '/participant')
    }
  }, [admin, participant, path])

  const { participants, status, error } = useLeaderboard()
  const [toast, setToast] = useState('')

  // /participant is intentionally dashboard-only. /admin keeps the existing
  // admin controls. Any unknown path is treated like the participant dashboard.
  const showAdmin = admin
  const showParticipant = participant || (!admin && path === '/')

  if (!showAdmin && !showParticipant) {
    window.history.replaceState({}, '', '/participant')
  }

  return (
    <main className={`min-h-screen ${showParticipant ? 'px-4 py-4 sm:px-6 sm:py-6' : 'px-4 py-4 sm:px-6 sm:py-6'}`}>
      {showAdmin && <TopNav mode="admin" />}

      {!isSupabaseConfigured ? (
        <SetupNotice title={showAdmin ? 'Connect Supabase before scoring' : 'Connect Supabase before showing live scores'} />
      ) : showAdmin ? (
        <AdminDashboard onSuccess={setToast} />
      ) : (
        <LeaderboardView participants={participants} status={status} error={error} />
      )}

      {showAdmin && (
        <footer className="mx-auto mt-12 max-w-6xl pb-8 text-center text-xs font-semibold text-slate-400">
          Participant dashboard: <a href="/participant" className="text-indigo-600 hover:underline">/participant</a>
          <span className="mx-2">·</span>
          Admin dashboard: <span className="text-slate-500">/admin</span>
        </footer>
      )}

      {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-soft">{toast}</div>}
    </main>
  )
}
