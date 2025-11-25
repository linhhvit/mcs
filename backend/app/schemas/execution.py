from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class StepExecutionBase(BaseModel):
    step_id: int
    status: str = "Pending"
    verification_result: Optional[str] = None
    notes: Optional[str] = None


class StepExecutionCreate(StepExecutionBase):
    pass


class StepExecution(StepExecutionBase):
    exec_step_id: int
    execution_id: int
    execution_time: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExecutionBase(BaseModel):
    checklist_id: int
    status: str = "In Progress"
    notes: Optional[str] = None


class ExecutionCreate(ExecutionBase):
    pass


class Execution(ExecutionBase):
    execution_id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    step_executions: List[StepExecution] = []

    class Config:
        from_attributes = True

