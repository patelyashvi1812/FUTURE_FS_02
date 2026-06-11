# Client Lead Management System (CRM) - Setup Guide

This guide provides step-by-step instructions to rebuild and run the **Client Lead Management System** from scratch. 

The application is structured into two main components:
1. **Backend**: Node.js & Express REST API with MongoDB (Mongoose).
2. **Frontend**: React Single Page Application (SPA) built using Vite and custom CSS.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Project Architecture](#-project-architecture)
3. [All Dependencies Used](#-all-dependencies-used)
4. [Step-by-Step Implementation](#-step-by-step-implementation)
   - [Step 1: Root Folder Initialization](#step-1-root-folder-initialization)
   - [Step 2: Backend REST API Setup](#step-2-backend-rest-api-setup)
   - [Step 3: Frontend React App Setup](#step-3-frontend-react-app-setup)
5. [Environment Variables Configuration](#-environment-variables-configuration)
6. [How to Run the Application](#-how-to-run-the-application)
7. [Getting Started (First-Time Registration)](#-getting-started-first-time-registration)

---

## 🛠 Prerequisites
Ensure the following tools are installed on your machine:
* **Node.js** (v18.x or later)
* **npm** (v9.x or later)
* **MongoDB** (Local Community Edition running on port `27017` or a MongoDB Atlas URI)

---

## 📁 Project Architecture
```text
Client Lead Management System/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Lead.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── leads.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── LeadDetails.jsx
    │   │   ├── Login.jsx
    │   │   └── WebhookDocs.jsx
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 📦 All Dependencies Used

### Backend Dependencies
These are configured in [backend/package.json](file:///Users/mitulaghara/Desktop/Internship/Client%20Lead%20Management%20System/backend/package.json):

*To install all backend dependencies at once, run:*
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

| Package Name | Version | Purpose | Installation Command |
| :--- | :--- | :--- | :--- |
| **`express`** | `^4.19.2` | Fast, lightweight server framework for routing. | `npm install express` |
| **`mongoose`** | `^8.3.1` | MongoDB ODM to define schema types and query database models. | `npm install mongoose` |
| **`cors`** | `^2.8.5` | Cross-Origin Resource Sharing middleware for safe frontend interaction. | `npm install cors` |
| **`dotenv`** | `^16.4.5` | Loads environment configuration keys from `.env` file. | `npm install dotenv` |
| **`bcryptjs`** | `^2.4.3` | Secures passwords using secure salts and hashing. | `npm install bcryptjs` |
| **`jsonwebtoken`** | `^9.0.2` | Implements authentication tokens for protected CRM operations. | `npm install jsonwebtoken` |

### Frontend Dependencies
These are configured in [frontend/package.json](file:///Users/mitulaghara/Desktop/Internship/Client%20Lead%20Management%20System/frontend/package.json):

*To install frontend dependencies (after initializing the React template), run:*
```bash
npm install react-icons
```
*(Note: `react` and `react-dom` are automatically installed by the Vite project template. If not, run `npm install react react-dom`)*

| Package Name | Version | Purpose | Installation Command |
| :--- | :--- | :--- | :--- |
| **`react`** | `^19.2.6` | Frontend library for building UI components. | `npm install react` |
| **`react-dom`** | `^19.2.6` | Renders components to the HTML DOM. | `npm install react-dom` |
| **`react-icons`** | `^5.6.0` | Comprehensive icon library (Feather, FontAwesome, etc.). | `npm install react-icons` |
| **`vite`** (Dev) | `^8.0.12` | High-performance bundling and local dev server setup. | `npm install vite --save-dev` |


---

## 🚀 Step-by-Step Implementation

### Step 1: Root Folder Initialization
Open your terminal and run the following commands to initialize the main repository container:

```bash
# 1. Create a root workspace directory and navigate into it
mkdir "Client Lead Management System"
cd "Client Lead Management System"

# 2. Initialize a local Git repository (optional)
git init

# 3. Create a .gitignore to keep build nodes out of source control
cat <<EOT >> .gitignore
node_modules/
.env
dist/
.DS_Store
EOT
```

---

### Step 2: Backend REST API Setup
Navigate into the backend project space, install packages, and structure files:

```bash
# 1. Create and navigate to the backend folder
mkdir backend
cd backend

# 2. Initialize a package.json file with defaults
npm init -y
```

Now open [backend/package.json](file:///Users/mitulaghara/Desktop/Internship/Client%20Lead%20Management%20System/backend/package.json) and configure scripts. It should look like this:
```json
{
  "name": "crm-backend",
  "version": "1.0.0",
  "description": "Backend API for Client Lead Management System CRM",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

Now install dependencies and generate your file tree:
```bash
# 3. Install required node packages
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# 4. Create source directories
mkdir middleware models routes
```

Then create the backend files:
* **`server.js`**: Mounts express middleware (`cors`, `express.json`), connects to MongoDB via `mongoose.connect()`, and registers routes.
* **`middleware/auth.js`**: Custom middleware checking standard `Authorization: Bearer <token>` token format.
* **`models/User.js`**: Mongoose schema verifying email patterns, names, and using a `pre('save')` hook for hashing passwords.
* **`models/Lead.js`**: Mongoose model detailing client contact info, sources, dynamic logs (`notes` sub-documents), and interactive schedules (`followUps` sub-documents).
* **`routes/auth.js`**: Connects `/api/auth/setup-admin` (first time creation), `/api/auth/login`, and `/api/auth/me`.
* **`routes/leads.js`**: Main Lead controller. Exposes `POST /api/leads` (public endpoint to receive external webhooks) and several protected routes (`GET /api/leads`, `POST /api/leads/manual`, `PATCH /api/leads/:id/status`, etc.).

Once backend creation is finished, return to the workspace root:
```bash
cd ..
```

---

### Step 3: Frontend React App Setup
Create and build your React client:

```bash
# 1. Create a React app with Vite inside the 'frontend' folder
npx -y create-vite@latest frontend --template react

# 2. Enter the frontend workspace
cd frontend

# 3. Install packages and components icons
npm install react-icons
npm install
```

Now build the components structure:
```bash
# 4. Create directory structure for dashboard elements
mkdir -p src/components
```

Create the following files in the frontend structure:
* **`index.html`**: Entry HTML shell containing browser configurations.
* **`src/index.css`**: Complete style sheet including colors, layout grids, modal draws, tables, and glassmorphic layouts.
* **`src/main.jsx`**: Core react setup that boots up the client app container.
* **`src/App.jsx`**: Manages current authorization tokens in `localStorage` and routes the active screen to either `Login`, `Dashboard`, or `WebhookDocs` views.
* **`src/components/Login.jsx`**: Form validating Login inputs and toggleable administrator setup.
* **`src/components/Dashboard.jsx`**: Displays overall lead statistics, search panels, filters, manual intake drawers, and interactive data lists.
* **`src/components/LeadDetails.jsx`**: Contextual panel showing timeline logs, adding client notes, and scheduling tasks.
* **`src/components/WebhookDocs.jsx`**: Full documentation page showing code snippets to hook any website form up to the CRM via cURL and JavaScript.

Once done, return to the project root:
```bash
cd ..
```

---

## ⚙ Environment Variables Configuration

Both the frontend and backend require setup configurations to talk to each other properly.

### Backend `.env` Setup
Create a file named `.env` in the `backend/` directory:
```ini
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/lead-crm
JWT_SECRET=your_super_secret_jwt_sign_key
# Optional API Key for securing external webhook captures.
# If empty, webhook is open. If set, X-CRM-API-KEY header is required.
WEBHOOK_API_KEY=crm-wh-a7f3e9d2b1c84056f0e7a2d9b3c1f8e4
```

### Frontend `.env` Setup
Create a file named `.env` in the `frontend/` directory:
```ini
VITE_API_URL=http://localhost:5050
```

---

## 🏃 How to Run the Application

Follow these steps to spin up the local environment:

### 1. Run the Database
Ensure MongoDB service is actively running on your machine.
* **Mac**: `brew services start mongodb-community`
* **Windows**: Run `mongod` or verify MongoDB service is active.

### 2. Run the Backend API Server
Open a terminal instance at the project root and type:
```bash
cd backend
npm run dev
```
The server will boot up and start listening for API calls on `http://localhost:5050`.

### 3. Run the React Client Dev Server
Open a separate terminal instance at the project root and type:
```bash
cd frontend
npm run dev
```
This starts Vite's server (usually pointing to `http://localhost:5173`).

---

## 🔑 Getting Started (First-Time Registration)

When running the project for the first time, your database will be empty:
1. Open your browser and head to the client URL: `http://localhost:5173`.
2. On the Login screen, click on the **"First time running the app? Setup Admin"** button at the bottom.
3. Fill in your Name, Email, and Password and click **Initialize Admin**. This will register the first admin.
4. You will now be redirected back to sign in. Enter your credentials to access the dashboard!
5. To test webhooks, click the **Webhook API** button at the top header, copy the API key, and try running the provided cURL command in your terminal.
