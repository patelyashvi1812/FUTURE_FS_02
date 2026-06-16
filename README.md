# LeadFlow CRM — Client Lead Management System

A full-stack, modern CRM application designed to capture, track, and convert website leads. Built with **React (Vite)**, **Node.js + Express**, and **MongoDB**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Admin Login** | Secure JWT-based authentication for administrative access |
| 📋 **Lead Management** | View all leads with details like Name, Email, Source, and Status |
| 🔄 **Status Pipeline** | Progress leads through statuses: `New` ➔ `Contacted` ➔ `Converted` |
| 📝 **Notes & Timeline** | Record call logs and interaction histories per lead |
| 📅 **Follow-ups** | Schedule and complete follow-up tasks to stay on track |
| 🌐 **Website Webhook** | Public API endpoint to automatically capture leads from any contact form |
| 🔍 **Search & Filter** | Quickly search by name/email, filter by status or source, and sort |
| 📊 **Metrics Dashboard** | Real-time analytics showing pipeline metrics and conversion statistics |
| 📖 **Developer Documentation** | Built-in guide with copy-pasteable curl and JS webhook integration snippets |

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (via Mongoose)
- **Auth**: JWT (JSON Web Tokens) + bcryptjs

---

## 📁 Project Structure

```
Client Lead Management System/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── Lead.js          # Lead schema
│   │   └── User.js          # Admin user schema
│   ├── routes/
│   │   ├── auth.js          # Authentication and login endpoints
│   │   └── leads.js         # Lead CRUD, status updates, notes, and tasks
│   ├── .env.example         # Environment template
│   ├── seedAdmin.js         # Admin account creation script
│   ├── package.json
│   └── server.js            # Main backend entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx    # Lead metrics, filters, and list view
    │   │   ├── LeadDetails.jsx  # Detailed slide-over panel (notes, follow-ups)
    │   │   ├── Login.jsx        # Admin sign-in screen
    │   │   └── WebhookDocs.jsx  # Webhook developer guide
    │   ├── App.jsx              # Application state and routing
    │   ├── index.css            # Custom CSS UI design system
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A MongoDB Atlas Database

### 1. Clone the Repository

```bash
git clone https://github.com/mitulaghara/K_Task2.git
cd K_Task2
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the environment template and set up your variables:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your connection details:
   ```env
   PORT=5050
   MONGODB_URI=mongodb+srv://krishapanchotiya:krisha150607@krishamarket.wn2gn2i.mongodb.net/lead-crm?retryWrites=true&w=majority&appName=krishamarket
   JWT_SECRET=lead_crm_dev_secret_jwt_key_987654321
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Seed the initial admin account:
   ```bash
   node seedAdmin.js
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:5050`.*

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The app will open at `http://localhost:5173`.*

---

## 🔑 Default Admin Credentials (after seeding)

- **Email**: `admin@crm.com`
- **Password**: `Admin@1234`
- **Name**: `Super Admin`

---

## 🌐 Webhook Integration

To capture leads from external pages, send a `POST` request to `/api/leads`:

```bash
curl -X POST "http://localhost:5050/api/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "source": "Portfolio Website",
    "message": "I would like to inquire about your services."
  }'
```

---

## 📜 License

MIT
