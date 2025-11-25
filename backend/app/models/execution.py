from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Execution(Base):
    __tablename__ = "executions"

    execution_id = Column(Integer, primary_key=True, index=True)
    checklist_id = Column(Integer, ForeignKey("checklists.checklist_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True))
    status = Column(String(20), default="In Progress")  # In Progress, Completed, Failed, Aborted
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    checklist = relationship("Checklist", back_populates="executions")
    user = relationship("User", back_populates="executions")
    step_executions = relationship("StepExecution", back_populates="execution", cascade="all, delete-orphan", order_by="StepExecution.step_id")


class StepExecution(Base):
    __tablename__ = "step_executions"

    exec_step_id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(Integer, ForeignKey("executions.execution_id"), nullable=False)
    step_id = Column(Integer, ForeignKey("checklist_steps.step_id"), nullable=False)
    status = Column(String(20), default="Pending")  # Pending, In Progress, Completed, Failed
    execution_time = Column(Float)  # Time taken to complete the step in seconds
    verification_result = Column(String(20))  # Pass, Fail, Warning
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    execution = relationship("Execution", back_populates="step_executions")
    step = relationship("ChecklistStep", back_populates="step_executions")
    evidence = relationship("Evidence", back_populates="step_execution", cascade="all, delete-orphan")
    exceptions = relationship("Exception", back_populates="step_execution", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="step_execution", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidence"

    evidence_id = Column(Integer, primary_key=True, index=True)
    exec_step_id = Column(Integer, ForeignKey("step_executions.exec_step_id"), nullable=False)
    file_path = Column(String(500), nullable=False)
    evidence_type = Column(String(50))  # Image, Video, Log
    timestamp = Column(DateTime(timezone=True), nullable=False)
    evidence_metadata = Column(Text)  # JSON metadata as text (renamed from metadata - reserved word)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    step_execution = relationship("StepExecution", back_populates="evidence")


class Exception(Base):
    __tablename__ = "exceptions"

    exception_id = Column(Integer, primary_key=True, index=True)
    exec_step_id = Column(Integer, ForeignKey("step_executions.exec_step_id"), nullable=False)
    exception_type = Column(String(50))  # Procedural, Technical, Safety
    description = Column(Text, nullable=False)
    status = Column(String(20), default="Open")  # Open, In Review, Resolved, Closed
    resolved_by = Column(Integer, ForeignKey("users.user_id"))
    resolved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    step_execution = relationship("StepExecution", back_populates="exceptions")


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, index=True)
    exec_step_id = Column(Integer, ForeignKey("step_executions.exec_step_id"), nullable=False)
    alert_type = Column(String(50))  # Warning, Error, Information
    severity = Column(String(20))  # Low, Medium, High, Critical
    message = Column(Text, nullable=False)
    status = Column(String(20), default="Active")  # Active, Acknowledged, Resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    step_execution = relationship("StepExecution", back_populates="alerts")

