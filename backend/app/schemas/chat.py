from pydantic import BaseModel


class ConversationCreate(BaseModel):
    title: str


class ConversationRead(BaseModel):
    id: int
    title: str
    created_at: str

    class Config:
        orm_mode = True


class ChatMessageCreate(BaseModel):
    conversation_id: int
    content: str


class ChatMessageRead(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    timestamp: str

    class Config:
        orm_mode = True
