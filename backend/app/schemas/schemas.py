from pydantic import BaseModel, EmailStr
from typing import Optional, Any, Dict, List
from datetime import datetime


# ── 인증 스키마 ────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class CreateAdminRequest(BaseModel):
    name: str
    email: str
    password: str

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: Optional[str] = None
    owner_id: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    project_type: Optional[str] = None
    status: str
    owner_id: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class AgentRunCreate(BaseModel):
    project_id: Optional[str] = None
    agent_id: str
    area_id: str
    input_payload: Optional[Dict[str, Any]] = None
    requested_by: Optional[str] = None

class AgentRunResponse(BaseModel):
    run_id: str
    project_id: Optional[str] = None
    agent_id: str
    area_id: str
    input_payload: Optional[Dict[str, Any]] = None
    output_text: Optional[str] = None
    output_json: Optional[Any] = None
    status: str
    requested_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class DocumentCreate(BaseModel):
    project_id: Optional[str] = None
    title: str
    document_type: Optional[str] = None
    content_markdown: str
    agent_run_id: Optional[str] = None
    created_by: Optional[str] = None

class DocumentResponse(BaseModel):
    document_id: str
    project_id: Optional[str] = None
    title: str
    document_type: Optional[str] = None
    content_markdown: Optional[str] = None
    agent_run_id: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    project_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    priority: str = "medium"
    source_agent_run_id: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(BaseModel):
    task_id: str
    project_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    priority: str
    status: str
    source_agent_run_id: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True
