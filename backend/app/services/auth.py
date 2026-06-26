from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin
from app.utils.security import hash_password, verify_password, create_access_token, decode_access_token
from fastapi import Depends, Header, HTTPException, status
from typing import Optional


def get_bearer_token(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authentication token")
    return authorization.split(" ", 1)[1]


class AuthService:
    @staticmethod
    def register_user(db: Session, user_create: UserCreate) -> User | None:
        existing = db.query(User).filter(User.email == user_create.email).first()
        if existing:
            return None
        hashed_password = hash_password(user_create.password)
        user = User(name=user_create.name, email=user_create.email, hashed_password=hashed_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User | None:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_user_token(user: User) -> dict:
        token = create_access_token({"email": user.email})
        return {"access_token": token, "token_type": "bearer"}

    @staticmethod
    def decode_token(token: str) -> Optional[dict]:
        return decode_access_token(token)

    @staticmethod
    def get_current_user(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()
