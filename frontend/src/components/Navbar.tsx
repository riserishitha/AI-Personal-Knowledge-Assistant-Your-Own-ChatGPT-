import { NavLink, useNavigate } from 'react-router-dom'
import { logout, isAuthenticated } from '../hooks/useAuth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 text-slate-200 hover:border-cyan-500'}`

export default function Navbar() {
  const navigate = useNavigate()
  const signedIn = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <NavLink to="/dashboard" className="text-lg font-semibold text-white">
            AI Knowledge
          </NavLink>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">Private</span>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-slate-300">
          {signedIn ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/documents" className={navLinkClass}>
                Documents
              </NavLink>
              <NavLink to="/chat" className={navLinkClass}>
                Chat
              </NavLink>
              <button onClick={handleLogout} className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
