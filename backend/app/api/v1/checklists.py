from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.checklist import Checklist, ChecklistTemplate, ChecklistStep
from app.schemas.checklist import (
    Checklist as ChecklistSchema,
    ChecklistCreate,
    ChecklistUpdate,
    ChecklistTemplate as ChecklistTemplateSchema,
    ChecklistTemplateCreate,
    ChecklistTemplateUpdate,
    ChecklistStep as ChecklistStepSchema,
    ChecklistStepCreate,
    ChecklistStepUpdate
)
from .dependencies import get_current_active_user

router = APIRouter()


# Checklist Templates
@router.get("/templates", response_model=List[ChecklistTemplateSchema])
async def read_templates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get list of checklist templates"""
    templates = db.query(ChecklistTemplate).offset(skip).limit(limit).all()
    return templates


@router.get("/templates/{template_id}", response_model=ChecklistTemplateSchema)
async def read_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get checklist template by ID"""
    template = db.query(ChecklistTemplate).filter(ChecklistTemplate.template_id == template_id).first()
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.post("/templates", response_model=ChecklistTemplateSchema, status_code=status.HTTP_201_CREATED)
async def create_template(
    template: ChecklistTemplateCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new checklist template"""
    db_template = ChecklistTemplate(**template.dict(), created_by=current_user.user_id)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


@router.put("/templates/{template_id}", response_model=ChecklistTemplateSchema)
async def update_template(
    template_id: int,
    template_update: ChecklistTemplateUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update checklist template"""
    db_template = db.query(ChecklistTemplate).filter(ChecklistTemplate.template_id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    
    update_data = template_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_template, field, value)
    
    db.commit()
    db.refresh(db_template)
    return db_template


@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Delete checklist template"""
    db_template = db.query(ChecklistTemplate).filter(ChecklistTemplate.template_id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    
    db.delete(db_template)
    db.commit()
    return None


# Checklists
@router.get("", response_model=List[ChecklistSchema])
async def read_checklists(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get list of checklists"""
    checklists = db.query(Checklist).offset(skip).limit(limit).all()
    return checklists


@router.get("/{checklist_id}", response_model=ChecklistSchema)
async def read_checklist(
    checklist_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get checklist by ID"""
    checklist = db.query(Checklist).filter(Checklist.checklist_id == checklist_id).first()
    if checklist is None:
        raise HTTPException(status_code=404, detail="Checklist not found")
    return checklist


@router.post("", response_model=ChecklistSchema, status_code=status.HTTP_201_CREATED)
async def create_checklist(
    checklist: ChecklistCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new checklist"""
    db_checklist = Checklist(**checklist.dict(), created_by=current_user.user_id)
    db.add(db_checklist)
    db.commit()
    db.refresh(db_checklist)
    return db_checklist


@router.put("/{checklist_id}", response_model=ChecklistSchema)
async def update_checklist(
    checklist_id: int,
    checklist_update: ChecklistUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update checklist"""
    db_checklist = db.query(Checklist).filter(Checklist.checklist_id == checklist_id).first()
    if db_checklist is None:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    update_data = checklist_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_checklist, field, value)
    
    db.commit()
    db.refresh(db_checklist)
    return db_checklist


@router.delete("/{checklist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_checklist(
    checklist_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Delete checklist"""
    db_checklist = db.query(Checklist).filter(Checklist.checklist_id == checklist_id).first()
    if db_checklist is None:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    db.delete(db_checklist)
    db.commit()
    return None


# Checklist Steps
@router.get("/{checklist_id}/steps", response_model=List[ChecklistStepSchema])
async def read_checklist_steps(
    checklist_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get steps for a checklist"""
    steps = db.query(ChecklistStep).filter(
        ChecklistStep.checklist_id == checklist_id
    ).order_by(ChecklistStep.step_number).all()
    return steps


@router.get("/{checklist_id}/steps/{step_id}", response_model=ChecklistStepSchema)
async def read_checklist_step(
    checklist_id: int,
    step_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get checklist step by ID"""
    step = db.query(ChecklistStep).filter(
        ChecklistStep.checklist_id == checklist_id,
        ChecklistStep.step_id == step_id
    ).first()
    if step is None:
        raise HTTPException(status_code=404, detail="Step not found")
    return step


@router.post("/{checklist_id}/steps", response_model=ChecklistStepSchema, status_code=status.HTTP_201_CREATED)
async def create_checklist_step(
    checklist_id: int,
    step: ChecklistStepCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new step for a checklist"""
    # Verify checklist exists
    checklist = db.query(Checklist).filter(Checklist.checklist_id == checklist_id).first()
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    db_step = ChecklistStep(**step.dict(), checklist_id=checklist_id)
    db.add(db_step)
    db.commit()
    db.refresh(db_step)
    return db_step


@router.put("/{checklist_id}/steps/{step_id}", response_model=ChecklistStepSchema)
async def update_checklist_step(
    checklist_id: int,
    step_id: int,
    step_update: ChecklistStepUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update checklist step"""
    db_step = db.query(ChecklistStep).filter(
        ChecklistStep.checklist_id == checklist_id,
        ChecklistStep.step_id == step_id
    ).first()
    if db_step is None:
        raise HTTPException(status_code=404, detail="Step not found")
    
    update_data = step_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_step, field, value)
    
    db.commit()
    db.refresh(db_step)
    return db_step


@router.delete("/{checklist_id}/steps/{step_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_checklist_step(
    checklist_id: int,
    step_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Delete checklist step"""
    db_step = db.query(ChecklistStep).filter(
        ChecklistStep.checklist_id == checklist_id,
        ChecklistStep.step_id == step_id
    ).first()
    if db_step is None:
        raise HTTPException(status_code=404, detail="Step not found")
    
    db.delete(db_step)
    db.commit()
    return None

