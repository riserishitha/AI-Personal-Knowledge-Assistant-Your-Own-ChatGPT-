import os
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from app.ai.embedding import EmbeddingService
from app.ai.vectorstore import VectorStoreManager


class RAGService:
    @staticmethod
    def retrieve_context(user_id: int, question: str, top_k: int = 5) -> str:
        query_embedding = EmbeddingService.generate_embeddings([question])[0]
        results = VectorStoreManager.search(query_embedding, user_id=user_id, top_k=top_k)
        if not results:
            return ""
        return "\n\n".join([
            f"[Source doc {item.document_id} chunk {item.chunk_index}] {item.text}"
            for item in results
        ])

    @staticmethod
    def answer_question(user_id: int, question: str, memory: list[str] | None = None) -> str:
        retrieved_context = RAGService.retrieve_context(user_id, question)
        if not retrieved_context:
            return "I couldn't find relevant content in your uploaded documents."

        memory_text = "\n".join(memory) if memory else ""
        prompt = (
            "You are a private knowledge assistant. Answer using only the provided document context and the user's conversation memory. "
            "Cite document sources in your final answer.\n\n"
            f"{('Conversation history:\n' + memory_text + '\n\n') if memory_text else ''}"
            f"Context:\n{retrieved_context}\n\nQuestion: {question}\nAnswer:"
        )

        client = ChatOpenAI(openai_api_key=os.getenv('OPENAI_API_KEY'), temperature=0.2)
        response = client([SystemMessage(content="You are a helpful assistant."), HumanMessage(content=prompt)])
        return response.content
