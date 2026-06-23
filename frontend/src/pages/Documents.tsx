import { FormEvent, useEffect, useState, useRef } from 'react'
import { fetchDocuments, uploadDocument, deleteDocument } from '../services/api'

interface DocumentSummary {
  id: number
  file_name: string
  file_type: string
  upload_date: string
  processing_status: string
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
        <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40">
          <h1 className="text-3xl font-semibold">Documents</h1>
          <p className="mt-2 text-slate-400">Upload knowledge files and monitor processing status for AI retrieval.</p>
          <form className="mt-8 flex flex-wrap gap-4" onSubmit={handleUpload}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
            <button className="rounded-3xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
              Upload
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/40">
          <h2 className="text-2xl font-semibold">Your Uploaded Documents</h2>
          <div className="mt-6 space-y-4">
            {documents.length === 0 ? (
              <p className="text-slate-400">No documents yet. Upload one to start building your private knowledge base.</p>
            ) : (
              documents.map((document) => (
                <div key={document.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{document.file_name}</p>
                      <p className="text-sm text-slate-400">Type: {document.file_type}</p>
                    </div>
                    <div className="text-sm text-slate-400">{new Date(document.upload_date).toLocaleString()}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <p className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">Status: {document.processing_status}</p>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteDocument(document.id)
                        loadDocuments()
                      }}
                      className="rounded-full border border-rose-500 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
