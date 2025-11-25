from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChecklistTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    version: str = "1.0"


class ChecklistTemplateCreate(ChecklistTemplateBase):
    pass


class ChecklistTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None


class ChecklistTemplate(ChecklistTemplateBase):
    template_id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChecklistStepBase(BaseModel):
    step_number: int
    description: str
    instructions: Optional[str] = None
    verification_type: Optional[str] = None


class ChecklistStepCreate(ChecklistStepBase):
    pass


class ChecklistStepUpdate(BaseModel):
    step_number: Optional[int] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    verification_type: Optional[str] = None


class ChecklistStep(ChecklistStepBase):
    step_id: int
    checklist_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChecklistBase(BaseModel):
    name: str
    description: Optional[str] = None
    template_id: Optional[int] = None
    status: str = "Active"


class ChecklistCreate(ChecklistBase):
    pass


class ChecklistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    template_id: Optional[int] = None
    status: Optional[str] = None


class Checklist(ChecklistBase):
    checklist_id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    steps: List[ChecklistStep] = []

    class Config:
        from_attributes = True

