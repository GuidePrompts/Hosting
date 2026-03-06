# NexusDeploy

A modern cloud platform for developers to deploy bots and backend services instantly.

## Features

- Deploy Telegram bots, Discord bots, and Flask APIs
- One-click deployment from ZIP or Python files
- Real-time logs and resource monitoring
- Isolated Docker containers for each project
- JWT authentication
- Dark/light mode UI

## Tech Stack

- Backend: FastAPI, PostgreSQL, Redis, Docker
- Frontend: Next.js, Tailwind CSS, Socket.IO

## Getting Started

1. Clone this repository.
2. Copy `backend/.env.example` to `backend/.env` and set your JWT secret.
3. Copy `frontend/.env.local.example` to `frontend/.env.local` (adjust if needed).
4. Run `docker-compose up --build`
5. Access the frontend at http://localhost:3000
6. API docs at http://localhost:8000/docs

## Usage

- Register an account
- Go to Deploy Service, fill in the details and upload your code
- View and manage your projects in the dashboard
- Stream logs in real-time

## Notes

This is a simplified demonstration. For production use, add:
- Background workers (Celery) for async deployment
- Proper image building instead of volume mounts
- Enhanced security (file scanning, network isolation)
- Custom domains and SSL
- Billing and team features
