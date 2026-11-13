# Sprintify

Sprintify is a MERN task and project management application. It lets a user organise work into projects and track tasks through a Kanban board, list view, or calendar view.

## What it includes

- User registration and login with JWT authentication.
- Project creation and project-specific task boards.
- Drag-and-drop task movement across workflow columns.
- Task priorities, tags, due dates, descriptions, and assignees.
- List and calendar views alongside the Kanban board.
- A dashboard with project and task summaries.
- Light and dark theme options.

## How it is put together

The React client communicates with an Express REST API. The API uses Mongoose to read and update project, task, and user records in MongoDB.

```text
React + Vite
    |
   Axios
    |
Express API
    |
 Mongoose
    |
 MongoDB
```

## Stack

**Client:** React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React, Framer Motion, Recharts, and `@hello-pangea/dnd`.

**Server:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, and dotenv.

## Folder layout

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
    ├── .env.example
    └── server.js
```

## Start locally

You need Node.js 18+, npm, and a MongoDB instance or Atlas cluster.

### 1. Get the code

```bash
git clone https://github.com/padmanaban-mu/Sprintify_.git
cd Sprintify_
```

### 2. Start the backend

```bash
cd server
npm install
```

Create `server/.env` using `.env.example` as a guide. The local configuration uses values in this form:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sprintify
JWT_SECRET=replace_with_a_long_random_secret
```

Then run:

```bash
npm run dev
```

### 3. Start the client

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally [http://localhost:5173](http://localhost:5173)). Make sure the client API URL points to the backend at port 5000.

## API areas

The Express server groups its routes around:

- Authentication and user profiles
- Projects
- Tasks

The route and controller implementations are in `server/routes/` and `server/controllers/`.

## Current constraints

- The app does not use WebSockets for live board synchronisation; another user's changes may require a refresh.
- JWTs are stored in browser local storage in the current implementation.
- The client API URL is configured for local development and needs an environment-specific value for deployment.
- File attachments, password recovery, refresh-token rotation, and more granular workspace roles are not currently included.

Before deploying, review access checks for every project and task, token storage, CORS settings, input validation, rate limiting, and environment-specific URLs. Keep MongoDB credentials and JWT secrets out of Git.

## License

See [LICENSE](LICENSE) for the repository's license terms.
