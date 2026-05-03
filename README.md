# Patient Visit Tracker - Frontend

The Patient Visit Tracker is a secure, premium clinical dashboard for managing patient encounters and clinician records. It features a sleek interface and robust authentication to streamline healthcare workflows efficiently.

## ✨ Features

- **🔐 Secure Access**: Dedicated login portal with JWT session management.
- **📊 Analytics Dashboard**: Visual overview of clinical activity, patient growth, and clinician workload.
- **👩‍⚕️ Clinician Directory**: Manage healthcare providers with specialized clinical focus.
- **👤 Patient Registry**: Streamlined patient onboarding and searchable records.
- **🗓️ Visit Tracking**: Advanced table view for monitoring visits with real-time filtering by clinician or patient.
- **🎨 Premium UI/UX**: Clean, responsive interface built with Tailwind CSS, featuring smooth transitions and high-performance layouts.
- **⚡ Performance First**: Optimized state management using **Zustand** and server-state handling with **TanStack Query**.

## 🛠️ Tech Stack

- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

### 4. Running the App
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📂 Project Structure

- `src/api`: Axios instances and endpoint definitions.
- `src/components`: Reusable UI components and page-specific modules.
- `src/store`: Zustand store for global application state.
- `src/types`: TypeScript interfaces and type definitions.
- `src/utils`: Helper functions for date formatting and data manipulation.

---
Developed by Shivam Vishwakarma
