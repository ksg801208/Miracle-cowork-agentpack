import json
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.models import AgentRun
from app.schemas.schemas import AgentRunCreate, AgentRunResponse
from app.agent_engine.runner_factory import create_runner

router = APIRouter()
_runner = create_runner()

def load_agents():
    with open(settings.config_dir / "agents.json", "r", encoding="utf-8") as f:
        return json.load(f)

@router.post("/agents/{agent_id}/run", response_model=AgentRunResponse)
def run_agent(agent_id: str, body: AgentRunCreate, db: Session = Depends(get_db)):
    agents = load_agents()
    agent_config = next((a for a in agents if a["agent_id"] == agent_id), None)
    if not agent_config:
        raise HTTPException(status_code=404, detail="Agent not found")

    db_run = AgentRun(
        project_id=body.project_id,
        agent_id=agent_id,
        area_id=agent_config["area_id"],
        input_payload=body.input_payload,
        status="running",
        requested_by=body.requested_by,
    )
    db.add(db_run)
    db.commit()

    try:
        result = _runner.run(agent_config, body.input_payload or {})
        db_run.output_text = result["output_text"]
        db_run.output_json = result.get("output_json")
        db_run.status = "completed"
        db_run.completed_at = datetime.now(timezone.utc)
    except Exception as e:
        db_run.status = "failed"
        db_run.output_text = f"실행 오류: {e}"

    db.commit()
    db.refresh(db_run)
    return db_run

@router.get("/agent-runs/{run_id}", response_model=AgentRunResponse)
def get_run(run_id: str, db: Session = Depends(get_db)):
    run = db.query(AgentRun).filter(AgentRun.run_id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.get("/projects/{project_id}/agent-runs", response_model=List[AgentRunResponse])
def get_project_runs(project_id: str, db: Session = Depends(get_db)):
    return db.query(AgentRun).filter(AgentRun.project_id == project_id).order_by(AgentRun.requested_at.desc()).all()
