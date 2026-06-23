import { FormEvent, useEffect, useState } from 'react'
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

  const handleCreateConversation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return
    const response = await createConversation(title.trim())
    setTitle('')
    loadConversations()
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
        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6">
            <h2 className="text-xl font-semibold">Conversations</h2>
            <form onSubmit={handleCreateConversation} className="mt-4 flex gap-2">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="New conversation title"
                className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
              <button type="submit" className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                Create
              </button>
            </form>
            <div className="mt-6 space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm ${conversation.id === selectedConversation ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 bg-slate-950 text-slate-300 hover:border-cyan-500'}`}
                >
                  {conversation.title}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI Assistant</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Private knowledge only</span>
            </div>
            <div className="mt-6 h-[460px] space-y-4 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              {messages.length === 0 ? (
                <p className="text-slate-400">Start the conversation by asking a question about your uploaded documents.</p>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`rounded-3xl p-4 ${message.role === 'user' ? 'bg-cyan-500/10 text-cyan-100' : 'bg-slate-800 text-slate-200'}`}>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{message.role}</p>
                    <p className="mt-2 whitespace-pre-line">{message.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your documents..."
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              />
              <button onClick={handleSend} className="rounded-3xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                Send
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}
