# ⚡ Sprintify — Agile Team & Task Management Hub

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Sprintify** is a modern, full-stack agile project and task management web application built on the **MERN (MongoDB, Express, React, Node.js)** stack. It empowers teams and individual developers to plan sprints, track deliverables, organize workflows with drag-and-drop Kanban boards, inspect schedules via calendar and list views, and monitor progress using real-time analytics.

---

## 🚀 Features

- **🔐 Authentication & User Accounts**
  - Secure user registration and login with encrypted passwords (`bcryptjs`).
  - Stateless authentication using JSON Web Tokens (`JWT`).
  - User profile customization and password management.
  - Protected routes and persistent session state.

- **📁 Project Workspaces**
  - Create and manage distinct project boards with unique descriptions and ownership.
  - Member assignment and multi-user collaboration readiness.

- **📋 Versatile Task Views**
  - **Kanban Board**: Drag-and-drop workflow across columns (`Backlog`, `Todo`, `Inprogress`, `Review`, `Done`) powered by `@hello-pangea/dnd`.
  - **List View**: Detailed, clean tabular overview for rapid status inspection.
  - **Calendar View**: Deadline and schedule timeline tracking.

- **🏷️ Task Customization & Rich Details**
  - Priority levels (`Low`, `Medium`, `High`) with visual status indicators.
  - Tags and categories (`Frontend`, `Backend`, `Bug`, `UI/UX`, `General`).
  - Markdown-rendered task descriptions (`react-markdown` + `remark-gfm`).
  - Due date tracking, assignee attribution, and inline task updates.

- **📊 Analytics & Insights Dashboard**
  - Summary metrics: total projects, active tasks, completion rate, and overdue tracking.
  - Visual charts rendered with `Recharts` (task distribution, priority breakdown).

- **🎨 Modern UI & UX**
  - Fast, responsive design crafted with **Tailwind CSS**.
  - Fluid micro-interactions and transitions with **Framer Motion**.
  - Dark mode and light mode theme switcher with persistent preference.
  - Instant user feedback via `react-hot-toast`.

---

## 📂 Project Structure

```text
Sprintify/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI components (CalendarView, ListView, etc.)
│   │   ├── context/            # AuthContext, ThemeContext state providers
│   │   ├── layouts/            # MainLayout (Sidebar, Navbar, Theme toggles)
│   │   ├── pages/              # Dashboard, ProjectBoard, Projects, Login, Register, Settings
│   │   ├── App.jsx             # Route definitions & layout wrappers
│   │   ├── main.jsx            # React root DOM entrypoint
│   │   └── index.css           # Global Tailwind CSS directives
│   ├── index.html              # HTML entrypoint
│   ├── package.json            # Client dependencies & scripts
│   ├── tailwind.config.js      # Tailwind configuration
│   └── vite.config.js          # Vite build configuration
│
├── server/                     # Backend API (Node.js + Express + Mongoose)
│   ├── controllers/            # Route controllers (authController, projectController, taskController)
│   ├── middleware/             # JWT authentication protection middleware
│   ├── models/                 # Mongoose schemas (User, Project, Task)
│   ├── routes/                 # Express API routes (authRoutes, projectRoutes, taskRoutes)
│   ├── .env.example            # Environment variable template (safe for Git)
│   ├── package.json            # Server dependencies & scripts
│   └── server.js               # Server entrypoint and MongoDB connection
│
├── .gitignore                  # Git exclusions (node_modules, .env, build output)
└── README.md                   # Project documentation
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Security & Auth**: [JSON Web Tokens (JWT)](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **CORS Handling**: `cors`
- **Environment Management**: `dotenv`

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** instance (either a local MongoDB service or a cloud [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Sprintify.git
cd Sprintify
```

---

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt: `copy .env.example .env`)*

4. Open `server/.env` and supply your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/sprintify
   JWT_SECRET=your_super_secret_jwt_key
   ```
   > 💡 *If using MongoDB Atlas, replace `MONGO_URI` with your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/sprintify`).*

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend should start at `http://localhost:5000`.

---

### 3. Frontend Setup
1. Open a **new terminal window** and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Authentication (`/auth`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `POST` | `/auth/register` | Register new user account | No |
| `POST` | `/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/auth/me` | Fetch authenticated user data | Yes |
| `GET` | `/auth/users` | Search registered users by keyword | Yes |
| `PUT` | `/auth/profile` | Update profile information | Yes |
| `PUT` | `/auth/password` | Update account password | Yes |

### Projects (`/projects`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `GET` | `/projects` | List all projects owned by user | Yes |
| `POST` | `/projects` | Create a new project | Yes |
| `GET` | `/projects/:id` | Get project details by ID | Yes |
| `PUT` | `/projects/:id` | Update project name / description | Yes |
| `DELETE` | `/projects/:id` | Delete a project & its associated tasks | Yes |

### Tasks (`/tasks`)
| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `GET` | `/tasks` | List tasks (query by `project` ID) | Yes |
| `POST` | `/tasks` | Create task (`title`, `status`, `priority`, `tag`, `dueDate`, `assignee`) | Yes |
| `PUT` | `/tasks/:id` | Update task details or change column status | Yes |
| `DELETE` | `/tasks/:id` | Delete a task | Yes |

---

## ⚠️ Current Project Limitations & Known Constraints

As Sprintify is in active development, please note the following technical and architectural constraints:

1. **No Real-Time Sockets (WebSockets)**
   - Collaborative updates currently require a manual page reload or UI action. Real-time synchronization (e.g., using `Socket.io` when another teammate moves a card) is not yet implemented.

2. **File & Media Attachments**
   - Tasks support markdown text descriptions and links, but direct image uploads, file dropzones, and cloud storage integrations (e.g., AWS S3 or Cloudinary) are not currently supported.

3. **Client API URL Configuration**
   - API endpoints in the client currently point to `http://localhost:5000`. Deploying to production environments requires configuring a dynamic base URL (such as via a Vite environment variable `VITE_API_URL`).

4. **Session Management & Refresh Tokens**
   - JWT tokens are stored in browser `localStorage`. Refresh token rotation and HTTP-only cookie storage are not yet configured.

5. **Granular Role-Based Access Control (RBAC)**
   - Projects currently have basic owner permissions. Custom team roles (such as Admin, Contributor, Read-Only Viewer) and workspace-level permission controls are not yet present.

6. **Pagination on Task Boards**
   - All tasks for a project are fetched in a single request. For projects containing thousands of tasks, server-side pagination or virtualized list scrolling will be beneficial.

7. **Password Recovery Flow**
   - There is currently no automated "Forgot Password" or email verification system (SMTP / SendGrid integration).

---

## 🗺️ Roadmap & Future Enhancements

- [ ] Real-time board synchronization using `Socket.io`
- [ ] Configurable Vite environment variables (`VITE_API_BASE_URL`) for production deployment
- [ ] File attachments and drag-and-drop screenshots (Cloudinary / AWS S3)
- [ ] Refresh token rotation with secure `HttpOnly` cookies
- [ ] Role-based team access control (Admin / Member / Viewer)
- [ ] Email notifications for task assignments and upcoming deadlines
- [ ] Export board data to CSV / JSON / PDF report

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
