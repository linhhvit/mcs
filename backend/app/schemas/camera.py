from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class SiteBase(BaseModel):
    site_name: str
    location: Optional[str] = None
    description: Optional[str] = None
    status: str = "Active"


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    site_name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class Site(SiteBase):
    site_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ZoneBase(BaseModel):
    zone_name: str
    site_id: int
    description: Optional[str] = None
    status: str = "Active"


class ZoneCreate(ZoneBase):
    pass


class ZoneUpdate(BaseModel):
    zone_name: Optional[str] = None
    site_id: Optional[int] = None
    description: Optional[str] = None
    status: Optional[str] = None


class Zone(ZoneBase):
    zone_id: int
    created_at: datetime
    updated_at: datetime
    site: Optional[Site] = None

    class Config:
        from_attributes = True


class CameraBase(BaseModel):
    camera_name: str
    camera_code: Optional[str] = None
    zone_id: int
    camera_type: Optional[str] = None
    ip_address: Optional[str] = None
    status: str = "Online"
    configuration: Optional[Dict[str, Any]] = None


class CameraCreate(CameraBase):
    pass


class CameraUpdate(BaseModel):
    camera_name: Optional[str] = None
    camera_code: Optional[str] = None
    status: Optional[str] = None
    ip_address: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None


class Camera(CameraBase):
    camera_id: int
    zone_id: int
    created_at: datetime
    updated_at: datetime
    zone: Optional[Zone] = None

    class Config:
        from_attributes = True

