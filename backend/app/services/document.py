import os
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.document import Document
from app.utils.file_processing import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt, clean_text, chunk_text
from app.ai.embedding import EmbeddingService
from app.ai.vectorstore import VectorStoreManager


class DocumentService:
    @staticmethod
    def create_document(db: Session, user_id: int, file_name: str, file_path: str, file_type: str) -> Document:
        document = Document(
            user_id=user_id,
            file_name=file_name,
            file_path=file_path,
            file_type=file_type,
            processing_status="pending",
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        return document

    @staticmethod
    def list_documents(db: Session, user_id: int) -> list[Document]:
        return db.query(Document).filter(Document.user_id == user_id).order_by(Document.upload_date.desc()).all()

    @staticmethod
    def delete_document(db: Session, user_id: int, document_id: int) -> bool:
        document = db.query(Document).filter(Document.user_id == user_id, Document.id == document_id).first()
        if not document:
            return False
        db.delete(document)
        db.commit()
        return True

    @staticmethod
    def process_document(document_id: int):
        from app.database import SessionLocal

        with SessionLocal() as db:
            document = db.query(Document).filter(Document.id == document_id).first()
            if not document:
                return

            try:
                if document.file_type == 'application/pdf' or document.file_path.endswith('.pdf'):
                    text = extract_text_from_pdf(document.file_path)
                elif document.file_path.endswith('.docx'):
                    text = extract_text_from_docx(document.file_path)
                else:
                    text = extract_text_from_txt(document.file_path)

                cleaned_text = clean_text(text)
                chunks = chunk_text(cleaned_text)
                embeddings = EmbeddingService.generate_embeddings(chunks)
                VectorStoreManager.add_document_vectors(document.user_id, document.id, chunks, embeddings)
                document.processing_status = 'completed'
            except Exception:
                document.processing_status = 'failed'
            finally:
                db.commit()
