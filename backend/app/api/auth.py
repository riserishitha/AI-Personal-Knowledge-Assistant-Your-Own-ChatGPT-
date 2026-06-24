from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth import UserCreate, UserLogin, TokenResponse
from app.services.auth import AuthService
from app.database import SessionLocal

router = APIRouter()

def get_db():
    with SessionLocal() as session:
        yield session

@router.post("/register", response_model=TokenResponse)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    user = AuthService.register_user(db, user_create)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    return AuthService.create_user_token(user)

@router.post("/login", response_model=TokenResponse)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return AuthService.create_user_token(user)
