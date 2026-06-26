import os
from typing import List
from app.models.document import Document
from app.ai.rag import RAGService
from app.ai.embedding import EmbeddingService
from app.utils.file_processing import (
    extract_text_from_pdf,
    extract_text_from_docx,
    extract_text_from_txt,
    clean_text,
)
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage


def _document_text(document: Document) -> str:
    if document.file_path.endswith('.pdf'):
        raw = extract_text_from_pdf(document.file_path)
    elif document.file_path.endswith('.docx'):
        raw = extract_text_from_docx(document.file_path)
    else:
        raw = extract_text_from_txt(document.file_path)

    cleaned = clean_text(raw)
    return cleaned[:12000]


class AIService:
    @staticmethod
    def summarize_document(document: Document) -> dict:
        text = _document_text(document)
        client = ChatOpenAI(openai_api_key=os.getenv('OPENAI_API_KEY'), temperature=0.2)
        prompt = (
            "Summarize the following document content into a short summary, a list of important points, and the most relevant concepts. "
            "Respond using the document only and provide source references when possible.\n\n"
            f"{text}"
        )
        response = client([SystemMessage(content="You are a helpful summarization assistant."), HumanMessage(content=prompt)])
        return {"summary": response.content, "document_id": document.id}

    @staticmethod
    def compare_documents(documents: List[Document]) -> dict:
        contents = [(_document_text(doc) or '')[:6000] for doc in documents]
        client = ChatOpenAI(openai_api_key=os.getenv('OPENAI_API_KEY'), temperature=0.2)
        prompt = (
            "Compare the following two documents and provide similarities, differences, and key observations. "
            "Use the document text only and cite the documents as Document 1 or Document 2.\n\n"
            f"Document 1:\n{contents[0]}\n\nDocument 2:\n{contents[1]}"
        )
        response = client([SystemMessage(content="You are a helpful comparative analysis assistant."), HumanMessage(content=prompt)])
        return {"comparison": response.content, "document_ids": [doc.id for doc in documents]}

    @staticmethod
    def answer_question(user_id: int, question: str, memory: List[str] | None = None) -> str:
        return RAGService.answer_question(user_id, question, memory)
