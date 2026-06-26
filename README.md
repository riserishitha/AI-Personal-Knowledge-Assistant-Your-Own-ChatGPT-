# AI Personal Knowledge Assistant

A full-stack private knowledge assistant for uploading documents, building a user-scoped vector database, and asking AI questions over your own files.

## Features
- JWT-based authentication with user registration and login
- PDF/TXT/DOCX document upload and asynchronous processing
- LangChain + OpenAI embeddings + FAISS vector store
- RAG chat with conversation memory and private retrieval
- Document summary and comparison API endpoints
- Docker Compose setup for local development

## Repo structure
- `backend/`: FastAPI backend with database models, services, and AI logic
- `frontend/`: React + TypeScript UI using Tailwind and React Router
- `docker-compose.yml`: local multi-container setup for PostgreSQL, backend, and frontend

## Local setup
1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` and other secrets.
3. Build and run:
   - `docker compose up --build`
4. Frontend: `http://localhost:4173`
5. Backend: `http://localhost:8000`

## Backend
- API base path: `/api`
- Auth endpoints: `/api/auth/register`, `/api/auth/login`
- Documents endpoints: `/api/documents` and `/api/documents/upload`
- Chat endpoints: `/api/chat/conversation`, `/api/chat/conversations`, `/api/chat/history/{id}`, `/api/chat/message`
- AI endpoints: `/api/ai/summarize`, `/api/ai/compare`

## Frontend notes
- Uses `VITE_API_BASE_URL` to target the backend API
- Stores JWT in `localStorage` under `pk_token`
- Protected routes redirect unauthenticated users to `/login`

## Notes
- Ensure the backend has access to `OPENAI_API_KEY`.
- Uploaded documents are stored under `backend/app/storage/uploads`.
- FAISS vector store is saved at `backend/app/storage/faiss_store`.

## Future improvements
- Add streaming UI for `/chat/message/stream`
- Enhance document summary and comparison controls
- Add tests for backend services and frontend API flows
