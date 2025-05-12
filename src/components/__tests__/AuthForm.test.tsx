import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../AuthForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as firebaseAuthLib from '../../lib/firebase'; 
import * as firebaseAuthModule from 'firebase/auth';
import { useAuthStore } from '../../store/authStore';
import ProtectedRoute from '../ProtectedRoute';
import { auth } from '../../lib/firebase';

// Mocks
// Mock functions exported from our local firebase wrapper module
vi.mock('../../lib/firebase', async (importOriginal: () => Promise<typeof firebaseAuthLib>) => {
  const actual = await importOriginal()
  return {
    ...actual, // Keep mocks for functions exported from here
    signUpWithEmailAndPassword: vi.fn(),
    signInWithGoogle: vi.fn(),
    sendResetPasswordEmail: vi.fn(),
    getFirebaseAuthErrorMessage: (e: any) => e.message || 'Unknown error',
    // Pass through the actual auth instance as it might be used internally
    auth: actual.auth,
  }
});

// Mock functions imported directly from the 'firebase/auth' package
vi.mock('firebase/auth', async (importOriginal: () => Promise<typeof firebaseAuthModule>) => {
    const actual = await importOriginal();
    return {
        ...actual, // Keep other exports from the original module
        signInWithEmailAndPassword: vi.fn(), // Mock the specific function used in the component
        // getRedirectResult: vi.fn(), // Example: Mock other functions if they were used
    };
});

vi.mock('../../store/authStore');
// Mock react-router-dom hooks
vi.mock('react-router-dom', async (importOriginal: () => Promise<Record<string, unknown>>) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => vi.fn(), // Mock useNavigate to prevent errors during testing
  }
});

// Create typed mock variables for easier usage in tests
const mockedSignInWithEmail = vi.mocked(firebaseAuthModule.signInWithEmailAndPassword);
const mockedFirebaseAuthLib = vi.mocked(firebaseAuthLib);
const mockedUseAuthStore = vi.mocked(useAuthStore);

// Helper to render the component within a BrowserRouter context
const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: BrowserRouter })
}

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset auth store mock to default (unauthenticated) state before each test
    mockedUseAuthStore.mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      logout: vi.fn(),
    });
  });

  test('should allow login with email and password', async () => {
    mockedSignInWithEmail.mockResolvedValue({ user: { uid: '123' } } as any);
    const onModeChange = vi.fn();
    renderWithRouter(<AuthForm mode="login" onModeChange={onModeChange} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

    // Wait for the async sign-in function to be called
    await waitFor(() => {
      expect(mockedSignInWithEmail).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    });
    // Note: Navigation behavior isn't directly tested here, only the auth function call.
  });

  test('should allow login with Google', async () => {
    mockedFirebaseAuthLib.signInWithGoogle.mockResolvedValue({ user: { uid: 'google123' } } as any);
    const onModeChange = vi.fn();
    renderWithRouter(<AuthForm mode="login" onModeChange={onModeChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(mockedFirebaseAuthLib.signInWithGoogle).toHaveBeenCalled();
    });
  });

  test('should allow signup with email and password', async () => {
    mockedFirebaseAuthLib.signUpWithEmailAndPassword.mockResolvedValue({ user: { uid: '456' } } as any);
    const onModeChange = vi.fn();
    renderWithRouter(<AuthForm mode="signup" onModeChange={onModeChange} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(mockedFirebaseAuthLib.signUpWithEmailAndPassword).toHaveBeenCalledWith('new@example.com', 'newpassword123');
    });
  });

  test('should allow signup with Google', async () => {
    mockedFirebaseAuthLib.signInWithGoogle.mockResolvedValue({ user: { uid: 'google456' } } as any);
    const onModeChange = vi.fn();
    renderWithRouter(<AuthForm mode="signup" onModeChange={onModeChange} />);

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(mockedFirebaseAuthLib.signInWithGoogle).toHaveBeenCalled();
    });
  });

  test('should allow password reset', async () => {
    mockedFirebaseAuthLib.sendResetPasswordEmail.mockResolvedValue(undefined);
    const onModeChange = vi.fn();
    // Start in login mode
    renderWithRouter(<AuthForm mode="login" onModeChange={onModeChange} />);

    // Simulate user clicking the "Forgot password?" link
    fireEvent.click(screen.getByText(/Forgot password\?/i));

    // The component calls `onModeChange` when the link is clicked.
    // Verify the parent component would receive the correct mode change request.
    await waitFor(() => {
      expect(onModeChange).toHaveBeenCalledWith('resetPassword');
    });

    // To test the reset form itself, re-render the component with the 'resetPassword' mode,
    // simulating the parent component updating the prop based on the callback.
    renderWithRouter(<AuthForm mode="resetPassword" onModeChange={onModeChange} />);

    // Interact with the reset password form
    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input[name="resetEmail"]' }), { target: { value: 'reset@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Email/i }));

    await waitFor(() => {
      expect(mockedFirebaseAuthLib.sendResetPasswordEmail).toHaveBeenCalledWith('reset@example.com');
      // Optional: Check for success message rendering if implemented.
    });
  });

  // This test verifies ProtectedRoute behavior in conjunction with the mocked auth state.
  test('ProtectedRoute should redirect unauthenticated users to login', () => {
    // Ensure useAuthStore returns an unauthenticated state for this test
    mockedUseAuthStore.mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      logout: vi.fn(),
    });

    const MockDashboard = () => <div>Dashboard Content</div>;
    renderWithRouter(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        {/* Wrap the protected component with ProtectedRoute */}
        <Route path="/dashboard" element={<ProtectedRoute><MockDashboard /></ProtectedRoute>} />
      </Routes>,
      { route: '/dashboard' } // Start navigation at the protected route
    );

    // Assert that the user is redirected to the login page
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  // Consider adding tests for error handling, input validation, loading states, etc.
});
