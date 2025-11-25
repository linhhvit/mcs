# Site Entity

## Overview
The Site entity represents physical locations or facilities that contain monitoring infrastructure. Sites serve as the top-level organizational unit for the camera system.

## Attributes
- **site_id**: Unique identifier for the site
- **site_name**: Descriptive name of the site
- **site_code**: Short code or abbreviation for the site
- **address**: Physical address of the site
- **coordinates**: GPS coordinates (latitude, longitude)
- **site_type**: Type of facility (Office, Warehouse, Factory, etc.)
- **status**: Operational status (Active, Inactive, Under Construction)
- **created_at**: Site creation timestamp
- **updated_at**: Last modification timestamp
- **contact_person**: Primary contact for the site
- **contact_phone**: Contact phone number
- **description**: Additional site information
- **timezone**: Site's timezone for scheduling and reporting

## Relationships
- **contains** Zone (One-to-Many)
  - Each site must have at least one zone
  - Zones inherit site-level security policies
  - Sites provide organizational structure for zones
- **assigned to** User (Many-to-Many)
  - Multiple users can be assigned to a site
  - Users can be assigned to multiple sites
  - Assignment includes role-specific permissions

## Business Rules
- Sites must have at least one zone
- Site codes must be unique across the system
- Users assigned to a site inherit access to all zones within that site (unless restricted)
- Site-level security policies cascade down to all contained zones and cameras

## Site Types
- **Office**: Corporate office buildings
- **Warehouse**: Storage and distribution facilities
- **Factory**: Manufacturing facilities
- **Retail**: Retail stores and shopping centers
- **Residential**: Residential complexes
- **Public**: Public spaces and facilities