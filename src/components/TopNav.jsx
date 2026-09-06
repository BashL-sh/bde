export function TopNav({ mode = 'admin' }) {
  const admin = mode === 'admin'

  return <header className="glass sticky top-4 z-30 mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/80 px-4 py-3 shadow-soft">
    <a href="/admin" className="group">
      <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-slate-400">Live scoring</p>
      <p className="text-lg font-extrabold tracking-tight text-slate-950">LiveRank</p>
    </a>
    <nav className="flex items-center gap-2">
      <a href="/participant" className="rounded-lg px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-950">Participant view</a>
      {admin && <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-sm">Admin</span>}
    </nav>
  </header>
}
