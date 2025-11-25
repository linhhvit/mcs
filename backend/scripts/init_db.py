#!/usr/bin/env python3
"""
Initialize database with initial data
Run this after migrations are applied
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, Role, Permission
from app.models.camera import Site, Zone


def init_db():
    """Initialize database with default data"""
    db = SessionLocal()
    
    try:
        # Create default roles
        admin_role = db.query(Role).filter(Role.role_name == "Administrator").first()
        if not admin_role:
            admin_role = Role(
                role_name="Administrator",
                description="Full system access"
            )
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)
            print("✓ Created Administrator role")
        
        operator_role = db.query(Role).filter(Role.role_name == "Operator").first()
        if not operator_role:
            operator_role = Role(
                role_name="Operator",
                description="Camera control and operations"
            )
            db.add(operator_role)
            db.commit()
            db.refresh(operator_role)
            print("✓ Created Operator role")
        
        viewer_role = db.query(Role).filter(Role.role_name == "Viewer").first()
        if not viewer_role:
            viewer_role = Role(
                role_name="Viewer",
                description="View-only access"
            )
            db.add(viewer_role)
            db.commit()
            db.refresh(viewer_role)
            print("✓ Created Viewer role")
        
        # Create default admin user if it doesn't exist
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            try:
                # Use a shorter password to avoid bcrypt issues
                password = "admin123"
                password_hash = get_password_hash(password)
                admin_user = User(
                    username="admin",
                    email="admin@mcs.local",
                    password_hash=password_hash,
                    first_name="Admin",
                    last_name="User",
                    status="Active"
                )
                admin_user.roles.append(admin_role)
                db.add(admin_user)
                db.commit()
                print("✓ Created default admin user (username: admin, password: admin123)")
            except Exception as e:
                print(f"⚠️  Warning: Could not create admin user: {e}")
                print("   You can create it manually through the API or UI")
        
        # Create default site and zone
        default_site = db.query(Site).filter(Site.site_name == "Default Site").first()
        if not default_site:
            default_site = Site(
                site_name="Default Site",
                location="Default Location",
                description="Default site for initial setup",
                status="Active"
            )
            db.add(default_site)
            db.commit()
            db.refresh(default_site)
            print("✓ Created default site")
            
            default_zone = Zone(
                zone_name="Default Zone",
                site_id=default_site.site_id,
                description="Default zone for initial setup",
                status="Active"
            )
            db.add(default_zone)
            db.commit()
            print("✓ Created default zone")
        
        print("\n✓ Database initialization completed!")
        
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

