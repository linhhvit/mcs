# Zone Entity

## Overview
The Zone entity represents logical divisions within a site, such as departments, floors, or security areas. Zones provide granular access control and organizational structure for cameras.

## Attributes
- **zone_id**: Unique identifier for the zone
- **zone_name**: Descriptive name of the zone
- **zone_code**: Short code for the zone
- **site_id**: Foreign key reference to the parent site
- **zone_type**: Type of zone (Security, Production, Office, etc.)
- **description**: Detailed description of the zone
- **floor_level**: Floor or level number (if applicable)
- **area_size**: Physical area size in square meters
- **security_level**: Security classification (Public, Restricted, Confidential)
- **status**: Zone status (Active, Inactive, Under Maintenance)
- **created_at**: Zone creation timestamp
- **updated_at**: Last modification timestamp
- **access_hours**: Operating hours for the zone
- **emergency_contact**: Emergency contact for the zone

## Relationships
- **belongs to** Site (Many-to-One)
  - Each zone belongs to exactly one site
  - Inherits site-level security policies
- **contains** Camera (One-to-Many)
  - Zones can contain multiple cameras of different types
  - Camera positioning defines zone coverage area
- **accessed by** User (Many-to-Many)
  - Users can have access to multiple zones
  - Access inherited from site assignments
  - Additional zone-specific restrictions can be applied

## Business Rules
- Each zone must belong to exactly one site
- Zone codes must be unique within a site
- Users access zones based on site assignments and role permissions
- Zone security levels determine camera access and recording policies
- Camera coverage should provide adequate monitoring for the zone area

## Zone Types
- **Security**: High-security areas requiring special access
- **Production**: Manufacturing or operational areas
- **Office**: Administrative and office spaces
- **Storage**: Warehouse and storage areas
- **Common**: Shared spaces like lobbies and corridors
- **Parking**: Vehicle parking areas
- **Perimeter**: Boundary and entrance areas