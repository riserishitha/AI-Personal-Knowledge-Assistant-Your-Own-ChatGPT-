import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDocuments } from '../services/api'

interface DocumentSummary {
  id: number
  file_name: string
  file_type: string
  upload_date: string
  processing_status: string
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([])

  useEffect(() => {
    fetchDocuments()
      .then((response) => setDocuments(response.data))
      .catch(() => setDocuments([]))
  }, [])

  const stats = useMemo(() => {
    const total = documents.length
    const completed = documents.filter((doc) => doc.processing_status.toLowerCase() === 'completed').length
    const processing = documents.filter((doc) => doc.processing_status.toLowerCase() === 'processing').length
    const failed = documents.filter((doc) => doc.processing_status.toLowerCase() === 'failed').length
    return { total, completed, processing, failed }
  }, [documents])

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold">Dashboard</h1>
              <p className="mt-2 text-slate-400">Manage uploads, track status, and continue your document-based AI conversations.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/documents" className="rounded-full border border-slate-700 px-5 py-3 text-slate-200 hover:border-cyan-400">
                Documents
              </Link>
              <Link to="/chat" className="rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                Open Chat
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Total documents', value: stats.total },
              { label: 'Processed', value: stats.completed },
              { label: 'In progress', value: stats.processing },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.75)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Recent documents</h2>
                <p className="mt-2 text-sm text-slate-400">Review your latest uploads and processing status.</p>
              </div>
              <Link to="/documents" className="rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400">
                View all
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {documents.length === 0 ? (
                <p className="text-slate-400">No documents uploaded yet. Head to Documents to add your first file.</p>
              ) : (
                documents.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{doc.file_name}</p>
                        <p className="mt-1 text-sm text-slate-400">{new Date(doc.upload_date).toLocaleString()}</p>
                      </div>
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
                        {doc.file_type}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-slate-300">Status: <span className="font-medium text-white">{doc.processing_status}</span></p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.75)]">
            <h2 className="text-2xl font-semibold">Quick actions</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li>• Upload documents to power AI retrieval.</li>
              <li>• Ask smart questions from your private files.</li>
              <li>• Keep chat history tied to your knowledge base.</li>
              <li>• Track processing status in one place.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
