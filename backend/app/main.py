from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import areas, agents, projects, agent_runs, documents, tasks

# 테이블 자동 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Miracle-Cowork AgentPack API",
    description="기업형 AI Agent 플랫폼 MVP API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(areas.router, prefix="/api", tags=["Areas"])
app.include_router(agents.router, prefix="/api", tags=["Agents"])
app.include_router(projects.router, prefix="/api", tags=["Projects"])
app.include_router(agent_runs.router, prefix="/api", tags=["Agent Runs"])
app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(tasks.router, prefix="/api", tags=["Tasks"])

@app.get("/", tags=["Health"])
def root():
    return {"message": "Miracle-Cowork AgentPack API", "version": "1.0.0", "docs": "/docs"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
