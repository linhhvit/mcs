from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.execution import Execution, StepExecution
from app.models.checklist import Checklist
from app.schemas.execution import (
    Execution as ExecutionSchema,
    ExecutionCreate,
    StepExecution as StepExecutionSchema,
    StepExecutionCreate
)
from .dependencies import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[ExecutionSchema])
async def read_executions(
    skip: int = 0,
    limit: int = 100,
    checklist_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get list of executions"""
    query = db.query(Execution)
    if checklist_id:
        query = query.filter(Execution.checklist_id == checklist_id)
    executions = query.offset(skip).limit(limit).all()
    return executions


@router.get("/{execution_id}", response_model=ExecutionSchema)
async def read_execution(
    execution_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get execution by ID"""
    execution = db.query(Execution).filter(Execution.execution_id == execution_id).first()
    if execution is None:
        raise HTTPException(status_code=404, detail="Execution not found")
    return execution


@router.post("", response_model=ExecutionSchema, status_code=status.HTTP_201_CREATED)
async def create_execution(
    execution: ExecutionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Start a new execution"""
    # Verify checklist exists
    checklist = db.query(Checklist).filter(Checklist.checklist_id == execution.checklist_id).first()
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist not found")
    
    db_execution = Execution(
        checklist_id=execution.checklist_id,
        user_id=current_user.user_id,
        start_time=datetime.utcnow(),
        status=execution.status,
        notes=execution.notes
    )
    db.add(db_execution)
    db.commit()
    db.refresh(db_execution)
    return db_execution


@router.put("/{execution_id}/complete", response_model=ExecutionSchema)
async def complete_execution(
    execution_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Mark execution as completed"""
    db_execution = db.query(Execution).filter(Execution.execution_id == execution_id).first()
    if db_execution is None:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    db_execution.status = "Completed"
    db_execution.end_time = datetime.utcnow()
    db.commit()
    db.refresh(db_execution)
    return db_execution


# Step Executions
@router.get("/{execution_id}/steps", response_model=List[StepExecutionSchema])
async def read_step_executions(
    execution_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get step executions for an execution"""
    step_executions = db.query(StepExecution).filter(
        StepExecution.execution_id == execution_id
    ).all()
    return step_executions


@router.post("/{execution_id}/steps", response_model=StepExecutionSchema, status_code=status.HTTP_201_CREATED)
async def create_step_execution(
    execution_id: int,
    step_execution: StepExecutionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a step execution"""
    # Verify execution exists
    execution = db.query(Execution).filter(Execution.execution_id == execution_id).first()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    db_step_execution = StepExecution(
        **step_execution.dict(),
        execution_id=execution_id
    )
    db.add(db_step_execution)
    db.commit()
    db.refresh(db_step_execution)
    return db_step_execution


@router.put("/steps/{step_execution_id}", response_model=StepExecutionSchema)
async def update_step_execution(
    step_execution_id: int,
    step_execution: StepExecutionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update a step execution"""
    db_step_execution = db.query(StepExecution).filter(
        StepExecution.exec_step_id == step_execution_id
    ).first()
    if db_step_execution is None:
        raise HTTPException(status_code=404, detail="Step execution not found")
    
    update_data = step_execution.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_step_execution, field, value)
    
    db.commit()
    db.refresh(db_step_execution)
    return db_step_execution

