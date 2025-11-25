from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.camera import Camera, Site, Zone
from app.schemas.camera import (
    Camera as CameraSchema,
    CameraCreate,
    CameraUpdate,
    Site as SiteSchema,
    SiteCreate,
    SiteUpdate,
    Zone as ZoneSchema,
    ZoneCreate,
    ZoneUpdate
)
from .dependencies import get_current_active_user

router = APIRouter()


# Sites endpoints
@router.get("/sites", response_model=List[SiteSchema])
async def read_sites(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get list of sites"""
    sites = db.query(Site).offset(skip).limit(limit).all()
    return sites


@router.get("/sites/{site_id}", response_model=SiteSchema)
async def read_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get site by ID"""
    site = db.query(Site).filter(Site.site_id == site_id).first()
    if site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


@router.post("/sites", response_model=SiteSchema, status_code=status.HTTP_201_CREATED)
async def create_site(
    site: SiteCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new site"""
    db_site = Site(**site.dict())
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return db_site


@router.put("/sites/{site_id}", response_model=SiteSchema)
async def update_site(
    site_id: int,
    site_update: SiteUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update site"""
    db_site = db.query(Site).filter(Site.site_id == site_id).first()
    if db_site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    
    update_data = site_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_site, field, value)
    
    db.commit()
    db.refresh(db_site)
    return db_site


@router.delete("/sites/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Delete site"""
    db_site = db.query(Site).filter(Site.site_id == site_id).first()
    if db_site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    
    db.delete(db_site)
    db.commit()
    return None


# Zones endpoints
@router.get("/zones", response_model=List[ZoneSchema])
async def read_zones(
    skip: int = 0,
    limit: int = 100,
    site_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get list of zones"""
    query = db.query(Zone)
    if site_id:
        query = query.filter(Zone.site_id == site_id)
    zones = query.offset(skip).limit(limit).all()
    return zones


@router.get("/zones/{zone_id}", response_model=ZoneSchema)
async def read_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get zone by ID"""
    zone = db.query(Zone).filter(Zone.zone_id == zone_id).first()
    if zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    return zone


@router.post("/zones", response_model=ZoneSchema, status_code=status.HTTP_201_CREATED)
async def create_zone(
    zone: ZoneCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new zone"""
    # Verify site exists
    site = db.query(Site).filter(Site.site_id == zone.site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    db_zone = Zone(**zone.dict())
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone


@router.put("/zones/{zone_id}", response_model=ZoneSchema)
async def update_zone(
    zone_id: int,
    zone_update: ZoneUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update zone"""
    db_zone = db.query(Zone).filter(Zone.zone_id == zone_id).first()
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    # Verify site exists if site_id is being updated
    if zone_update.site_id and zone_update.site_id != db_zone.site_id:
        site = db.query(Site).filter(Site.site_id == zone_update.site_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")
    
    update_data = zone_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_zone, field, value)
    
    db.commit()
    db.refresh(db_zone)
    return db_zone


@router.delete("/zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_zone(
    zone_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Delete zone"""
    db_zone = db.query(Zone).filter(Zone.zone_id == zone_id).first()
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    db.delete(db_zone)
    db.commit()
    return None


# Cameras endpoints
@router.get("", response_model=List[CameraSchema])
async def read_cameras(
    skip: int = 0,
    limit: int = 100,
    zone_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get list of cameras"""
    query = db.query(Camera)
    if zone_id:
        query = query.filter(Camera.zone_id == zone_id)
    cameras = query.offset(skip).limit(limit).all()
    return cameras


@router.get("/{camera_id}", response_model=CameraSchema)
async def read_camera(
    camera_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get camera by ID"""
    camera = db.query(Camera).filter(Camera.camera_id == camera_id).first()
    if camera is None:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera


@router.post("", response_model=CameraSchema, status_code=status.HTTP_201_CREATED)
async def create_camera(
    camera: CameraCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Create a new camera"""
    # Verify zone exists
    zone = db.query(Zone).filter(Zone.zone_id == camera.zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    db_camera = Camera(**camera.dict())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera


@router.put("/{camera_id}", response_model=CameraSchema)
async def update_camera(
    camera_id: int,
    camera_update: CameraUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Update camera"""
    db_camera = db.query(Camera).filter(Camera.camera_id == camera_id).first()
    if db_camera is None:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    update_data = camera_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_camera, field, value)
    
    db.commit()
    db.refresh(db_camera)
    return db_camera


@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_camera(
    camera_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Delete camera"""
    db_camera = db.query(Camera).filter(Camera.camera_id == camera_id).first()
    if db_camera is None:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db.delete(db_camera)
    db.commit()
    return None

