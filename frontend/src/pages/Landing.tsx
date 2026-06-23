import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 text-white px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-12 shadow-2xl shadow-slate-950/20">
          <h1 className="text-5xl font-semibold tracking-tight">AI Personal Knowledge Assistant</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Build a private document-powered AI assistant for your PDFs, notes, research papers, and knowledge base.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/login" className="rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Login
            </Link>
            <Link to="/register" className="rounded-full border border-slate-600 px-6 py-3 text-slate-100 transition hover:border-slate-400">
              Register
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Upload Documents', description: 'Add PDFs, TXT, and DOCX files to your private knowledge base.' },
            { title: 'Ask Questions', description: 'Use AI to answer questions based only on your uploaded documents.' },
            { title: 'Track Conversations', description: 'Create chat sessions, store history, and continue previous threads.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
