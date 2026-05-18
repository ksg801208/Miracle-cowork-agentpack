"""
초기 관리자 계정 생성 스크립트

실행 방법:
  cd backend
  py seed_admin.py

기존 DB에서 password_hash 컬럼이 없는 경우:
  miracle_agentpack.db 파일을 삭제 후 재실행하면 새 스키마로 생성됩니다.
"""
import sys, os, sqlite3

sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import engine, Base
from app.models.models import User
from app.core.security import hash_password
from sqlalchemy.orm import Session
import uuid

# 기존 SQLite DB에 password_hash, is_active 컬럼이 없을 경우 추가
db_path = "miracle_agentpack.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = [row[1] for row in cursor.fetchall()]
    if "password_hash" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
        print("컬럼 추가: password_hash")
    if "is_active" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1")
        print("컬럼 추가: is_active")
    conn.commit()
    conn.close()

# 테이블 생성 (없으면 신규 생성)
Base.metadata.create_all(bind=engine)

ADMIN_EMAIL = "admin@miracle.ai"
ADMIN_PASSWORD = "miracle2024!"
ADMIN_NAME = "관리자"

with Session(engine) as db:
    existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if existing:
        if not existing.password_hash:
            existing.password_hash = hash_password(ADMIN_PASSWORD)
            existing.is_active = True
            db.commit()
            print(f"기존 계정에 비밀번호 설정 완료: {ADMIN_EMAIL}")
        else:
            print(f"관리자 계정이 이미 존재합니다: {ADMIN_EMAIL}")
    else:
        admin = User(
            id=str(uuid.uuid4()),
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            role="admin",
            password_hash=hash_password(ADMIN_PASSWORD),
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print("관리자 계정 생성 완료")

print("\n=== 초기 관리자 계정 정보 ===")
print(f"  이메일  : {ADMIN_EMAIL}")
print(f"  비밀번호: {ADMIN_PASSWORD}")
print(f"  역할    : admin")
print("\n로그인 후 반드시 비밀번호를 변경하세요.")
