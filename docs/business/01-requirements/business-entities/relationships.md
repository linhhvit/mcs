# Business Entity Relationships

## Relationship Overview
This document defines the detailed relationships between business entities in the Monitoring Camera System, including cardinality, dependencies, and interaction patterns.

## Core Entity Relationships

### 1. User Management Relationships

#### User ↔ Site Relationships
- **User** `assigned to` **Site** (Many-to-Many)
  - One user can be assigned to multiple sites
  - One site can have multiple assigned users
  - Assignment includes role-specific permissions per site

#### User ↔ Zone Relationships
- **User** `has access to` **Zone** (Many-to-Many)
  - User access is inherited from site assignments
  - Additional zone-specific restrictions can be applied
  - Access levels vary by user role (Admin, Operator, Viewer, Guest)

#### User ↔ Camera Relationships
- **User** `can monitor` **Camera** (Many-to-Many)
  - Access determined by site and zone assignments
  - Role-based camera operation permissions
  - Audit trail maintained for all camera interactions

### 2. Infrastructure Relationships

#### Site ↔ Zone Relationships
- **Site** `contains` **Zone** (One-to-Many)
  - Each zone belongs to exactly one site
  - Sites must have at least one zone
  - Zones inherit site-level security policies

#### Zone ↔ Camera Relationships
- **Zone** `contains` **Camera** (One-to-Many)
  - Each camera is assigned to exactly one zone
  - Zones can contain multiple cameras of different types
  - Camera positioning defines zone coverage areas

#### Camera ↔ Camera Group Relationships
- **Camera** `belongs to` **Camera Group** (Many-to-Many)
  - Cameras can belong to multiple logical groups
  - Groups enable batch operations and management
  - Group membership can span multiple zones

### 3. Recording & Storage Relationships

#### Camera ↔ Live Stream Relationships
- **Camera** `generates` **Live Stream** (One-to-One)
  - Each active camera produces one live stream
  - Stream availability depends on camera operational status
  - Multiple users can view the same live stream

#### Camera ↔ Recorded Footage Relationships
- **Camera** `produces` **Recorded Footage** (One-to-Many)
  - Each camera generates multiple recording segments
  - Recordings linked to specific time periods and events
  - Metadata includes camera settings and environmental conditions

#### Storage Device ↔ Recorded Footage Relationships
- **Storage Device** `stores` **Recorded Footage** (One-to-Many)
  - Footage distributed across available storage devices
  - Load balancing based on device capacity and performance
  - Redundancy maintained through backup relationships

#### Storage Device ↔ Backup System Relationships
- **Storage Device** `backed up by` **Backup System** (Many-to-Many)
  - Critical footage replicated to multiple backup locations
  - Backup frequency based on footage priority and retention policies
  - Geographic distribution for disaster recovery

### 4. Operational Relationships

#### User ↔ Monitoring Session Relationships
- **User** `conducts` **Monitoring Session** (One-to-Many)
  - Each session assigned to one operator
  - Session duration tracked for compliance and scheduling
  - Handover procedures for shift changes

#### Monitoring Session ↔ Camera Relationships
- **Monitoring Session** `monitors` **Camera** (Many-to-Many)
  - Sessions can monitor multiple cameras simultaneously
  - Camera assignment based on zone responsibilities
  - Priority cameras require continuous monitoring

#### Camera ↔ Alert Relationships
- **Camera** `generates` **Alert** (One-to-Many)
  - Alerts triggered by motion detection, tampering, or system failures
  - Alert severity levels determine response requirements
  - Historical alert patterns used for predictive maintenance

#### Alert ↔ User Relationships
- **Alert** `assigned to` **User** (Many-to-One)
  - Alerts routed to appropriate operators based on zone assignments
  - Escalation rules for unacknowledged alerts
  - Admin override capabilities for critical situations

#### Alert ↔ Incident Report Relationships
- **Alert** `may generate` **Incident Report** (One-to-Zero-or-One)
  - Not all alerts result in formal incidents
  - Incident creation based on alert severity and operator assessment
  - Multiple alerts can contribute to single incident

### 5. Configuration Relationships

#### Camera ↔ Camera Settings Relationships
- **Camera** `configured by` **Camera Settings** (One-to-One)
  - Each camera has unique configuration profile
  - Settings include technical and operational parameters
  - Configuration changes logged for audit purposes

#### User ↔ User Permissions Relationships
- **User** `governed by` **User Permissions** (One-to-One)
  - Permission sets define access scope and capabilities
  - Role-based templates with custom modifications
  - Permission inheritance from group memberships

#### Site ↔ Network Configuration Relationships
- **Site** `has` **Network Configuration** (One-to-One)
  - Network settings specific to each site location
  - Bandwidth allocation and quality of service parameters
  - VPN and security protocol configurations

## Integration Relationships

### External System Connections

#### Camera ↔ Access Control System
- **Camera** `integrated with` **Access Control System** (Many-to-Many)
  - Cameras monitor entry/exit points
  - Video verification for access events
  - Coordinated response to security breaches

#### Alert ↔ Fire Safety System
- **Alert** `triggers` **Fire Safety System** (One-to-Many)
  - Smoke detection alerts activate camera focus
  - Evacuation route monitoring during emergencies
  - Automated emergency service notifications

#### Recorded Footage ↔ Video Analytics
- **Recorded Footage** `processed by` **Video Analytics** (One-to-Many)
  - AI analysis for behavior pattern recognition
  - Automated threat detection and classification
  - Performance metrics and optimization recommendations

### Data Flow Relationships

#### Primary Data Flow
1. **Camera** → **Live Stream** → **User** (Real-time monitoring)
2. **Camera** → **Recorded Footage** → **Storage Device** (Data persistence)
3. **Camera** → **Alert** → **User** → **Incident Report** (Event management)
4. **Recorded Footage** → **Backup System** → **Off-site Storage** (Data protection)

#### Secondary Data Flow
1. **User** → **Camera Settings** → **Camera** (Configuration management)
2. **Monitoring Session** → **Maintenance Log** → **System Configuration** (Operational tracking)
3. **Incident Report** → **Reporting System** → **External Authorities** (Compliance reporting)

## Relationship Constraints

### Referential Integrity
- Cameras cannot exist without assigned zones
- Alerts must reference valid cameras and users
- Recorded footage requires associated camera and storage device
- Monitoring sessions must have valid user and time period

### Business Logic Constraints
- Guest users cannot access administrative functions
- Critical zone cameras require redundant storage
- High-priority alerts must be acknowledged within defined timeframes
- Backup systems must maintain geographic separation

### Temporal Constraints
- Live streams are only available during camera operational hours
- Recorded footage retention follows legal and policy requirements
- User sessions have maximum duration limits
- Alert escalation follows time-based rules

## Relationship Lifecycle Management

### Creation Dependencies
1. Sites must be established before zones can be created
2. Zones must exist before cameras can be assigned
3. Users must be created before monitoring sessions can begin
4. Storage devices must be configured before recording can commence

### Modification Impacts
- Camera reassignment affects zone coverage and user access
- User permission changes impact monitoring capabilities
- Storage device modifications require footage migration
- Network configuration updates may interrupt live streams

### Deletion Cascades
- Site deletion removes all associated zones and cameras
- User deletion transfers monitoring sessions and alert assignments
- Camera deletion archives associated footage and alerts
- Storage device removal requires data migration to alternate storage