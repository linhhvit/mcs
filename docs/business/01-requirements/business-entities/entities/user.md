# User Entity

## Overview
The User entity represents individuals who interact with the Monitoring Camera System. Users are assigned to sites and have role-based access to zones and cameras.

## Attributes
- **user_id**: Unique identifier for the user
- **username**: Login username
- **email**: User's email address
- **full_name**: Complete name of the user
- **role**: User role (Admin, Operator, Viewer, Guest)
- **status**: Account status (Active, Inactive, Suspended)
- **created_at**: Account creation timestamp
- **last_login**: Last login timestamp
- **password_hash**: Encrypted password
- **phone_number**: Contact phone number
- **department**: User's department or organization unit

## Relationships
- **assigned to** Site (Many-to-Many)
  - Users can be assigned to multiple sites
  - Assignment includes role-specific permissions per site
- **has access to** Zone (Many-to-Many)
  - Access inherited from site assignments
  - Additional zone-specific restrictions can be applied
  - Access levels vary by user role
- **can monitor** Camera (Many-to-Many)
  - Access determined by site and zone assignments
  - Role-based camera operation permissions
  - Audit trail maintained for all interactions

## Business Rules
- Each user must have a unique username and email
- Users must be assigned at least one role
- Access to cameras is determined by site and zone assignments
- All user interactions with cameras are logged for audit purposes

## Role Permissions
- **Admin**: Full system access, user management, configuration
- **Operator**: Camera control, incident management, reporting
- **Viewer**: View-only access to assigned cameras and zones
- **Guest**: Limited temporary access to specific areas