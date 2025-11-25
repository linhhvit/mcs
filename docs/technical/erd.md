# Database Entity Relationship Diagram
## Camera Monitoring System for Checklist Execution

---

## 1. Overview

This document presents the Entity Relationship Diagram (ERD) for the Camera Monitoring System database. The database schema is designed to support all core business flows including system initialization, user management, checklist configuration, execution monitoring, compliance reporting, and continuous improvement processes.

---

## 2. Entity Relationship Diagram

```
+----------------+       +---------------+       +------------------+
| User           |       | Role          |       | Permission       |
+----------------+       +---------------+       +------------------+
| PK user_id     |<----->| PK role_id    |<----->| PK permission_id |
| username       |       | role_name     |       | permission_name  |
| password_hash  |       | description   |       | description      |
| email          |       | created_at    |       | created_at       |
| first_name     |       | updated_at    |       | updated_at       |
| last_name      |       +---------------+       +------------------+
| status         |
| created_at     |
| updated_at     |
+----------------+
       |
       |
       v
+----------------+       +---------------+       +------------------+
| Camera         |       | Checklist     |<------| ChecklistTemplate|
+----------------+       +---------------+       +------------------+
| PK camera_id   |       | PK checklist_id|       | PK template_id   |
| camera_name    |<------| name          |       | name             |
| location       |       | description   |       | description      |
| ip_address     |       | status        |       | version          |
| status         |       | created_by    |       | created_by       |
| configuration  |       | created_at    |       | created_at       |
| created_at     |       | updated_at    |       | updated_at       |
| updated_at     |       +---------------+       +------------------+
+----------------+              |
       |                        |
       |                        |
       v                        v
+----------------+       +------------------+
| CameraMapping  |       | ChecklistStep    |
+----------------+       +------------------+
| PK mapping_id  |       | PK step_id       |
| FK camera_id   |<------| FK checklist_id  |
| FK step_id     |       | step_number      |
| zone_config    |       | description      |
| created_at     |       | instructions     |
| updated_at     |       | verification_type|
+----------------+       | created_at       |
                         | updated_at       |
                         +------------------+
                                 |
                                 |
                                 v
+----------------+       +------------------+       +---------------+
| Execution      |       | StepExecution    |       | Evidence      |
+----------------+       +------------------+       +---------------+
| PK execution_id|       | PK exec_step_id  |       | PK evidence_id|
| FK checklist_id|<------| FK execution_id  |<------| FK exec_step_id|
| FK user_id     |       | FK step_id       |       | file_path     |
| start_time     |       | status           |       | evidence_type |
| end_time       |       | execution_time   |       | timestamp     |
| status         |       | verification_result|     | metadata      |
| notes          |       | notes            |       | created_at    |
| created_at     |       | created_at       |       +---------------+
| updated_at     |       | updated_at       |
+----------------+       +------------------+
                                 |
                                 |
                   +-------------+-------------+
                   |                           |
                   v                           v
            +---------------+           +---------------+
            | Exception     |           | Alert         |
            +---------------+           +---------------+
            | PK exception_id|           | PK alert_id   |
            | FK exec_step_id|           | FK exec_step_id|
            | exception_type |           | alert_type    |
            | description    |           | severity      |
            | status         |           | message       |
            | resolved_by    |           | status        |
            | resolved_at    |           | created_at    |
            | created_at     |           | updated_at    |
            | updated_at     |           +---------------+
            +---------------+
                   |
                   v
            +---------------+
            | Report        |
            +---------------+
            | PK report_id  |
            | report_type   |
            | parameters    |
            | generated_by  |
            | file_path     |
            | created_at    |
            | updated_at    |
            +---------------+
```

---

## 3. Entity Descriptions

### 3.1 User
Stores information about system users including operations staff, quality supervisors, and administrators.
- **user_id**: Unique identifier for the user
- **username**: User's login name
- **password_hash**: Encrypted password
- **email**: User's email address
- **first_name**: User's first name
- **last_name**: User's last name
- **status**: Active, Inactive, Suspended, etc.
- **created_at**: Timestamp of user creation
- **updated_at**: Timestamp of last update

