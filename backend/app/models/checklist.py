from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class ChecklistTemplate(Base):
    __tablename__ = "checklist_templates"

    template_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    version = Column(String(20), default="1.0")
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    checklists = relationship("Checklist", back_populates="template")


class Checklist(Base):
    __tablename__ = "checklists"

    checklist_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    template_id = Column(Integer, ForeignKey("checklist_templates.template_id"))
    status = Column(String(20), default="Active")  # Active, Inactive, Archived
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    template = relationship("ChecklistTemplate", back_populates="checklists")
    steps = relationship("ChecklistStep", back_populates="checklist", cascade="all, delete-orphan", order_by="ChecklistStep.step_number")
    executions = relationship("Execution", back_populates="checklist", cascade="all, delete-orphan")


class ChecklistStep(Base):
    __tablename__ = "checklist_steps"

    step_id = Column(Integer, primary_key=True, index=True)
    checklist_id = Column(Integer, ForeignKey("checklists.checklist_id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    instructions = Column(Text)
    verification_type = Column(String(50))  # Visual, Automated, Manual
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    checklist = relationship("Checklist", back_populates="steps")
    camera_mappings = relationship("CameraMapping", back_populates="step", cascade="all, delete-orphan")
    step_executions = relationship("StepExecution", back_populates="step", cascade="all, delete-orphan")

