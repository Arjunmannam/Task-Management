# Unified Project Planning & Management Platform
## Complete Technical Documentation  •  v1.0.0

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Feature Modules](#4-feature-modules)
5. [Database Schema](#5-database-schema)
6. [REST API Reference](#6-rest-api-reference)
7. [Authentication & Security](#7-authentication--security)
8. [Frontend Structure](#8-frontend-structure)
9. [Setup & Installation](#9-setup--installation)
10. [Deployment Guide](#10-deployment-guide)

---

## 1. Project Overview

**UNIFY** is an all-in-one project workspace that eliminates tool-switching by integrating documentation, task management, file storage, diagramming, and analytics into a single cohesive platform.

### Value Proposition
| Traditional Approach | UNIFY |
|----------------------|-------|
| Notion (docs) + Trello (tasks) + Drive (files) + Figma (diagrams) | Single unified workspace |
| Context switching between 4–6 tools | One dashboard, all features |
| No shared data model | Unified project context |

### Target Users
- Students & academic teams
- Developers and small engineering teams
- Project managers
- Startup teams (up to ~50 people)

---

## 2. Architecture

```
┌──────────────────────────────────────────────┐
│              React Frontend (SPA)             │
│  Dashboard │ Kanban │ Editor │ Diagrams ...   │
└─────────────────────┬────────────────────────┘
                      │ HTTPS / REST + JWT
┌─────────────────────▼────────────────────────┐
│            Spring Boot Backend               │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │ Projects │ │    Tasks     │  │
│  │ Service  │ │ Service  │ │   Service    │  │
│  └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Notes   │ │  Files   │ │  Analytics   │  │
│  │ Service  │ │ Service  │ │   Service    │  │
│  └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────┬────────────────────────┘
                      │ JDBC / JPA
┌─────────────────────▼────────────────────────┐
│              MySQL 8.x Database              │
│  users │ projects │ tasks │ notes │ files … │
└──────────────────────────────────────────────┘
                      │ File Storage
┌─────────────────────▼────────────────────────┐
│          Local Filesystem  ./uploads/        │
│       (swap for S3 in production)            │
└──────────────────────────────────────────────┘
```

### Request Flow
1. User logs in → Spring Security validates credentials → JWT issued
2. React stores JWT in `localStorage`
3. Every API call includes `Authorization: Bearer <token>`
4. `JwtAuthenticationFilter` validates token on every request
5. Controller delegates to Service → Repository → MySQL

---

## 3. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React.js | 18+ |
| Styling | Vanilla CSS + CSS Variables | — |
| State | React hooks (useState, useContext) | — |
| Backend | Spring Boot | 3.2 |
| Language | Java | 17 |
| Security | Spring Security + JWT (JJWT) | 0.11.5 |
| ORM | Spring Data JPA / Hibernate | — |
| Database | MySQL | 8.0+ |
| Build | Maven | 3.9+ |
| Node | Node.js (frontend dev) | 18+ |

---

## 4. Feature Modules

### 4.1 User Management
- **Registration**: fullName + email + password (BCrypt hashed, rounds=12)
- **Login**: Returns signed JWT (24-hour expiry by default)
- **Profile**: View/edit name, avatar upload
- **Roles**: `ADMIN` (full access), `USER` (own projects + invited projects)
- **Route guard**: All protected routes check JWT validity in React

### 4.2 Project Management
- Create / edit / delete projects with name, description, color label
- Project dashboard shows task progress bar, member avatars
- Add/remove team members via email lookup
- Per-project sidebar navigation

### 4.3 Documentation (Rich Text Editor)
- `contentEditable` div with `document.execCommand` formatting
- Supported formats: **Bold**, *Italic*, Underline, H1/H2, Unordered/Ordered lists
- Notes list on left panel per project
- **Auto-save**: debounced 1.5s after each keystroke → PUT /notes/{id}
- Content stored as sanitized HTML in `LONGTEXT` MySQL column

### 4.4 Task Management (Kanban)
- Three columns: **To Do**, **In Progress**, **Done**
- HTML5 Drag & Drop (draggable + onDrop)
- Task fields: title, description, priority (High/Medium/Low), deadline, assignee
- Priority indicated by color-coded dot
- Delete task button (with confirmation in production)

### 4.5 File Management
- Accepts: PDF, PPTX, DOCX, XLSX, DOC
- Max file size: 50 MB (configurable)
- Files stored on disk with UUID filename; metadata in `project_files` table
- Download endpoint streams file with `Content-Disposition: attachment`
- Preview button (opens inline for PDF in production)

### 4.6 Spreadsheet / Data Tracker
- Dynamic table: add/remove rows and columns
- Editable column headers
- Cell data stored as JSON: `{ columns: string[], rows: string[][] }`
- Saved to `spreadsheets.data_json`

### 4.7 Diagram Tool
- SVG-based canvas with grid background
- Shape types: Rectangle, Diamond (decision), Circle, Arrow
- Drag shapes by mouse
- Shapes stored as JSON array in `diagrams.shapes_json`
- Unsaved changes indicator + save button

### 4.8 Analytics Dashboard
- Summary stats: total projects, tasks by status, completion rate
- Bar chart: tasks per project
- Progress bars: completion by project
- Priority distribution breakdown

---

## 5. Database Schema

### Entity Relationship Summary
```
users ──< project_members >── projects
projects ──< tasks
projects ──< notes
projects ──< project_files
projects ──< spreadsheets
projects ──< diagrams
tasks ──< task_comments
users ──< activity_log
```

### Key Tables

**users** – Authentication & profile
- `id`, `full_name`, `email` (UNIQUE), `password_hash`, `role`, `created_at`

**projects** – Top-level workspaces
- `id`, `name`, `description`, `color`, `owner_id` (FK→users)

**project_members** – Many-to-many join
- `project_id`, `user_id`, `joined_at`

**tasks** – Kanban items
- `id`, `title`, `description`, `status` (ENUM), `priority` (ENUM), `project_id`, `assignee_id`, `deadline`

**notes** – Rich text documents
- `id`, `title`, `content` (LONGTEXT), `project_id`, `author_id`, `updated_at`

**project_files** – File metadata
- `id`, `original_name`, `stored_name` (UUID on disk), `file_type`, `file_size`, `project_id`

**spreadsheets** – Table data
- `id`, `name`, `data_json` (LONGTEXT), `project_id`

**diagrams** – Visual diagrams
- `id`, `name`, `shapes_json` (LONGTEXT), `project_id`

**activity_log** – Audit trail
- `id`, `user_id`, `project_id`, `action`, `entity_id`, `metadata` (JSON), `created_at`

---

## 6. REST API Reference

All endpoints require `Authorization: Bearer <token>` except `/api/auth/*`.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET  | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects` | List user's projects |
| POST   | `/api/projects` | Create project |
| GET    | `/api/projects/{id}` | Get project detail |
| PUT    | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |
| POST   | `/api/projects/{id}/members` | Add member |
| DELETE | `/api/projects/{id}/members/{userId}` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects/{pid}/tasks` | List tasks |
| POST   | `/api/projects/{pid}/tasks` | Create task |
| PUT    | `/api/projects/{pid}/tasks/{id}` | Update task |
| PATCH  | `/api/projects/{pid}/tasks/{id}/status` | Update status (drag & drop) |
| DELETE | `/api/projects/{pid}/tasks/{id}` | Delete task |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects/{pid}/notes` | List notes |
| POST   | `/api/projects/{pid}/notes` | Create note |
| PUT    | `/api/projects/{pid}/notes/{id}` | Save note (autosave) |
| DELETE | `/api/projects/{pid}/notes/{id}` | Delete note |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects/{pid}/files` | List files |
| POST   | `/api/projects/{pid}/files` | Upload file (multipart) |
| GET    | `/api/projects/{pid}/files/{id}/download` | Download file |
| DELETE | `/api/projects/{pid}/files/{id}` | Delete file |

### Spreadsheets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects/{pid}/spreadsheets` | List |
| POST   | `/api/projects/{pid}/spreadsheets` | Create |
| PUT    | `/api/projects/{pid}/spreadsheets/{id}` | Save data |
| DELETE | `/api/projects/{pid}/spreadsheets/{id}` | Delete |

### Diagrams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects/{pid}/diagrams` | List |
| POST   | `/api/projects/{pid}/diagrams` | Create |
| PUT    | `/api/projects/{pid}/diagrams/{id}` | Save shapes |
| DELETE | `/api/projects/{pid}/diagrams/{id}` | Delete |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/analytics/summary` | Global summary for current user |
| GET    | `/api/analytics/projects/{id}` | Per-project stats |

---

## 7. Authentication & Security

### JWT Flow
```
Client                    Server
  │── POST /auth/login ──►│
  │                       │ Validate credentials
  │                       │ Sign JWT (HS256, 24h)
  │◄── { token } ─────────│
  │
  │── GET /api/projects ──►│ (Authorization: Bearer <token>)
  │                        │ JwtAuthenticationFilter validates
  │                        │ Sets SecurityContext
  │◄── [ projects ] ───────│
```

### Security Configuration (Spring Security)
- `BCryptPasswordEncoder` with strength 12
- `JwtAuthenticationFilter` extends `OncePerRequestFilter`
- Stateless session (`SessionCreationPolicy.STATELESS`)
- Public endpoints: `/api/auth/**`, `/api/health`
- All others: authenticated

### CORS
- Allowed origins: `http://localhost:3000` (dev), configure for production domain
- Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allowed headers: Authorization, Content-Type

---

## 8. Frontend Structure

```
src/
├── App.jsx                  # Root component, routing, auth context
├── components/
│   ├── auth/
│   │   └── LoginPage.jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── projects/
│   │   ├── ProjectsPage.jsx
│   │   └── ProjectDetail.jsx
│   ├── tasks/
│   │   └── KanbanBoard.jsx
│   ├── notes/
│   │   └── NotesModule.jsx
│   ├── files/
│   │   └── FileManager.jsx
│   ├── spreadsheet/
│   │   └── SpreadsheetModule.jsx
│   ├── diagram/
│   │   └── DiagramTool.jsx
│   └── analytics/
│       └── Analytics.jsx
├── services/
│   ├── api.js               # Axios instance with JWT interceptor
│   ├── authService.js
│   ├── projectService.js
│   └── taskService.js
├── context/
│   └── AuthContext.jsx
└── styles/
    └── global.css
```

### State Management
- `AuthContext` — global user state
- Local `useState` per component for UI state
- API calls via Axios service layer
- No Redux needed at this scale

---

## 9. Setup & Installation

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8.0+

### Backend Setup
```bash
# 1. Create database
mysql -u root -p < backend/schema.sql

# 2. Update credentials in application.properties
# spring.datasource.password=yourpassword

# 3. Build and run
cd backend
mvn clean install
mvn spring-boot:run

# API runs on http://localhost:8080
```

### Frontend Setup
```bash
cd frontend
npm install
npm start

# App runs on http://localhost:3000
```

### Environment Variables (Production)
```properties
# Backend
JWT_SECRET=your-256-bit-secret-key
DB_URL=jdbc:mysql://prod-host:3306/unify_db
DB_USERNAME=unify_user
DB_PASSWORD=secure_password
FILE_UPLOAD_DIR=/var/app/uploads

# Frontend (.env)
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

---

## 10. Deployment Guide

### Docker (Recommended)
```dockerfile
# Backend Dockerfile
FROM eclipse-temurin:17-jre-alpine
COPY target/unify-platform-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: unify_db
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports: ["8080:8080"]
    depends_on: [mysql]
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/unify_db
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}

  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [backend]

volumes:
  mysql_data:
```

### Production Checklist
- [ ] Change `jwt.secret` to a 256-bit random value
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`)
- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure CORS for production domain only
- [ ] Switch file storage to AWS S3 or similar
- [ ] Set up database backups
- [ ] Add rate limiting (Spring Cloud Gateway or Nginx)
- [ ] Configure logging (Logback → CloudWatch/ELK)

---

## Appendix: API Request/Response Examples

### Register
```json
POST /api/auth/register
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}

Response 201:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": 3, "fullName": "Jane Doe", "email": "jane@example.com", "role": "USER" }
}
```

### Create Task
```json
POST /api/projects/1/tasks
Authorization: Bearer <token>
{
  "title": "Implement login page",
  "description": "JWT-based auth flow",
  "priority": "HIGH",
  "deadline": "2025-05-01T00:00:00",
  "assigneeId": 2
}

Response 201:
{
  "id": 7,
  "title": "Implement login page",
  "status": "TODO",
  "priority": "HIGH",
  "deadline": "2025-05-01T00:00:00",
  "assignee": { "id": 2, "fullName": "Sara Kim" },
  "createdAt": "2025-03-18T10:30:00"
}
```

### Update Task Status (Drag & Drop)
```json
PATCH /api/projects/1/tasks/7/status
{ "status": "IN_PROGRESS" }

Response 200:
{ "id": 7, "status": "IN_PROGRESS", "updatedAt": "2025-03-18T11:00:00" }
```
