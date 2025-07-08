# B2B Meeting Scheduler Platform

## Overview

This is a full-stack B2B meeting scheduling platform built with React, Express, and PostgreSQL. The application enables manufacturers and resellers to schedule meetings during business events, with features for meeting requests, user management, and analytics.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESNext modules
- **Session Management**: In-memory session store with bearer token authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Data Validation**: Zod schemas shared between client and server
- **Development**: Hot reloading with Vite middleware integration

## Key Components

### Database Schema
- **Users**: Stores user profiles (manufacturers, resellers, admins)
- **Events**: Business events where meetings can be scheduled
- **Meetings**: Scheduled meetings between users
- **Meeting Requests**: Pending meeting requests awaiting approval
- **Notifications**: System notifications for users

### Authentication System
- Simple session-based authentication with bearer tokens
- Role-based access (fabricante, revendedor, admin)
- In-memory session storage for development

### UI Components
- Responsive design with mobile-first approach
- Comprehensive component library using Radix UI primitives
- Dark/light theme support with CSS variables
- Mobile navigation with bottom tab bar
- Desktop sidebar navigation

### Meeting Management
- Meeting request workflow with approval system
- Real-time status updates (pending, confirmed, cancelled, completed)
- Meeting analytics and reporting
- Participant management and discovery

## Data Flow

1. **Authentication**: Users log in with email/password, receive bearer token
2. **Meeting Requests**: Users can request meetings with other participants
3. **Approval Process**: Target users can approve/reject meeting requests
4. **Meeting Scheduling**: Approved requests become scheduled meetings
5. **Analytics**: System tracks meeting statistics and outcomes

## External Dependencies

### Database
- **Neon Database**: PostgreSQL database provider
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connection**: Uses DATABASE_URL environment variable

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and better developer experience
- **ESLint/Prettier**: Code formatting and linting
- **Replit Integration**: Runtime error overlay and cartographer

## Deployment Strategy

### Development
- Run with `npm run dev` for development mode
- Vite handles hot module replacement
- Express serves API routes with automatic restart

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Single Node.js process serves both frontend and API

### Database Setup
- Use `npm run db:push` to sync schema changes
- Drizzle generates migrations in `migrations/` directory
- PostgreSQL connection via environment variable

## Changelog

```
Changelog:
- July 08, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```