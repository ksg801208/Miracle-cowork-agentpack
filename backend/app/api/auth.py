from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.models.models import User
from app.schemas.schemas import LoginRequest, TokenResponse, UserResponse, CreateAdminRequest
import uuid

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 또는 비밀번호가 올바르지 않습니다")
    if not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 또는 비밀번호가 올바르지 않습니다")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="비활성화된 계정입니다")

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout():
    # JWT는 서버 무효화 불가 — 클라이언트에서 토큰 삭제로 처리
    return {"message": "로그아웃 되었습니다"}


@router.post("/create-admin", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_admin(body: CreateAdminRequest, db: Session = Depends(get_db)):
    """관리자 계정 최초 생성 API. 이미 admin 계정이 존재하면 거부."""
    existing_admin = db.query(User).filter(User.role == "admin").first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="관리자 계정이 이미 존재합니다. seed_admin.py 스크립트를 사용하세요."
        )
    existing_email = db.query(User).filter(User.email == body.email).first()
    if existing_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 사용 중인 이메일입니다")

    admin = User(
        id=str(uuid.uuid4()),
        name=body.name,
        email=body.email,
        role="admin",
        password_hash=hash_password(body.password),
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin
