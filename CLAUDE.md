# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Chat Language
You should chat in Japanese with the all users of this project. 

## Project Overview

This is a presentation management system with three main components:
- **Backend**: Go REST API using Gin framework with MySQL database
- **UI**: Next.js React frontend with Chakra UI
- **Meeting Bot**: TypeScript Node.js bot for Google Meet automation and recording

## Development Commands

### Backend (Go)
```bash
# Run from /backend directory
go run cmd/app/main.go          # Start backend server on port 8080
go mod tidy                     # Clean up dependencies
```

### UI (Next.js)
```bash
# Run from /ui directory
npm run dev                     # Start development server with Turbopack
npm run build                   # Build for production
npm run start                   # Start production server
npm run lint                    # Run ESLint
```

### Meeting Bot (TypeScript)
```bash
# Run from /meeting_bot directory
npm run dev                     # Run bot with ts-node
npm run build                   # Compile TypeScript
npm run test                    # Run Playwright tests
```

### Docker Development
```bash
# From project root
docker-compose up               # Start all services (MySQL, Backend, UI, Keycloak)
docker-compose down             # Stop all services
```

## Architecture

### Backend Structure
- **Clean Architecture**: Domain → Service → Repository → Handler layers
- **Domain Models**: `presentation.go`, `team.go`, `user.go` define core entities
- **JWT Authentication**: Middleware in `internal/middleware/auth/jwt.go`
- **MySQL Repository**: All database operations in `internal/repository/mysql/`
- **API Routes**: RESTful endpoints for users, presentations, teams at `/api/v1`

### Frontend Structure
- **Feature-based organization**: Each feature has components, hooks, and types
- **Zustand**: State management (see `src/store/user-store.ts`)
- **API Client**: Centralized in `src/lib/api/api-client.ts`
- **Chakra UI**: Component library with custom theme
- **Authentication**: JWT token handling in API requests

### Meeting Bot
- **Playwright**: Browser automation for Google Meet
- **Screen Recording**: Uses Chrome DevTools Protocol (CDP) for screen capture
- **Audio Recording**: Web Audio API for meeting audio
- **FFmpeg**: Video processing and encoding

## Key Domain Concepts

### Presentation Status Flow
```
Unassigned → Assigned → ContentInputted → Completed
```

### Data Models
- **Presentation**: Core entity with team assignment and status tracking
- **PresentationRaw**: Internal representation for database operations
- **User**: Team member with role-based access
- **Team**: Organizational unit for grouping presentations

## Git Commit Guidelines

Follow Angular convention with prefixes:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting
- `refactor:` Code restructuring
- `perf:` Performance improvements
- `test:` Testing changes
- `chore:` Build/tooling changes

Format: `prefix: message` with bullet points for details. Always use English.

## Environment Setup

1. Copy `.env.example` to `.env` and configure database and Keycloak credentials
2. Initialize MySQL database using `docker/mysql/init.sql`
3. Backend connects to MySQL on port 3306
4. Frontend connects to backend API on port 8080
5. Keycloak runs on port 8090 in development mode
6. Meeting bot requires Google Meet URL configuration

### Keycloak Configuration
- Access Keycloak admin console at http://localhost:8090
- Default admin credentials: admin/admin (configurable via environment variables)
- Development mode with H2 database and persistent storage
- Configure realms and clients through the admin interface

## Database Schema

Tables: `users`, `teams`, `presentations` with foreign key relationships. See `docker/mysql/init.sql` for schema.