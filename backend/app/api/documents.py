from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Document
from app.schemas.schemas import DocumentCreate, DocumentResponse

router = APIRouter()

@router.post("/documents", response_model=DocumentResponse)
def create_document(doc: DocumentCreate, db: Session = Depends(get_db)):
    db_doc = Document(**doc.model_dump())
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

@router.get("/projects/{project_id}/documents", response_model=List[DocumentResponse])
def get_project_documents(project_id: str, db: Session = Depends(get_db)):
    return db.query(Document).filter(Document.project_id == project_id).order_by(Document.created_at.desc()).all()

@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
