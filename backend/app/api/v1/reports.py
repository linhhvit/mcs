from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.report import Report
from .dependencies import get_current_active_user

router = APIRouter()


@router.get("/")
async def read_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get list of reports"""
    reports = db.query(Report).offset(skip).limit(limit).all()
    return reports

