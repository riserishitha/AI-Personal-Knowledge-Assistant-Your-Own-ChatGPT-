from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.auth import AuthService
from app.services.chat import ChatService
from app.schemas.chat import ConversationCreate, ConversationRead, ChatMessageCreate, ChatMessageRead

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

@router.post("/conversation", response_model=ConversationRead)
def create_conversation(conversation: ConversationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return ChatService.create_conversation(db, current_user.id, conversation.title)

@router.get("/conversations", response_model=list[ConversationRead])
def list_conversations(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return ChatService.list_conversations(db, current_user.id)

@router.get("/history/{conversation_id}", response_model=list[ChatMessageRead])
def get_history(conversation_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    conversation = ChatService.get_conversation(db, current_user.id, conversation_id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return ChatService.get_messages(db, conversation.id)

@router.post("/message", response_model=ChatMessageRead)
def send_message(message_payload: ChatMessageCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    conversation = ChatService.get_conversation(db, current_user.id, message_payload.conversation_id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return ChatService.send_message(db, conversation, message_payload)

@router.post("/message/stream")
def send_message_stream(message_payload: ChatMessageCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    conversation = ChatService.get_conversation(db, current_user.id, message_payload.conversation_id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return StreamingResponse(ChatService.stream_message(db, conversation, message_payload), media_type="text/plain")
