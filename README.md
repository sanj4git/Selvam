# 💰 Selvam — Unified Family Finance & Wealth Management Platform

<p align="center">
  <img src="./Logo.jpeg" alt="Selvam Logo" width="200"/>
</p>

<p align="center">
  <strong>A high-performance MERN-based wealth management platform designed for Indian households</strong><br/>
  Consolidate expenses, assets, and liabilities into a single source of truth.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge" />
</p>

---

## 👨‍💻 Team

| Name | Roll Number |
|---|---|
| Amarthya Sujay | CB.SC.U4CSE23003 |
| Sanjay A R | CB.SC.U4CSE23052 |
| Sundar T | CB.SC.U4CSE23348 |

> **Course:** Full Stack Development | **Institution:** Amrita School of Computing, Coimbatore

---

## 📋 Table of Contents

- [Vision](#-vision)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Overview](#-api-overview)
- [Development Phases](#-development-phases)
- [Future Scope](#-future-scope)

---

## 🌟 Vision

To empower Indian families to make **informed, data-driven financial decisions** by providing a holistic view of their true net worth, spending patterns, and long-term financial sustainability — all from a single dashboard.

---

## ❗ Problem Statement

Most existing financial applications focus on isolated aspects of money management. Common limitations include:

- Expense trackers that ignore investments or liabilities
- Investment platforms that ignore daily expenses
- Fragmented tools requiring multiple applications
- No focus on India-centric financial instruments
- Lack of actionable, intelligent insights

**Selvam** solves this by acting as a *single source of truth* for all household finances.

---

## ✅ Features

### Phase 1: Core (Completed)

| Feature | Description |
|---|---|
| 🔐 User Authentication | Secure JWT-based registration and login |
| 💸 Expense Management | Full CRUD with category-based classification |
| 🏦 Asset Tracking | Manual entry of Cash, Gold, Stocks, FDs, Mutual Funds, Crypto, Real Estate |
| 📉 Liability Tracking | Loans and debts with automated due-date sorting |
| 📊 Financial Engine | Backend logic for net worth and monthly cash flow aggregation |
| 🛡️ Security | Axios interceptors for automatic token handling and route protection |

### Phase 2: Analytics & Automation (In Progress)

| Feature | Description |
|---|---|
| 📈 Dashboard Charts | Recharts-powered Pie and Line charts for spending and net worth trends |
| 💬 AI Chatbot | Google Gemini-powered assistant for financial insights and queries |
| 🏠 Family Sharing | "Head of Family" hierarchy for shared household visibility |
| ⏰ Scheduled Jobs | `node-cron` backend workers for market price updates |
| 🆘 SOS Alerts | Real-time emergency alerts via Socket.io |

### Expense Form Capabilities

The core expense form supports all CRUD operations:

- **Add** — Record new expenses with Amount, Category, Date, and Description
- **Display** — View all expenses sorted by date (newest first)
- **Edit** — Modify existing records inline
- **Delete** — Remove records with instant UI refresh

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| Vite | Lightning-fast build tool |
| React Router 6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Recharts | Data visualization (charts) |
| React Icons | Icon library |
| React Markdown | Render chatbot markdown responses |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js 5 | Web application framework |
| Mongoose | MongoDB ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| node-cron | Scheduled background jobs |
| @google/generative-ai | Gemini AI chatbot integration |
| dotenv | Environment variable management |
| nodemon | Dev server auto-restart |

### Database
- **MongoDB** — NoSQL document database

### Styling
- **Vanilla CSS** — Premium "Royal Blue & Gold" Glassmorphism theme with Inter/Poppins typography

---

## � Project Structure

```
Selvam/
├── backend/
│   ├── controllers/       # Business logic for each feature
│   ├── middlewares/       # Auth, validation, and error handlers
│   ├── models/            # Mongoose schemas (User, Expense, Asset, Liability, SOS)
│   ├── routes/            # Express route definitions
│   ├── services/          # External services (email, AI)
│   ├── utils/             # Helper utilities
│   ├── server.js          # Entry point — Express + Socket.io setup
│   └── .env               # Environment variables (do not commit)
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (Chatbot, etc.)
│   │   ├── pages/         # Route-level pages (Home, Dashboard, etc.)
│   │   └── style/         # Global CSS styles
│   ├── index.html
│   └── vite.config.js
│
├── docs/
│   ├── VISION.md          # Project vision and problem statement
│   ├── DEV_PLAN.md        # Phased development roadmap
│   ├── PHASE1.md          # Phase 1 details
│   ├── PHASE2.md          # Phase 2 details
│   ├── schemas.md         # Mongoose schema documentation
│   └── Expenses_Form_Report.md  # Detailed form report
│
└── Logo.jpeg
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas cloud URI)
- **npm** v9+

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Selvam
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
# Development (with auto-restart)
npx nodemon server.js

# Or with Node directly
node server.js
```

The backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at: `http://localhost:5173`

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET/POST/PUT/DELETE` | `/api/expenses` | Expense CRUD operations |
| `GET/POST/PUT/DELETE` | `/api/assets` | Asset CRUD operations |
| `GET/POST/PUT/DELETE` | `/api/liabilities` | Liability CRUD operations |
| `GET` | `/api/dashboard/summary` | Aggregated financial summary |
| `GET` | `/api/dashboard/expenses` | Expense analytics by category/month |
| `POST` | `/api/chatbot` | AI chatbot query |
| `POST` | `/api/sos/trigger` | Trigger a SOS alert |
| `GET` | `/api/sos` | View all SOS alerts (admin) |
| `PUT` | `/api/sos/:id/resolve` | Resolve a SOS alert |

> All protected routes require: `Authorization: Bearer <token>` header.

---

## 🗺 Development Phases

```
Phase 0 → Project Setup & Foundation          ✅ Done
Phase 1 → MVP (Auth, Expenses, Assets)        ✅ Done
Phase 2 → Analytics, Automation & AI         🔄 In Progress
Phase 3 → Family Management & Alerts         📋 Planned
Phase 4 → AI-Powered Financial Insights       📋 Planned
Phase 5 → UI/UX Enhancements & Scalability   📋 Planned
```

---

## 🔮 Future Scope

- 📱 **Mobile App** — React Native companion application
- 📈 **Live Market Data** — Real-time Gold, Mutual Fund NAV, Stock, and Crypto prices
- 🤖 **AI Financial Advisor** — Personalized spending suggestions using LLMs
- 👨‍👩‍👧 **Family Roles** — Head of Family + Member permissions with shared dashboards
- 📅 **Bill & EMI Reminders** — Calendar-based alerts for recurring obligations
- 📤 **Export Reports** — PDF/Excel financial summaries

---

## 📄 License

This project is developed as part of an academic course. All rights reserved by the authors.

---

<p align="center">Made with ❤️ by Team Selvam &nbsp;|&nbsp; Amrita School of Computing, Coimbatore</p>
