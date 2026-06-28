import { FormEvent, useEffect, useState, useRef } from 'react'
import { fetchDocuments, uploadDocument, deleteDocument } from '../services/api'

interface DocumentSummary {
  id: number
  file_name: string
  file_type: string
  upload_date: string
  processing_status: string
}

const statusClasses: Record<string, string> = {
  completed: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  processing: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
  failed: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
  default: 'border-slate-700 bg-slate-800 text-slate-300',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const loadDocuments = async () => {
    try {
      const response = await fetchDocuments()
      setDocuments(response.data)
    } catch (error) {
      setDocuments([])
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file) {
      setError('Please choose a document file.')
      return
    }
    try {
      await uploadDocument(file)
      setError('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      loadDocuments()
    } catch (err) {
      setError('Upload failed. Use PDF, TXT, or DOCX.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Documents</h1>
              <p className="mt-2 text-slate-400">Upload knowledge files and track processing status for your AI assistant.</p>
            </div>
            <div className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">Supported: PDF, TXT, DOCX</div>
          </div>

          <form className="mt-8 grid gap-4 sm:grid-cols-[1.4fr_auto]" onSubmit={handleUpload}>
            <label className="flex h-full min-h-[72px] items-center rounded-3xl border border-dashed border-slate-700 bg-slate-950 px-4 text-slate-300 transition hover:border-cyan-500">
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="h-full w-full cursor-pointer bg-transparent text-sm text-slate-100 file:mr-4 file:rounded-full file:border file:border-slate-700 file:bg-slate-800 file:px-4 file:py-2 file:text-slate-100"
              />
            </label>
            <button className="h-fit rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Upload document
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        </section>

        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.9)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Your uploaded documents</h2>
            <p className="text-sm text-slate-400">Refresh the page after upload to see the latest status.</p>
          </div>
          <div className="mt-6 space-y-4">
            {documents.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">
                No documents yet. Upload one to start building your private knowledge base.
              </div>
            ) : (
              documents.map((document) => {
                const statusKey = document.processing_status.toLowerCase() as keyof typeof statusClasses
                return (
                  <div key={document.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-white">{document.file_name}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                          <span>{document.file_type}</span>
                          <span>{new Date(document.upload_date).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full border px-3 py-1 text-sm ${statusClasses[statusKey] || statusClasses.default}`}>
                          {document.processing_status}
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteDocument(document.id)
                            loadDocuments()
                          }}
                          className="rounded-full border border-rose-500 px-4 py-2 text-sm text-rose-400 transition hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
