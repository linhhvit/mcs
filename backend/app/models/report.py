from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(Integer, primary_key=True, index=True)
    report_type = Column(String(50), nullable=False)  # Execution Summary, Compliance, Performance
    parameters = Column(JSON)  # JSON parameters used to generate the report
    generated_by = Column(Integer, ForeignKey("users.user_id"))
    file_path = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

