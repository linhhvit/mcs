# Camera Entity

## Overview
The Camera entity represents individual monitoring devices deployed within zones. Cameras capture video footage and provide real-time monitoring capabilities.

## Attributes
- **camera_id**: Unique identifier for the camera
- **camera_name**: Descriptive name of the camera
- **camera_code**: Short identification code
- **zone_id**: Foreign key reference to the parent zone
- **camera_type**: Type of camera (Fixed, PTZ, Dome, etc.)
- **model**: Camera model and manufacturer
- **serial_number**: Hardware serial number
- **ip_address**: Network IP address
- **mac_address**: Hardware MAC address
- **location_description**: Detailed location description
- **coordinates**: Precise positioning coordinates
- **installation_date**: Date of installation
- **status**: Operational status (Online, Offline, Maintenance, Error)
- **resolution**: Video resolution capability
- **frame_rate**: Recording frame rate
- **field_of_view**: Camera viewing angle and coverage
- **night_vision**: Night vision capability (Yes/No)
- **audio_enabled**: Audio recording capability (Yes/No)
- **motion_detection**: Motion detection feature (Yes/No)
- **recording_enabled**: Recording status (Yes/No)
- **last_maintenance**: Last maintenance date
- **firmware_version**: Current firmware version

## Relationships
- **belongs to** Zone (Many-to-One)
  - Each camera is assigned to exactly one zone
  - Camera positioning defines zone coverage area
- **monitored by** User (Many-to-Many)
  - Users can monitor multiple cameras
  - Access determined by site and zone assignments
  - Role-based camera operation permissions
  - Audit trail maintained for all interactions

## Business Rules
- Each camera must be assigned to exactly one zone
- Camera codes must be unique within a zone
- User access to cameras is determined by site and zone permissions
- All camera interactions must be logged for audit purposes
- Cameras must maintain network connectivity for monitoring
- Recording settings inherit from zone security policies

## Camera Types
- **Fixed**: Stationary cameras with fixed viewing angle
- **PTZ**: Pan-Tilt-Zoom cameras with remote control
- **Dome**: Dome-style cameras for discrete monitoring
- **Bullet**: Bullet-style cameras for outdoor use
- **Thermal**: Thermal imaging cameras for specialized monitoring
- **360°**: Panoramic cameras with full coverage

## Status Types
- **Online**: Camera is operational and streaming
- **Offline**: Camera is not responding or disconnected
- **Maintenance**: Camera is under scheduled maintenance
- **Error**: Camera has technical issues requiring attention
- **Disabled**: Camera is intentionally disabled