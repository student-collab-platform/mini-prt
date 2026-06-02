# CollabBoard

A modern collaborative workspace and task management platform built with **React**, **Django REST Framework**, **PostgreSQL**, and **Docker**.

CollabBoard helps teams organize projects through workspaces, boards, columns, and draggable tasks with a clean modern UI inspired by tools like **Linear**, **Notion**, and **Trello**.

---

# ✨ Features

## Authentication
- User registration & login
- Secure token authentication
- Persistent user sessions
- Profile management

## Workspaces
- Create collaborative workspaces
- Invite and manage members
- Role-based workspace access
- Workspace overview dashboard

## Boards & Columns
- Create multiple boards inside workspaces
- Organize tasks using Kanban columns
- Drag & drop task management
- Smooth board interactions

## Tasks
- Create, edit, and delete tasks
- Priority system:
  - Low
  - Medium
  - High
- Due dates
- Task assignments
- Labels & categories
- Comments system
- Task completion tracking

## Dashboard
- Productivity overview
- Task statistics
- Overdue tasks tracking
- Upcoming deadlines
- High-priority task section
- Workspace summaries

## Modern UI/UX
The frontend has been redesigned with:
- Tailwind CSS
- Modern SaaS-style layout
- Responsive design
- Smooth transitions
- Glassmorphism navbar
- Interactive task cards
- Improved spacing & hierarchy
- Better mobile responsiveness

---

# 🛠 Tech Stack

## Frontend
- React
- React Router
- Tailwind CSS
- DnD Kit
- Axios
- React Hot Toast

## Backend
- Django
- Django REST Framework
- JWT Authentication

## Database
- PostgreSQL

## DevOps / Tooling
- Docker
- Docker Compose
- Git & GitHub

---

# 📁 Project Structure

```bash
collabboard/
│
├── backend/
│   ├── boards/
│   ├── users/
│   ├── workspaces/
│   ├── config/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   │
│   ├── public/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone <repo-url>
cd collabboard
```

## 2. Checkout UI Branch

```bash
git checkout feature/profile-and-ui
```

## 3. Start Docker Containers

```bash
docker compose up --build
```

## 4. Open Application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

---

# ⚙️ Environment Variables

Example backend `.env`:

```env
DEBUG=True

POSTGRES_DB=collabboard
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

SECRET_KEY=your-secret-key
```

---

# 📦 Docker Commands

## Start Containers

```bash
docker compose up
```

## Rebuild Containers

```bash
docker compose up --build
```

## Stop Containers

```bash
docker compose down
```

## Remove Volumes

```bash
docker compose down -v
```

---

# 🎨 UI Design Philosophy

The redesigned frontend focuses on:

- cleaner spacing
- softer visual hierarchy
- modern productivity-app aesthetics
- responsive interactions
- premium SaaS feeling
- human-centered interface design

Inspired by:
- Linear
- Notion
- Vercel
- Trello
- ClickUp

---

# 🔥 Current Strengths

- Modern full-stack architecture
- Dockerized development environment
- Interactive drag-and-drop system
- Responsive UI
- Real-world SaaS structure
- Modular backend organization
- Strong portfolio value

---

# ⚠️ Future Improvements

## Backend
- Optimize nested API requests
- Add aggregated dashboard endpoints
- Improve caching strategy

## Frontend
- Add skeleton loaders
- Add dark mode
- Improve accessibility
- Add optimistic UI updates

## Real-Time Features
- WebSocket integration
- Live collaboration
- Real-time task synchronization
- Notifications system

---

# 👨‍💻 Development Notes

This project demonstrates:
- React state management
- REST API integration
- Dockerized workflows
- PostgreSQL integration
- Authentication systems
- Kanban architecture
- Modern frontend UI engineering

---

# 📄 License

This project is for educational and portfolio purposes.