### 3.2 Role
Defines user roles within the system that determine access levels and permissions.
- **role_id**: Unique identifier for the role
- **role_name**: Name of the role (e.g., Operations Staff, Quality Supervisor, Administrator)
- **description**: Detailed description of the role's responsibilities
- **created_at**: Timestamp of role creation
- **updated_at**: Timestamp of last update

### 3.3 Permission
Defines specific system actions that can be assigned to roles.
- **permission_id**: Unique identifier for the permission
- **permission_name**: Name of the permission (e.g., CreateChecklist, ViewReports)
- **description**: Detailed description of the permission
- **created_at**: Timestamp of permission creation
- **updated_at**: Timestamp of last update

### 3.4 Camera
Stores information about camera devices integrated with the system.
- **camera_id**: Unique identifier for the camera
- **camera_name**: Descriptive name of the camera
- **location**: Physical location of the camera
- **ip_address**: Network address of the camera
- **status**: Operational status (Active, Offline, Maintenance)
- **configuration**: JSON configuration parameters (resolution, frame rate, etc.)
- **created_at**: Timestamp of camera registration
- **updated_at**: Timestamp of last update

### 3.5 Checklist
Represents a specific instance of a checklist to be executed.
- **checklist_id**: Unique identifier for the checklist
- **name**: Name of the checklist
- **description**: Detailed description of the checklist's purpose
- **status**: Current status (Active, Inactive, Archived)
- **created_by**: User who created the checklist
- **created_at**: Timestamp of checklist creation
- **updated_at**: Timestamp of last update

### 3.6 ChecklistTemplate
Master templates from which checklists can be created.
- **template_id**: Unique identifier for the template
- **name**: Name of the template
- **description**: Detailed description of the template's purpose
- **version**: Version number of the template
- **created_by**: User who created the template
- **created_at**: Timestamp of template creation
- **updated_at**: Timestamp of last update

### 3.7 ChecklistStep
Individual steps within a checklist that need to be executed and verified.
- **step_id**: Unique identifier for the step
- **checklist_id**: Foreign key to the associated checklist
- **step_number**: Sequence number of the step
- **description**: Description of what needs to be done
- **instructions**: Detailed instructions for completing the step
- **verification_type**: Method of verification (Visual, Automated, Manual)
- **created_at**: Timestamp of step creation
- **updated_at**: Timestamp of last update

### 3.8 CameraMapping
Maps cameras to specific checklist steps for monitoring.
- **mapping_id**: Unique identifier for the mapping
- **camera_id**: Foreign key to the associated camera
- **step_id**: Foreign key to the associated checklist step
- **zone_config**: JSON configuration for monitoring zones/angles
- **created_at**: Timestamp of mapping creation
- **updated_at**: Timestamp of last update

### 3.9 Execution
Represents a single execution instance of a checklist.
- **execution_id**: Unique identifier for the execution
- **checklist_id**: Foreign key to the associated checklist
- **user_id**: Foreign key to the user performing the execution
- **start_time**: Timestamp when execution started
- **end_time**: Timestamp when execution completed
- **status**: Current status (In Progress, Completed, Failed, Aborted)
- **notes**: Additional notes about the execution
- **created_at**: Timestamp of execution record creation
- **updated_at**: Timestamp of last update

### 3.10 StepExecution
Records the execution of individual steps within a checklist execution.
- **exec_step_id**: Unique identifier for the step execution
- **execution_id**: Foreign key to the associated execution
- **step_id**: Foreign key to the associated checklist step
- **status**: Current status (Pending, In Progress, Completed, Failed)
- **execution_time**: Time taken to complete the step
- **verification_result**: Result of verification (Pass, Fail, Warning)
- **notes**: Additional notes about the step execution
- **created_at**: Timestamp of step execution record creation
- **updated_at**: Timestamp of last update

### 3.11 Evidence
Stores visual or other evidence captured during step execution.
- **evidence_id**: Unique identifier for the evidence
- **exec_step_id**: Foreign key to the associated step execution
- **file_path**: Path to the stored evidence file
- **evidence_type**: Type of evidence (Image, Video, Log)
- **timestamp**: Time when evidence was captured
- **metadata**: Additional metadata about the evidence
- **created_at**: Timestamp of evidence record creation

