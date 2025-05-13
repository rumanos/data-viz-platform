# dataviz

[![React Version](https://img.shields.io/badge/react-18%2B-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/firebase-%23FFCA28.svg?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ Key Features Implemented

The platform implements several key features and interactions:

* **Authentication:**
    * Secure user login, signup, and password reset functionality using Firebase Authentication.
    * "Continue with Google" option for seamless OAuth login and signup.
    * Comprehensive form validation for all authentication forms.
    * Specific error handling for common scenarios (e.g., existing email address during signup).
* **Routing & Navigation:**
    * Secure pages implemented using Protected Routes, ensuring only authenticated users can access them.
    * Dedicated routes for login, signup, and password reset pages.
    * Custom `NotFound` page for handling invalid routes gracefully.
    * Responsive sidebar with expand/collapse functionality and a mobile-friendly drawer for navigation.
* **User Interface & Experience:**
    * Modular `AuthForm` component designed with reusable sub-components for maintainability.
    * Unified animations and smooth transitions between different authentication modes (login, signup, reset).
    * `ThemeProvider` for managing application themes (e.g., light/dark mode support).
    * TailwindCSS configured for utility-first styling, ensuring a modern and responsive UI.
    * Validation errors are intelligently cleared when switching between authentication modes.
* **Core Screens:**
    * **Dashboard Screen:** Displays a primary data visualization (e.g., chart/graph). Includes a "Variables Panel" and action buttons like "Edit Variables."
    * **Variable Editing Slide-Over Card Screen:** Accessed via the "Edit Variables" button. This overlay allows users to adjust data visualization parameters through interactive elements.
    * **Details Screen (Data Point Hover):** Displays detailed contextual information about a specific data point when hovered over in the main dashboard visualization.
* **Interactive Data Visualization & Variable Management:**
    * Dynamic display of data through charts/graphs.
    * **Variables Panel:** Lists adjustable parameters for the data visualization.
        * **Variable Selection Interaction:** Users can select variables from this panel. Hovering over a variable for ~1.5 seconds displays contextual information to aid in selection. Includes state management for active/inactive variable states.
    * **Edit Variables Sheet/Slide-Over:**
        * Triggered by the "Edit Variables" button, opening with a smooth transition.
        * Provides the ability to select variable options from categories with managed state.
        * Allows users to modify variables used in the visualization.
* **State Management:**
    * Zustand utilized for efficient global state management.
    * Manages authentication state (current user, loading status) by subscribing to Firebase auth changes.
    * Manages sidebar state, persisting user preferences (e.g., expanded/collapsed) across sessions.
* **Development & Tooling:**
    * Project setup with Vite, React, TypeScript, TailwindCSS, and Shadcn/ui components.
    * Automated tests (using Vitest/React Testing Library) covering `AuthForm` functionalities (login, signup, reset) and `ProtectedRoute


## 🛠️ Tech Stack

* **Frontend Library:** React 18+
* **Language:** TypeScript
* **Build Tool:** Vite
* **Styling:** TailwindCSS
* **UI Components:** Shadcn/ui
* **Routing:** React Router
* **State Management:** Zustand
* **Authentication:** Firebase Authentication (Email/Password, Google OAuth)
* **Testing:** Vitest, React Testing Library


## 💡 Technical Decisions
* **State Management:** Went with Zustand because Redux was overkill and Context is messy. Zustand's API is super clean and the bundle size is tiny.
* **Styling:** Tailwind + Shadcn/ui. Tailwind's utility classes are a game changer for rapid dev, and Shadcn gave some solid components out of the box.
* **Firebase:** Firebase Auth was a no-brainer - got email/pass and Google OAuth with full customization.
* **TypeScript:** Added TS because JavaScript was giving me anxiety. The type safety is worth the extra setup time.
* **Motion:**  To enhance user experience, used in authentication, charts, 404 page and for subtle transitions
* **Rechart:** Since I used Shadcn, It came with Recharts for creating custom chart. 

## 🚧 Improvements
* **Limitations:**
    * Currently uses dummy data for visualizations; integration with a real data
    * Interactivity needs to be added between variable panel and chart
    * Homepanel components need to be further modularized
    * Chart data needs to be structured. and the chart styling needs to be better aligned with the design

## ⏱️ Time Spent
* **Total Time:** Approximately 7 hours


## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or later recommended)
* pnpm (or yarn / npm)

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/rumanos/data-viz-platform.git](https://github.com/rumanos/data-viz-platform.git)
    cd data-viz-platform
    ```

2.  **Install dependencies:**
    ```bash
    # Using pnpm (recommended)
    pnpm install
    ```bash
    # Using yarn
    yarn install
    ```bash
    # Using npm
    npm install
    ```

3.  **Set up Firebase:**
    * Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    * In your Firebase project settings, add a new Web App.
    * Obtain your Firebase project configuration (apiKey, authDomain, projectId, etc.).
    * Enable **Email/Password** and **Google** sign-in methods in Firebase Authentication > Sign-in method.
    * Create a `.env` file in the root of your project.
    * Add your Firebase configuration details to the `.env` file, prefixed with `VITE_`:
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        # VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)
        ```

4.  **Run the development server:**
    ```bash
    # Using pnpm
    pnpm dev
    ```bash
    # Using yarn
    yarn dev
    ```bash
    # Using npm
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 🧪 Running Tests

To run the automated tests for components and functionality:
```bash
# Using pnpm
pnpm test