import json
from fastapi import APIRouter, HTTPException
from app.core.config import settings

router = APIRouter()

def load_agents():
    with open(settings.config_dir / "agents.json", "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/agents")
def get_all_agents():
    return load_agents()

@router.get("/areas/{area_id}/agents")
def get_area_agents(area_id: str):
    return [a for a in load_agents() if a["area_id"] == area_id]

@router.get("/agents/{agent_id}")
def get_agent(agent_id: str):
    agent = next((a for a in load_agents() if a["agent_id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent
