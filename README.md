# dataviz

## Setup Instructions

1.  **Clone the repository.**
    ```bash
    git clone https://github.com/rumanos/data-viz-platform.git
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    # or
    yarn install
    # or
    npm install
    ```
3.  **Set up Firebase:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Obtain your Firebase project configuration (apiKey, authDomain, projectId, etc.).
    *   Create a `.env` file in the root of your project and add your Firebase configuration details. Example:
        ```
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```
5.  **Run the development server:**
    ```bash
    pnpm dev
    # or
    yarn dev
    # or
    npm dev
    ```

## Features Implemented

*   **Authentication:**
    *   User login, signup, and password reset functionality using Firebase Authentication.
    *   "Continue with Google" option for seamless login and signup.
    *   Comprehensive form validation for all authentication forms.
    *   Specific error handling for scenarios like an existing email address during signup.
*   **Routing:**
    *   Secure pages implemented using Protected Routes, ensuring only authenticated users can access them.
    *   Dedicated routes for login, signup, and password reset pages.
    *   Custom `NotFound` page for handling invalid routes.
*   **User Interface & Experience:**
    *   `AuthForm` component designed with modularity, employing reusable sub-components.
    *   Unified animations and smooth transitions between different authentication modes (login, signup, reset).
    *   `ThemeProvider` for managing application themes (e.g., light/dark mode).
    *   TailwindCSS configured for styling, ensuring proper rendering of UI elements.
    *   Validation errors are cleared when switching between authentication modes.
*   **State Management:**
    *   Zustand used for global state management.
    *   Manages authentication state, including the current user and loading status, by subscribing to Firebase auth changes.
*   **Development & Tooling:**
    *   Project setup with Vite, React, TypeScript, TailwindCSS, and Shadcn.
    *   Automated tests covering `AuthForm` functionalities (login, signup, reset) and `ProtectedRoute`.
    *   Run tests using:
        ```bash
        pnpm test
        # To run only unit tests:
        # pnpm test:unit (or similar, depending on your test script configuration)
        ```
