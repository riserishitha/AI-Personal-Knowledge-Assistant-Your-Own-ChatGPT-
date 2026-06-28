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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-10 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.9)]">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl bg-slate-950/80 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Secure sign in</p>
              <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">Fast & private</span>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-sm text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                required
              />
            </label>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Sign In
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 text-center text-slate-300 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.85)]">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">New here?</p>
          <p className="mt-3 text-lg">Create your account to upload documents and start asking AI questions.</p>
          <Link to="/register" className="mt-6 inline-flex rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  )
}
