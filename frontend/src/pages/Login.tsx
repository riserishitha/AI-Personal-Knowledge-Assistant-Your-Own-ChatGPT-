import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const result = await loginUser(email, password)
      localStorage.setItem('pk_token', result.data.access_token)
      navigate('/dashboard')
    } catch (error) {
      setError('Invalid login credentials')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold">Login</h1>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-cyan-400">Register</Link>
        </p>
      </div>
    </main>
  )
}
