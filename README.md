# Student Collaboration Platform
# Deployed with CI/CD
A SaaS web application for academic project management, built with Django and React. Students and supervisors can create workspaces, manage members with roles, and organize tasks using Kanban boards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django + Django REST Framework |
| Auth | JWT (SimpleJWT) |
| Database | PostgreSQL |
| Frontend | React + Vite + Tailwind CSS |
| Drag & Drop | @dnd-kit |
| Containerization | Docker + Docker Compose |

---

## Features

- User registration and login with JWT authentication
- Create and manage workspaces
- Invite members to workspaces by email
- Role-based access: **Admin** (full control) and **Member** (view and use)
- Create Kanban boards inside workspaces
- Add columns and tasks to boards
- Drag and drop tasks between columns

---

## Project Structure

```
student-collab-platform/
│
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/
│   │   ├── workspaces/
│   │   └── boards/
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── .env
└── README.md
```

---

## Requirements

You only need these installed on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) (recommended)

No need to install Python, Node, or PostgreSQL locally — Docker handles everything.

---

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/your-username/student-collab-platform.git
cd student-collab-platform
```

**2. Create the environment file**

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
DEBUG=True
SECRET_KEY=your-secret-key-change-this
DATABASE_URL=postgres://postgres:postgres@db:5432/collab_db
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**3. Build and start the containers**

```bash
docker compose up --build
```

**4. Run database migrations**

```bash
docker compose exec backend python manage.py migrate
```

**5. Create an admin account**

```bash
docker compose exec backend python manage.py createsuperuser
```

**6. Open the app**

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Django Admin | http://localhost:8000/admin |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login/` | Login, returns JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| POST | `/api/users/register/` | Register new user |
| GET | `/api/users/me/` | Get current user info |

### Workspaces
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workspaces/` | List my workspaces |
| POST | `/api/workspaces/` | Create workspace |
| GET | `/api/workspaces/:id/` | Get workspace detail |
| PUT | `/api/workspaces/:id/` | Update workspace (admin only) |
| DELETE | `/api/workspaces/:id/` | Delete workspace (admin only) |
| POST | `/api/workspaces/:id/invite/` | Invite member by email |
| DELETE | `/api/workspaces/:id/members/:userId/` | Remove member |

### Boards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/boards/workspace/:id/` | List boards in workspace |
| POST | `/api/boards/workspace/:id/` | Create board |
| GET | `/api/boards/:id/` | Get board with columns and tasks |
| POST | `/api/boards/:id/columns/` | Add column to board |
| POST | `/api/boards/columns/:id/tasks/` | Add task to column |
| PATCH | `/api/boards/tasks/:id/move/` | Move task to another column |
| DELETE | `/api/boards/tasks/:id/` | Delete task |

---

## User Roles

| Action | Admin | Member |
|---|---|---|
| View workspace | ✅ | ✅ |
| Create boards | ✅ | ✅ |
| Add tasks | ✅ | ✅ |
| Invite members | ✅ | ❌ |
| Remove members | ✅ | ❌ |
| Edit workspace | ✅ | ❌ |
| Delete workspace | ✅ | ❌ |

---

## Common Commands

```bash
# Start all containers
docker compose up

# Start in background
docker compose up -d

# Stop all containers
docker compose down

# Run migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser

# View backend logs
docker compose logs backend

# View all logs
docker compose logs

# Rebuild after code changes
docker compose up --build
```

---

## Development Notes

- The backend runs on port **8000** and the frontend on port **5173**
- JWT access tokens expire after **1 day**, refresh tokens after **7 days**
- Only workspace **admins** can invite or remove members
- Any workspace member can create boards, columns, and tasks

---

## License

This project is for academic purposes only.
