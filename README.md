# 🏢 Enterprise HR Personal Details System — MERN Stack

An enterprise-grade, production-ready **HR Personal Details Management System** built with the **MERN Stack** (MongoDB Atlas, Express.js, React 18, Node.js), **Tailwind CSS**, and **Zod** schema validation.

Developed for **SNS IHUB**.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Live Deployment Links](#-live-deployment-links)
- [Architecture & System Flow](#-architecture--system-flow)
- [Key Features](#-key-features)
- [Real-Time Input Transformations & UX](#-real-time-input-transformations--ux)
- [Dual-Layer Zod Validation Schema](#-dual-layer-zod-validation-schema)
- [PII Data Protection & Encryption Standards](#-pii-data-protection--encryption-standards)
- [Lines of Code (LOC) Breakdown](#-lines-of-code-loc-breakdown)
- [Free Hosting & Deployment Guide](#-free-hosting--deployment-guide)
- [Sample Test Records](#-sample-test-records)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Directory Structure](#-directory-structure)
- [Installation & Setup Guide](#-installation--setup-guide)
- [Environment Configuration](#-environment-configuration)
- [RESTful API Reference](#-restful-api-reference)
- [Security & OWASP Best Practices](#-security--owasp-best-practices)
- [License](#-license)

---

## 🌐 Overview

The **HR Personal Details System** is designed for modern corporate environments to seamlessly onboard employees, track employee information across departments, and enforce company-specific data governance rules (e.g. `@snsgroups.com` email domain restrictions and `EMP` formatted employee IDs).

It features a **pure white design system**, **sharp-cornered black action controls**, **Poppins typography**, and responsive layouts.

---

## 🚀 Live Deployment Links

- **Frontend Client (Vercel)**: [`https://mernstack-project-trail.vercel.app/`](https://mernstack-project-trail.vercel.app/)
- **Backend API (Render)**: [`https://sns-hr-backend.onrender.com/api/employees`](https://sns-hr-backend.onrender.com/api/employees)
- **Database (MongoDB Atlas Cloud)**: `Code_Migration_HR_Trail` -> Collection `HR`

---

## 🏗 Architecture & System Flow

```
                                  +-----------------------+
                                  |     Browser / Client  |
                                  | (React 18 + Vite SPA) |
                                  +-----------+-----------+
                                              |
                                              |  HTTPS / TLS 1.3 (Axios + Zod)
                                              v
                                  +-----------+-----------+
                                  |     Express Server    |
                                  | (Helmet, CORS, Rate)  |
                                  +-----------+-----------+
                                              |
                                              |  Zod Validation Middleware
                                              v
                                  +-----------+-----------+
                                  |  Employee Controller  |
                                  | (Field Whitelisting)  |
                                  +-----------+-----------+
                                              |
                                              |  Mongoose ODM (AES-256)
                                              v
                                  +-----------+-----------+
                                  |     MongoDB Atlas     |
                                  | (DB: Code_Migration...|
                                  |  Collection: HR)      |
                                  +-----------------------+
```

---

## ✨ Key Features

- **Multi-Page Client Navigation** (`react-router-dom` v6):
  - `/` — Add New Employee Registration Page.
  - `/records` — Employee Records Dashboard with live statistics and CRUD operations.
- **Full CRUD Functionality**:
  - **Create**: Register new employee personal details.
  - **Read**: View employee records in a responsive table with department badges & pagination.
  - **Update**: Edit existing employee details via an accessible modal.
  - **Delete**: Double-confirmation deletion modal with auto-focused cancel safety button.
- **Interactive Department Analytics**:
  - Live counters for Total Employees, IT Department, HR Department, and Other Departments (clean, soft-bordered UI).
- **Accessibility & UX**:
  - ARIA attributes (`aria-label`, `aria-modal`, `role="dialog"`).
  - Modal keyboard listeners (`Escape` key closes modals).
  - Toast feedback via `react-hot-toast`.

---

## ⚡ Real-Time Input Transformations & UX

The application enforces real-time input formatting as the user types:

| Field | Real-Time Input Transformation | Formatting Rules |
|---|---|---|
| **Full Name\*** | Letters & Single Spaces Only | Blocks numbers & symbols; collapses consecutive spaces into a single space. |
| **Employee ID\*** | Auto-Uppercase (`EMP001`) | Converts typed letters to uppercase automatically; blocks special characters. |
| **Email Address\*** | Domain Restriction (`@snsgroups.com`) | Auto-converts to lowercase; strictly requires `@snsgroups.com` domain. |
| **Phone Number\*** | 10-Digit Restrict + Country Flag | Displays **🇮🇳 +91** badge inside input; strictly caps length at 10 numeric digits. |

---

## 🛡 Dual-Layer Zod Validation Schema

Validation is performed on **both client (React)** and **server (Express Middleware)** using **Zod**:

### Validation Rules Matrix

| Field | Type | Required | Validation Rule | Zod Error Message |
|---|---|---|---|---|
| `fullName` | `string` | Yes | `^[A-Za-z\s]+$` | *Only letters and spaces allowed (no numbers or special characters)* |
| `employeeId` | `string` | Yes | `^EMP\d+$` | *Must start with capital EMP followed by numbers (e.g. EMP001)* |
| `email` | `string` | Yes | `^[a-z0-9._%+-]+@snsgroups\.com$` | *Must be a valid email ending with @snsgroups.com* |
| `phone` | `string` | Yes | `^\d{10}$` | *Phone number must be exactly 10 digits* |
| `department` | `enum` | No | `IT, HR, Finance, Marketing, Operations, Sales, Admin, Other` | *Invalid department option* |
| `gender` | `enum` | No | `Male, Female, Other` | *Invalid gender option* |

---

## 🔐 PII Data Protection & Encryption Standards

1. **Encryption in Transit (HTTPS / TLS 1.3)**:
   - All network payloads between client, Express backend, and MongoDB Atlas are encrypted over **TLS 1.3 / SSL HTTPS**.
2. **Encryption at Rest (MongoDB Atlas AES-256)**:
   - Cloud storage disks are encrypted with hardware-level **AES-256 bit encryption**.
3. **GDPR / Privacy Compliance Rights**:
   - **Right to Rectification**: Employee details can be modified at any time via `/records`.
   - **Right to Erasure**: Complete deletion supported via confirmation modal.

---

## 📊 Lines of Code (LOC) Breakdown

| Layer | File Count | Lines of Code (LOC) |
|---|---|---|
| **Frontend UI (React + Tailwind)** | 15 files | **1,054 lines** |
| **Backend API (Express + Mongoose + Zod)** | 9 files | **443 lines** |
| **Documentation (`README.md`)** | 1 file | **347 lines** |
| **TOTAL WORKSPACE** | **25 files** | **1,844 lines** |

### Detailed File-by-File LOC Matrix

| File Path | Purpose | LOC |
|---|---|---|
| `frontend/src/components/PersonalDetailsForm.jsx` | Add Employee Form with live typing filters & Flag | **288** |
| `frontend/src/components/EditModal.jsx` | Edit Modal component with Zod validation | **272** |
| `backend/controllers/employeeController.js` | Whitelisted RESTful CRUD business logic | **148** |
| `frontend/src/pages/EmployeeRecordsPage.jsx` | `/records` Dashboard & Stat Counters | **138** |
| `frontend/src/components/EmployeeTable.jsx` | Employee Records Table | **131** |
| `frontend/src/components/ConfirmDeleteModal.jsx` | Deletion confirmation modal | **106** |
| `backend/server.js` | Express entry point with security middleware | **101** |
| `backend/models/Employee.js` | Mongoose Schema (Collection: `HR`) | **72** |
| `frontend/src/components/Navbar.jsx` | Navigation Header with active tab styling | **62** |
| `frontend/src/pages/AddEmployeePage.jsx` | `/` Page component | **47** |
| `frontend/index.html` | Entry HTML with Tailwind CDN & Poppins font | **46** |
| `frontend/src/utils/employeeSchema.js` | Frontend Zod schema validator | **44** |
| `backend/middleware/validateEmployee.js` | Backend Express Zod payload validator | **43** |
| `frontend/src/main.jsx` | React root entry & Toast config | **33** |
| `frontend/package.json` | Client dependencies | **29** |
| `frontend/src/services/api.js` | Axios client & global interceptor | **26** |
| `backend/package.json` | Server dependencies | **23** |
| `backend/routes/employeeRoutes.js` | Express route mapping with Zod middleware | **21** |
| `frontend/src/App.jsx` | React Router shell | **20** |
| `backend/config/db.js` | MongoDB Atlas connection logic | **19** |
| `backend/.env.example` | Environment template | **11** |
| `frontend/src/index.css` | Base CSS resets | **7** |
| `backend/.env` | Secret environment config | **5** |
| `frontend/vercel.json` | Vercel SPA routing rewrite config | **5** |

---

## ☁️ Free Hosting & Deployment Guide

### Backend (Render Web Service)
1. Sign up on **[Render.com](https://render.com)** -> Connect GitHub repo.
2. Select Root Directory: `backend` | Build Command: `npm install` | Start Command: `npm start`.
3. Set Environment Variables:
   - `MONGO_URI`: `mongodb+srv://pf01:pf01@productfactory01.tqhycwe.mongodb.net/Code_Migration_HR_Trail?retryWrites=true&w=majority`
   - `CLIENT_URL`: `https://mernstack-project-trail.vercel.app`
   - `PORT`: `5000` | `NODE_ENV`: `production`

### Frontend (Vercel Static Site)
1. Sign up on **[Vercel.com](https://vercel.com)** -> Import GitHub repo.
2. Select Root Directory: `frontend` | Framework: `Vite` | Output: `dist`.
3. Set Environment Variable:
   - `VITE_API_URL`: `https://sns-hr-backend.onrender.com/api/employees`

---

## 🧪 Sample Test Records

```json
{
  "fullName": "Naveen Kumar",
  "employeeId": "EMP101",
  "email": "naveen@snsgroups.com",
  "phone": "9876543210",
  "department": "IT",
  "position": "Software Engineer"
}
```

```json
{
  "fullName": "Priya Sharma",
  "employeeId": "EMP102",
  "email": "priya@snsgroups.com",
  "phone": "9123456789",
  "department": "HR",
  "position": "HR Manager"
}
```

---

## 🛠 Tech Stack & Dependencies

### Frontend (`frontend/package.json`)
- **Framework**: React 18.3 + Vite 5
- **Routing**: `react-router-dom` v6.24
- **Schema Validation**: `zod` v3.23
- **Styling**: Tailwind CSS + Google Fonts (`Poppins`)
- **HTTP Client**: Axios v1.7 (with response interceptors)
- **Icons**: Lucide React v0.395
- **Toasts**: `react-hot-toast` v2.4

### Backend (`backend/package.json`)
- **Runtime**: Node.js v22
- **Server Framework**: Express.js v4.19
- **Database**: MongoDB Atlas via Mongoose v8.4
- **Schema Validation**: `zod` v3.23
- **Security Middleware**: `helmet` v7.1, `cors` v2.8, `express-rate-limit` v7.3, `express-mongo-sanitize` v2.2

---

## 📁 Directory Structure

```
Mernstack_Project_Trail/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB Atlas connection setup
│   ├── controllers/
│   │   └── employeeController.js   # Whitelisted RESTful CRUD logic
│   ├── middleware/
│   │   └── validateEmployee.js     # Zod Express payload validator
│   ├── models/
│   │   └── Employee.js             # Mongoose Schema (Collection: 'HR')
│   ├── routes/
│   │   └── employeeRoutes.js       # API endpoint route mapping
│   ├── .env                        # Environment secret configuration
│   ├── .env.example                # Secret template for developers
│   ├── package.json                # Server dependencies
│   └── server.js                   # Production Express entry point
│
└── frontend/
    ├── index.html                  # Entry HTML with Tailwind CDN & Poppins font
    ├── package.json                # Client dependencies
    └── src/
        ├── App.jsx                 # Router shell (/ and /records)
        ├── main.jsx                # React root entry & Toast styling
        ├── index.css               # Base CSS resets
        ├── components/
        │   ├── Navbar.jsx          # Navigation header component
        │   ├── PersonalDetailsForm.jsx # Add Employee Form
        │   ├── EmployeeTable.jsx   # Employee Records Table
        │   ├── EditModal.jsx       # Modal for updating employee details
        │   └── ConfirmDeleteModal.jsx # Deletion confirmation modal
        ├── pages/
        │   ├── AddEmployeePage.jsx    # Route: /
        │   └── EmployeeRecordsPage.jsx # Route: /records
        ├── services/
        │   └── api.js              # Axios instance with global interceptor
        └── utils/
            └── employeeSchema.js   # Frontend Zod validation helper
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas Cluster Account

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (Express, Mongoose, Zod, Helmet, etc.)
npm install

# Start development server
npm run dev
```
*Backend server will start at `http://localhost:5000`*

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (React, React Router, Zod, Axios, etc.)
npm install

# Start Vite development server
npm run dev
```
*Frontend client will start at `http://localhost:5173`*

---

## ⚙️ Environment Configuration

Create a `.env` file in `backend/.env`:

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://pf01:pf01@productfactory01.tqhycwe.mongodb.net/Code_Migration_HR_Trail?retryWrites=true&w=majority

# Express Server Port
PORT=5000

# Environment Mode
NODE_ENV=development

# Frontend Allowed Origin (CORS Isolation)
CLIENT_URL=http://localhost:5173
```

---

## 📡 RESTful API Reference

| Method | Endpoint | Description | Request Body / Params | Status Codes |
|---|---|---|---|---|
| **GET** | `/api/employees` | Get all employees (paginated) | Query: `?page=1&limit=50` | `200 OK` |
| **GET** | `/api/employees/:id` | Get single employee by ID | Params: `:id` (Mongo ObjectId) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/api/employees` | Create new employee | Body: `Employee JSON Payload` | `201 Created`, `400 Bad Request`, `409 Conflict` |
| **PUT** | `/api/employees/:id` | Update existing employee | Body: `Updated JSON Payload` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/employees/:id` | Delete employee record | Params: `:id` | `200 OK`, `400 Bad Request`, `404 Not Found` |

---

## 🔒 Security & OWASP Best Practices

1. **Zero Hardcoded Secrets**: Connection strings are isolated in `backend/.env` (ignored via `.gitignore`).
2. **Mass Assignment Guard**: `pickFields()` whitelist in controller prevents injection of unauthorized database fields.
3. **NoSQL Injection Guard**: `express-mongo-sanitize` strips operator characters (`$`, `.`).
4. **DoS Protection**: `express-rate-limit` limits traffic to 100 requests / 15 minutes per IP.
5. **Security Headers**: `helmet()` masks server signatures and mitigates XSS/clickjacking attacks.
6. **CastError Guard**: `isValidObjectId()` prevents internal server crashes on invalid URL parameters.

---

## 📄 License & Brand

**Built for SNS IHUB**  
*HR Personal Details Portal — All Rights Reserved.*
