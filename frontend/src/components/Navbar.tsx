import { Link, useNavigate } from 'react-router-dom'
import { logout, isAuthenticated } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate()
  const signedIn = isAuthenticated()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/dashboard" className="text-lg font-semibold text-white">
          AI Personal Knowledge Assistant
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-slate-300">
          {signedIn ? (
            <>
              <Link to="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-cyan-500">
                Dashboard
              </Link>
              <Link to="/documents" className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-cyan-500">
                Documents
              </Link>
              <Link to="/chat" className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-cyan-500">
                Chat
              </Link>
              <button onClick={handleLogout} className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-700 px-4 py-2 text-sm hover:border-cyan-500">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
