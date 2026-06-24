from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.document import Document
from app.services.auth import AuthService
from app.services.ai import AIService
from app.schemas.ai import SummarizeRequest, CompareRequest, SummarizeResponse, CompareResponse

router = APIRouter()


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

@router.post("/summarize", response_model=SummarizeResponse)
def summarize(request: SummarizeRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    document = db.query(Document).filter(Document.id == request.document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return AIService.summarize_document(document)

@router.post("/compare", response_model=CompareResponse)
def compare(request: CompareRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    documents = db.query(Document).filter(Document.id.in_(request.document_ids), Document.user_id == current_user.id).all()
    if len(documents) < 2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least two documents are required for comparison")
    return AIService.compare_documents(documents)
