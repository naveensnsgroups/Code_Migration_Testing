# Migration Plan: React + Vite to Next.js App Router

This document outlines the complete migration plan for moving the frontend of the Code Migration project from React + Vite to Next.js (App Router).

## 1. Executive Summary
- **Source**: React 18, Vite, React Router (`react-router-dom`), Axios, Tailwind CSS, Lucide React, React Hot Toast, Zod.
- **Target**: Next.js (App Router), Tailwind CSS, Lucide React, React Hot Toast, Zod.
- **Goal**: Maintain 100% feature parity, exact UI/UX, identical routing structure (`/` and `/records`), and robust API communication with the backend.

---

## 2. Architecture Mapping

| Feature / Layer | React + Vite Source | Next.js Target (App Router) |
| :--- | :--- | :--- |
| **Routing** | `react-router-dom` (`BrowserRouter`, `Routes`, `Route`) | Next.js App Router (`app/page.jsx`, `app/records/page.jsx`) |
| **Layout & Navigation** | `Navbar.jsx` used inside pages | Root Layout (`app/layout.jsx`) + Shared `Navbar` component |
| **Entry Point & Providers** | `main.jsx` with `<StrictMode>` & `<Toaster>` | Root Layout (`app/layout.jsx`) wrapping children with `<Toaster>` and global providers |
| **Styling** | Tailwind CSS (`index.css`, `postcss.config.js`, `tailwind.config.js`) | Tailwind CSS (`app/globals.css`, `postcss.config.js`, `tailwind.config.js`) |
| **Environment Variables** | `import.meta.env.VITE_API_URL` | `process.next.env.NEXT_PUBLIC_API_URL` (or `process.env.NEXT_PUBLIC_API_URL`) |
| **API Client** | Axios (`src/services/api.js`) | Axios (`src/services/api.js` updated for Next.js env) |

---

## 3. Detailed File Inventory & Migration Strategy

### 3.1 Configuration & Setup
- **`package.json`**: Replace Vite scripts and dependencies (`react-router-dom`, `@vitejs/plugin-react`, `vite`) with Next.js dependencies (`next`, `react`, `react-dom`).
- **`tailwind.config.js` & `postcss.config.js`**: Retain and adapt content paths for Next.js (`./app/**/*.{js,jsx}` and `./components/**/*.{js,jsx}`).
- **`next.config.js`**: Add rewrites or API configurations if needed to proxy backend requests during local development.

### 3.2 Directory Structure (`app/` directory)
```text
app/
├── layout.jsx                # Root layout with Toaster and global font/styles
├── globals.css               # Tailwind CSS entry
├── page.jsx                  # Add Employee Form Page (Route: /)
└── records/
    └── page.jsx              # Employee Records List Page (Route: /records)

src/
├── components/
│   ├── Navbar.jsx            # Navigation header
│   ├── PersonalDetailsForm.jsx # Employee form
│   ├── EmployeeTable.jsx     # Records table
│   ├── EditModal.jsx         # Edit employee modal
│   └── ConfirmDeleteModal.jsx# Delete confirmation modal
├── services/
│   └── api.js                # Axios client and API methods
└── utils/
    └── employeeSchema.js     # Zod validation schema
```

---

## 4. Step-by-Step Execution Phases

1. **Config & Dependencies Setup**:
   - Initialize Next.js package structure and dependencies.
   - Set up Tailwind CSS and global CSS.
2. **Components Migration**:
   - Migrate `Navbar`, `PersonalDetailsForm`, `EmployeeTable`, `EditModal`, `ConfirmDeleteModal`, API service (`api.js`), and validation schema (`employeeSchema.js`).
3. **Pages Migration (App Router)**:
   - Convert `AddEmployeePage` to `app/page.jsx` (Client Component `"use client"`).
   - Convert `EmployeeRecordsPage` to `app/records/page.jsx` (Client Component `"use client"`).
4. **Layout & Root Setup**:
   - Create `app/layout.jsx` integrating `Toaster` and root HTML structure.
5. **Verification & Testing**:
   - Build the Next.js project, test all navigation links, form submissions, edit/delete modals, and verify behavior matches the original app.
