import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900/90 p-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-300">
                Build a private knowledge assistant</span>
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white">
                Ask AI questions from your own documents, securely and privately.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Upload files, store private knowledge, and use AI to answer questions from your PDFs, notes, research, and personal data.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Get started
                </Link>
                <Link to="/login" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-cyan-400">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-xl shadow-slate-950/20">
              <h2 className="text-xl font-semibold">Core benefits</h2>
              <div className="mt-6 space-y-4">
                {[
                  { title: 'Private Document Search', description: 'Only your uploaded files are used for answers.' },
                  { title: 'Organized Conversations', description: 'Keep AI sessions tied to your context.' },
                  { title: 'Instant Knowledge Access', description: 'Ask about research, notes, or files in seconds.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Document Uploads', description: 'Add PDF, TXT, or DOCX files and let AI learn from your knowledge.' },
            { title: 'Expert Answers', description: 'AI responses are based on your own content, not a generic model.' },
            { title: 'Conversation Memory', description: 'Save and revisit past chats for faster follow-up questions.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
