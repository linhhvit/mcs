#!/usr/bin/env python3
"""
Rehash admin password with new bcrypt implementation
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.core.security import get_password_hash, verify_password
from app.models.user import User


def rehash_admin_password():
    """Rehash admin password"""
    db = SessionLocal()
    
    try:
        admin_user = db.query(User).filter(User.username == "admin").first()
        
        if not admin_user:
            print("✗ Admin user not found")
            return
        
        # Check if current hash works
        current_works = verify_password("admin123", admin_user.password_hash)
        print(f"Current hash verification: {current_works}")
        
        if not current_works:
            # Rehash the password
            new_hash = get_password_hash("admin123")
            admin_user.password_hash = new_hash
            db.commit()
            
            # Verify new hash
            new_works = verify_password("admin123", admin_user.password_hash)
            if new_works:
                print("✓ Admin password rehashed successfully")
            else:
                print("✗ New hash verification failed")
        else:
            print("✓ Current password hash is working correctly")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    rehash_admin_password()

