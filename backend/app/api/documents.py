import urllib.parse
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.models import Document, User
from app.schemas.schemas import DocumentCreate, DocumentResponse

router = APIRouter()


@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def create_document(
    doc: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_doc = Document(
        **doc.model_dump(),
        created_by=current_user.id,
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc


@router.get("/projects/{project_id}/documents", response_model=List[DocumentResponse])
def get_project_documents(
    project_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return (
        db.query(Document)
        .filter(Document.project_id == project_id)
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.get("/documents/{document_id}/download")
def download_document(
    document_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Markdown 파일로 다운로드"""
    doc = db.query(Document).filter(Document.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    safe_title = urllib.parse.quote(doc.title or "document")
    filename = f"{safe_title}.md"
    return PlainTextResponse(
        content=doc.content_markdown or "",
        media_type="text/markdown; charset=utf-8",
        headers={"Content-Disposition": f"attachment; filename*=UTF-8''{filename}"},
    )


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.created_by != current_user.id and current_user.role not in ("admin", "manager"):
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다")
    db.delete(doc)
    db.commit()
