[🇬🇧 English](https://github.com/kardaskerimmert/personal-site-frontend/blob/main/README.md) | [🇹🇷 Türkçe](https://github.com/kardaskerimmert/personal-site-frontend/blob/main/README.TR.md)

# Personal Portfolio Frontend

![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

A modern, high-performance, and fully dynamic personal portfolio frontend built with **React Router v7**, **Server-Side Rendering (SSR)**, and **Tailwind CSS v4**. It features a robust admin dashboard for real-time content management.

## 🚀 Features

* **⚡ High Performance:** Built with **Vite** and **SSR** (Server-Side Rendering) for fast load times and better SEO.
* **🎨 Dynamic Theming:** Real-time color theme switching (Primary/Accent colors) powered by CSS Variables and controlled via the Admin Panel.
* **📱 Responsive Design:** Mobile-first approach using **Tailwind CSS v4**.
* **✨ Animations:** Smooth transitions and interactive elements using **Framer Motion** (e.g., Spotlight Cards, Hero animations).
* **🔒 Secure Admin Dashboard:**
    * **Live Preview:** Edit content and see changes instantly in a split-view mode.
    * **Modular Architecture:** Separated logic (Hooks) and UI (Components).
    * **Authentication:** Secure login flow with HttpOnly cookies.
* **📢 Notifications:** Modern toast notifications using `sonner`.
* **💀 Skeleton Loading:** Polished loading states for better UX.
* **🌍 SEO Optimized:** Dynamic meta tags and Open Graph (OG) support based on API data.

## 🛠 Tech Stack

* **Framework:** React Router v7 (formerly Remix/React Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Animations:** Framer Motion
* **Icons:** FontAwesome (via CDN)
* **Notifications:** Sonner
* **HTTP Client:** Native Fetch API
* **Build Tool:** Vite

## 📂 Project Structure

The project follows a modular, component-based architecture:

```text
app/
├── components/
│   ├── admin/          # Admin-specific components (Forms, Modals, SectionCards)
│   └── ui/             # Reusable UI components (SpotlightCard, Background, Skeleton)
├── hooks/              # Custom hooks for logic separation (useDashboard, useHome)
├── lib/                # Utility functions, API constants, and Theme logic
├── routes/             # File-based routing (Home, Admin, Dashboard)
├── types/              # Shared TypeScript interfaces
├── root.tsx            # Root layout and global context
└── app.css             # Tailwind imports and CSS variable definitions

```

## ⚙️ Installation & Setup

### 1. Clone the repository


```bash
git clone https://github.com/kardaskerimmert/personal-site-frontend
cd personal-site-frontend
```

### 2. Install dependencies

This project uses **pnpm**.

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:


```
# URL of your backend API
VITE_API_URL=http://localhost:4000
```

## 🏃‍♂️ Running the Application

### Development Server

Starts the development server with HMR (Hot Module Replacement).

```bash
pnpm dev
```

### Production Build

Builds the application for production (Server and Client bundles).

```bash
pnpm build

```

### Start Production Server

Runs the built application.

```bash
pnpm start

```

## 🎨 Theme System

The application uses a dynamic theming system based on CSS variables.

1.  **Backend:** Stores `primary` and `accent` HEX codes.
    
2.  **Frontend (Logic):** Fetches these colors and injects them into the root style attribute.
    
3.  **Tailwind (v4):** Configured in `app.css` to use these variables:
    
```css
@theme {
  --color-primary: var(--color-primary);
  --color-accent: var(--color-accent);
}

```
This allows the entire site's color scheme to change instantly without rebuilding or redeploying.

## 🛡️ Admin Dashboard

The dashboard is designed with a **"Separation of Concerns"** principle:

-   **`useDashboard` Hook:** Handles all API logic (Fetch, Save, Logout), State management, and Optimistic UI updates.
    
-   **`DashboardForm`:** Handles the input fields and data entry.
    
-   **`DashboardPreview`:** Renders a live preview of the portfolio using the current state.
    

## 📄 License

This project is licensed under the [MIT License](https://github.com/kardaskerimmert/personal-site-frontend/blob/main/LICENSE).