### 3.12 Exception
Records exceptions or deviations that occur during checklist execution.
- **exception_id**: Unique identifier for the exception
- **exec_step_id**: Foreign key to the associated step execution
- **exception_type**: Type of exception (Procedural, Technical, Safety)
- **description**: Detailed description of the exception
- **status**: Current status (Open, In Review, Resolved, Closed)
- **resolved_by**: User who resolved the exception
- **resolved_at**: Timestamp when exception was resolved
- **created_at**: Timestamp of exception record creation
- **updated_at**: Timestamp of last update

### 3.13 Alert
Notifications generated during the execution process.
- **alert_id**: Unique identifier for the alert
- **exec_step_id**: Foreign key to the associated step execution
- **alert_type**: Type of alert (Warning, Error, Information)
- **severity**: Severity level (Low, Medium, High, Critical)
- **message**: Alert message content
- **status**: Current status (Active, Acknowledged, Resolved)
- **created_at**: Timestamp of alert creation
- **updated_at**: Timestamp of last update

### 3.14 Report
Represents generated reports based on execution data.
- **report_id**: Unique identifier for the report
- **report_type**: Type of report (Execution Summary, Compliance, Performance)
- **parameters**: JSON parameters used to generate the report
- **generated_by**: User who generated the report
- **file_path**: Path to the stored report file
- **created_at**: Timestamp of report generation
- **updated_at**: Timestamp of last update

---

## 4. Key Relationships

1. **User-Role**: Many-to-many relationship through a join table (not shown for simplicity)
2. **Role-Permission**: Many-to-many relationship through a join table (not shown for simplicity)
3. **Checklist-ChecklistStep**: One-to-many (a checklist contains multiple steps)
4. **ChecklistTemplate-Checklist**: One-to-many (a template can be used to create multiple checklists)
5. **Camera-CameraMapping**: One-to-many (a camera can be mapped to multiple steps)
6. **ChecklistStep-CameraMapping**: One-to-many (a step can be monitored by multiple cameras)
7. **Checklist-Execution**: One-to-many (a checklist can have multiple execution instances)
8. **Execution-StepExecution**: One-to-many (an execution contains multiple step executions)
9. **StepExecution-Evidence**: One-to-many (a step execution can have multiple evidence records)
10. **StepExecution-Exception**: One-to-many (a step execution can have multiple exceptions)
11. **StepExecution-Alert**: One-to-many (a step execution can generate multiple alerts)

---

## 5. Data Integrity Rules

1. **Cascading Deletions**:
   - Deleting a Checklist cascades to ChecklistSteps
   - Deleting an Execution cascades to StepExecutions
   - Deleting a StepExecution cascades to Evidence, Exceptions, and Alerts

2. **Soft Deletions**:
   - User records are never physically deleted, only marked inactive
   - Completed Executions are archived rather than deleted
   - Evidence is retained according to compliance retention policies

3. **Referential Integrity**:
   - All foreign keys are properly constrained
   - Orphaned records are prevented through database constraints

4. **Status Transitions**:
   - Execution status follows defined state machine (Pending → In Progress → Completed/Failed)
   - Exception status follows workflow (Open → In Review → Resolved → Closed)

---

## 6. Indexing Strategy

1. **Primary Indexes**:
   - All primary keys are indexed

2. **Foreign Key Indexes**:
   - All foreign keys are indexed for join performance

3. **Performance Indexes**:
   - Execution.status (for filtering active executions)
   - StepExecution.verification_result (for quality reporting)
   - Exception.status (for exception management)
   - Camera.status (for monitoring operational cameras)

4. **Search Indexes**:
   - User.username and User.email
   - Checklist.name
   - Camera.camera_name and Camera.location

---

## 7. Data Archiving

1. **Archiving Strategy**:
   - Completed executions older than 90 days are moved to archive tables
   - Evidence is archived according to retention policies
   - Reports are archived but remain accessible

2. **Archive Tables**:
   - Archive tables mirror the structure of active tables
   - Archive tables are partitioned by time period

---

*Document Version: 1.0*  
*Last Updated: June 15, 2023*  
*Prepared by: Database Architecture Team*  
*Approved by: Technical Lead*