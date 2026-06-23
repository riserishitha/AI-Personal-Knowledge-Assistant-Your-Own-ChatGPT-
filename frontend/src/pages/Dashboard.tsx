import { useEffect, useState } from 'react'
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Dashboard</h1>
              <p className="mt-2 text-slate-400">Manage uploads, preview document status, and continue your AI conversations.</p>
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
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6">
            <h2 className="text-xl font-semibold">Recent Documents</h2>
            <div className="mt-4 space-y-3">
              {documents.length === 0 ? (
                <p className="text-slate-400">No documents uploaded yet. Upload a file in the Documents section.</p>
              ) : (
                documents.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">{doc.file_name}</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{doc.file_type}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Status: {doc.processing_status}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li>• Upload and process knowledge documents.</li>
              <li>• Generate summaries from your own file library.</li>
              <li>• Compare documents using AI insights.</li>
              <li>• Keep conversation context across sessions.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
