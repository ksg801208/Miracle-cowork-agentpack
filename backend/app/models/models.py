import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    role = Column(String(50), default="member")          # admin | manager | member
    password_hash = Column(String(255), nullable=True)   # nullable for backward compat
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    projects = relationship("Project", back_populates="owner")
    agent_runs = relationship("AgentRun", back_populates="requester")

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    project_type = Column(String(100))
    status = Column(String(50), default="active")
    owner_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    owner = relationship("User", back_populates="projects")
    agent_runs = relationship("AgentRun", back_populates="project")
    documents = relationship("Document", back_populates="project")
    tasks = relationship("Task", back_populates="project")

class AgentRun(Base):
    __tablename__ = "agent_runs"
    run_id = Column(String, primary_key=True, default=gen_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    agent_id = Column(String(100), nullable=False)
    area_id = Column(String(100), nullable=False)
    input_payload = Column(JSON)
    output_text = Column(Text)
    output_json = Column(JSON)
    status = Column(String(50), default="pending")
    requested_by = Column(String, ForeignKey("users.id"), nullable=True)
    requested_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    project = relationship("Project", back_populates="agent_runs")
    requester = relationship("User", back_populates="agent_runs")
    documents = relationship("Document", back_populates="agent_run")

class Document(Base):
    __tablename__ = "documents"
    document_id = Column(String, primary_key=True, default=gen_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    agent_id = Column(String(100), nullable=True)
    area_id = Column(String(100), nullable=True)
    title = Column(String(300), nullable=False)
    document_type = Column(String(100))          # output_type alias
    content_markdown = Column(Text)
    agent_run_id = Column(String, ForeignKey("agent_runs.run_id"), nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    project = relationship("Project", back_populates="documents")
    agent_run = relationship("AgentRun", back_populates="documents")

class Task(Base):
    __tablename__ = "tasks"
    task_id = Column(String, primary_key=True, default=gen_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    assignee = Column(String(100))
    due_date = Column(String(50))
    priority = Column(String(20), default="medium")
    status = Column(String(50), default="todo")
    source_agent_run_id = Column(String, ForeignKey("agent_runs.run_id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    project = relationship("Project", back_populates="tasks")
