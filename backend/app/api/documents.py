import os
from pathlib import Path
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.auth import AuthService
from app.services.document import DocumentService
from app.schemas.document import DocumentRead
from app.utils.file_processing import is_supported_file

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "storage" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_db():
    with SessionLocal() as session:
        yield session


def get_current_user(db: Session = Depends(get_db), token: str = Depends(AuthService.get_bearer_token)):
    token_data = AuthService.decode_token(token)
    if not token_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    user = AuthService.get_current_user(db, token_data.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/upload", response_model=DocumentRead)
def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if not is_supported_file(file.filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    user_dir = UPLOAD_DIR / str(current_user.id)
    user_dir.mkdir(parents=True, exist_ok=True)
    file_path = user_dir / file.filename

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    document = DocumentService.create_document(db, current_user.id, file.filename, str(file_path), file.content_type)
    background_tasks.add_task(DocumentService.process_document, document.id)
    return document

@router.get("/", response_model=list[DocumentRead])
def list_documents(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return DocumentService.list_documents(db, current_user.id)

@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    deleted = DocumentService.delete_document(db, current_user.id, document_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return {"detail": "Document deleted"}
