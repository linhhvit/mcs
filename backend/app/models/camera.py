from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base


class Site(Base):
    __tablename__ = "sites"

    site_id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String(100), nullable=False)
    location = Column(String(255))
    description = Column(Text)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    zones = relationship("Zone", back_populates="site", cascade="all, delete-orphan")


class Zone(Base):
    __tablename__ = "zones"

    zone_id = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String(100), nullable=False)
    site_id = Column(Integer, ForeignKey("sites.site_id"), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    site = relationship("Site", back_populates="zones")
    cameras = relationship("Camera", back_populates="zone", cascade="all, delete-orphan")


class Camera(Base):
    __tablename__ = "cameras"

    camera_id = Column(Integer, primary_key=True, index=True)
    camera_name = Column(String(100), nullable=False)
    camera_code = Column(String(50))
    zone_id = Column(Integer, ForeignKey("zones.zone_id"), nullable=False)
    camera_type = Column(String(50))  # Fixed, PTZ, Dome, etc.
    model = Column(String(100))
    serial_number = Column(String(100))
    ip_address = Column(String(50))
    mac_address = Column(String(50))
    location_description = Column(Text)
    coordinates = Column(String(100))
    installation_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="Online")  # Online, Offline, Maintenance, Error
    resolution = Column(String(50))
    frame_rate = Column(Integer)
    field_of_view = Column(String(100))
    night_vision = Column(Boolean, default=False)
    audio_enabled = Column(Boolean, default=False)
    motion_detection = Column(Boolean, default=False)
    recording_enabled = Column(Boolean, default=True)
    last_maintenance = Column(DateTime(timezone=True))
    firmware_version = Column(String(50))
    configuration = Column(JSON)  # JSON configuration parameters
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    zone = relationship("Zone", back_populates="cameras")
    camera_mappings = relationship("CameraMapping", back_populates="camera", cascade="all, delete-orphan")


class CameraMapping(Base):
    __tablename__ = "camera_mappings"

    mapping_id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.camera_id"), nullable=False)
    step_id = Column(Integer, ForeignKey("checklist_steps.step_id"), nullable=False)
    zone_config = Column(JSON)  # JSON configuration for monitoring zones/angles
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    camera = relationship("Camera", back_populates="camera_mappings")
    step = relationship("ChecklistStep", back_populates="camera_mappings")

