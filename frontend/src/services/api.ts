import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pk_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function registerUser(name: string, email: string, password: string) {
  return api.post('/auth/register', { name, email, password })
}

export async function loginUser(email: string, password: string) {
  return api.post('/auth/login', { email, password })
}

export async function fetchDocuments() {
  return api.get('/documents')
}

export async function uploadDocument(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function deleteDocument(documentId: number) {
  return api.delete(`/documents/${documentId}`)
}

export async function createConversation(title: string) {
  return api.post('/chat/conversation', { title })
}

export async function listConversations() {
  return api.get('/chat/conversations')
}

export async function getConversationHistory(conversationId: number) {
  return api.get(`/chat/history/${conversationId}`)
}

export async function sendChatMessage(conversationId: number, content: string) {
  return api.post('/chat/message', { conversation_id: conversationId, content })
}

export async function summarizeDocument(documentId: number) {
  return api.post('/ai/summarize', { document_id: documentId })
}

export async function compareDocuments(documentIds: number[]) {
  return api.post('/ai/compare', { document_ids: documentIds })
}

export default api
