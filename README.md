# Sprintify — Agile Team & Task Management

Sprintify is a full-stack project and task management application built with the MERN stack. It provides project workspaces and multiple ways to organise and review tasks, including a drag-and-drop Kanban board, list view, calendar view, and a dashboard with project/task summaries.

## Features

- **Authentication:** registration, login, JWT-based sessions, and protected routes.
- **Project workspaces:** create and manage projects.
- **Kanban workflow:** move tasks between Backlog, Todo, In Progress, Review, and Done.
- **Task details:** priority, tags, due dates, descriptions, and assignees.
- **Multiple views:** Kanban, list, and calendar.
- **Dashboard:** summary metrics and charts for task distribution and priorities.
- **Interface:** responsive Tailwind styling, theme switching, and interaction feedback.

## Technology

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS |
| UI | Lucide React, Framer Motion |
| Task interactions | @hello-pangea/dnd |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |

## Architecture

```text
React + Vite client
        |
      Axios
        |
Express REST API
        |
     Mongoose
        |
     MongoDB
```

## Repository structure

```text
.
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       └── pages/
└── server/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── server.js
```

## Run locally

### Prerequisites

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas cluster

### Backend

```bash
git clone https://github.com/padmanaban-mu/Sprintify_.git
cd Sprintify_/server
npm install
```

Create `server/.env` using `server/.env.example` as a reference:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Start the backend:

```bash
npm run dev
```

### Frontend

In a second terminal:

```bash
cd Sprintify_/client
npm install
npm run dev
```

Configure the client API base URL to point to the backend. The current project documentation notes a local API URL; use an environment-based URL before deploying to another environment.

## API overview

The Express backend separates routes and controllers for:

- Authentication and user profile
- Projects
- Tasks

The documented API includes create, read, update, and delete operations for project and task resources. See `server/routes/` for the implementation.

## Current limitations

- Collaborative changes are not synchronised through WebSockets; users may need to refresh to see changes made elsewhere.
- Task file uploads are not currently documented as implemented.
- JWT tokens are stored in browser local storage in the current implementation.
- Granular workspace roles, refresh-token rotation, password recovery, and server-side task pagination are potential improvements.

## Security and deployment

Keep MongoDB credentials and JWT secrets in environment variables. Before production use, review token storage, CORS configuration, input validation, authorisation checks on every resource, rate limiting, and deployment-specific API URLs.

## License

The repository includes an MIT license badge. Refer to the LICENSE file for the authoritative license terms.
