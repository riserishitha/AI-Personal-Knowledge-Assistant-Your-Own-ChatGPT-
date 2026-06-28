import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createConversation, listConversations, getConversationHistory, sendChatMessage } from '../services/api'

export default function ChatPage() {
  const [conversations, setConversations] = useState<{ id: number; title: string }[]>([])
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('')

  const loadConversations = async () => {
    try {
      const response = await listConversations()
      setConversations(response.data)
      if (!selectedConversation && response.data.length > 0) {
        setSelectedConversation(response.data[0].id)
      }
    } catch {
      setConversations([])
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (!selectedConversation) return
    getConversationHistory(selectedConversation)
      .then((response) => setMessages(response.data))
      .catch(() => setMessages([]))
  }, [selectedConversation])

  const selectedTitle = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversation)?.title ?? 'New conversation',
    [conversations, selectedConversation],
  )

  const handleCreateConversation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return
    const response = await createConversation(title.trim())
    setTitle('')
    await loadConversations()
    setSelectedConversation(response.data.id)
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedConversation) return
    const userContent = input.trim()
    setMessages((prev) => [...prev, { role: 'user', content: userContent }])
    setInput('')
    const response = await sendChatMessage(selectedConversation, userContent)
    setMessages((prev) => [...prev, { role: 'assistant', content: response.data.content }])
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.75)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Conversations</h2>
                <p className="text-sm text-slate-400">Switch between your saved chat sessions.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">AI</span>
            </div>

            <form onSubmit={handleCreateConversation} className="mt-6 space-y-3">
              <label className="block text-sm text-slate-300">New conversation</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Conversation title"
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
              <button type="submit" className="w-full rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                Create
              </button>
            </form>

            <div className="mt-6 space-y-3 overflow-y-auto pb-4" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              {conversations.length === 0 ? (
                <p className="text-sm text-slate-400">No conversations yet. Create one to begin.</p>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full rounded-3xl px-4 py-4 text-left text-sm transition ${conversation.id === selectedConversation ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'border border-slate-700 bg-slate-950 text-slate-300 hover:border-cyan-500 hover:bg-slate-900'}`}
                  >
                    {conversation.title}
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.75)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedTitle}</h2>
                <p className="text-sm text-slate-400">Ask questions about your uploaded documents and see private answers instantly.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Private knowledge only</span>
            </div>

            <div className="mt-6 flex min-h-[520px] flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/10">
              {messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center text-slate-400">
                  Start the conversation by asking a question about your uploaded documents.
                </div>
              ) : (
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`rounded-3xl p-5 shadow-sm ${message.role === 'user' ? 'self-end max-w-[85%] bg-cyan-500/10 text-cyan-100 border border-cyan-500/20' : 'self-start max-w-[85%] bg-slate-800 text-slate-200 border border-slate-700'}`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{message.role}</p>
                      <p className="mt-3 whitespace-pre-line leading-7">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your documents..."
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-500"
              />
              <button onClick={handleSend} className="rounded-3xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 hover:bg-cyan-400">
                Send
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}
