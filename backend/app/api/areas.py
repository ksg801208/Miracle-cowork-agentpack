import json
from fastapi import APIRouter, HTTPException
from app.core.config import settings

router = APIRouter()

def load_areas():
    with open(settings.config_dir / "areas.json", "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/areas")
def get_areas():
    return load_areas()

@router.get("/areas/{area_id}")
def get_area(area_id: str):
    areas = load_areas()
    area = next((a for a in areas if a["area_id"] == area_id), None)
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area
