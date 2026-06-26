import os
from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.chat import ChatMessageCreate
from app.ai.rag import RAGService


class ChatService:
    @staticmethod
    def create_conversation(db: Session, user_id: int, title: str) -> Conversation:
        conversation = Conversation(user_id=user_id, title=title)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation

    @staticmethod
    def get_conversation(db: Session, user_id: int, conversation_id: int) -> Conversation | None:
        return db.query(Conversation).filter(Conversation.user_id == user_id, Conversation.id == conversation_id).first()

    @staticmethod
    def list_conversations(db: Session, user_id: int) -> list[Conversation]:
        return db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.created_at.desc()).all()

    @staticmethod
    def get_messages(db: Session, conversation_id: int) -> list[Message]:
        return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp.asc()).all()

    @staticmethod
    def _build_memory(db: Session, conversation_id: int, limit: int = 6) -> list[str]:
        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.timestamp.desc())
            .limit(limit)
            .all()
        )
        return [f"{message.role}: {message.content}" for message in reversed(messages)]

    @staticmethod
    def send_message(db: Session, conversation: Conversation, message_payload: ChatMessageCreate) -> Message:
        user_message = Message(conversation_id=conversation.id, role='user', content=message_payload.content)
        db.add(user_message)
        db.commit()
        db.refresh(user_message)

        memory = ChatService._build_memory(db, conversation.id)
        assistant_response = RAGService.answer_question(conversation.user_id, message_payload.content, memory)
        assistant_message = Message(conversation_id=conversation.id, role='assistant', content=assistant_response)
        db.add(assistant_message)
        db.commit()
        db.refresh(assistant_message)

        return assistant_message

    @staticmethod
    def stream_message(db: Session, conversation: Conversation, message_payload: ChatMessageCreate):
        import openai

        user_message = Message(conversation_id=conversation.id, role='user', content=message_payload.content)
        db.add(user_message)
        db.commit()
        db.refresh(user_message)

        memory = ChatService._build_memory(db, conversation.id)
        prompt_text = "\n".join([f"{item}" for item in memory])
        retrieved = RAGService.retrieve_context(conversation.user_id, message_payload.content)
        final_prompt = (
            "You are a private knowledge assistant. Answer using only documented context and conversation memory. "
            "Cite sources from the retrieved documents.\n\n"
            f"{('Conversation history:\n' + prompt_text + '\n\n') if prompt_text else ''}"
            f"Retrieved context:\n{retrieved}\n\nUser question:\n{message_payload.content}"
        )

        openai.api_key = os.getenv('OPENAI_API_KEY')
        response = openai.ChatCompletion.create(
            model=os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": final_prompt},
            ],
            temperature=0.2,
            stream=True,
        )

        buffer = ""
        for chunk in response:
            delta = chunk.choices[0].delta
            if delta and 'content' in delta:
                text_piece = delta.content
                buffer += text_piece
                yield text_piece

        assistant_message = Message(conversation_id=conversation.id, role='assistant', content=buffer)
        db.add(assistant_message)
        db.commit()
        db.refresh(assistant_message)
