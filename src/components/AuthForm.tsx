import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useCallback, useEffect } from "react"
import { signInWithEmailAndPassword, getRedirectResult } from 'firebase/auth'
import { auth, getFirebaseAuthErrorMessage, signUpWithEmailAndPassword, sendResetPasswordEmail, signInWithGoogle } from '../lib/firebase'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'

type AuthMode = 'login' | 'signup' | 'resetPassword';

interface AuthFormProps extends React.ComponentPropsWithoutRef<'form'> {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onAuthError?: (error: string) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// Utility: Validation
function validateAuthForm(values: { email: string; password: string; confirmPassword?: string }, mode: AuthMode): FormErrors {
  const errors: FormErrors = {};
  if (!values.email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (mode === 'signup') {
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }
  return errors;
}

// Subcomponents
function FormHeader({ mode }: { mode: AuthMode }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="text-balance text-sm text-muted-foreground">
        {mode === 'login'
          ? 'Enter your email below to login to your account'
          : 'Enter your email and password to join'}
      </p>
    </div>
  );
}

function GoogleButton({ loading, mode, onClick }: { loading: boolean, mode: AuthMode, onClick: () => void }) {
  return (
    <Button variant="outline" className="w-full" type="button" disabled={loading} onClick={onClick} aria-busy={loading}>
      {/* Google SVG icon */}
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" className="flex-shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
      {loading
        ? mode === 'login'
          ? 'Signing in with Google...'
          : 'Signing up with Google...'
        : 'Continue with Google'}
    </Button>
  );
}

function EmailInput({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
  error?: string,
  disabled?: boolean
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="m@example.com"
        autoComplete="email"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? 'email-error' : undefined}
        required
        disabled={disabled}
      />
      {error && (
        <span id="email-error" className="text-xs text-destructive mt-1">{error}</span>
      )}
    </div>
  );
}

function PasswordInput({ value, onChange, onBlur, error, disabled, mode, onForgot }: { value: string, onChange: any, onBlur: any, error?: string, disabled?: boolean, mode: AuthMode, onForgot?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        {mode === 'login' && onForgot && (
          <a
            href="/reset-password"
            className="ml-auto text-sm underline-offset-4 hover:underline text-primary/70 underline"
            onClick={onForgot}
          >
            Forgot password?
          </a>
        )}
      </div>
      <Input
        id="password"
        name="password"
        type="password"
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? 'password-error' : undefined}
        required
        disabled={disabled}
      />
      {error && (
        <span id="password-error" className="text-xs text-destructive mt-1">{error}</span>
      )}
    </div>
  );
}

function ConfirmPasswordInput({ value, onChange, onBlur, error, disabled }: { value: string, onChange: any, onBlur: any, error?: string, disabled?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? 'confirmPassword-error' : undefined}
        required
        disabled={disabled}
      />
      {error && (
        <span id="confirmPassword-error" className="text-xs text-destructive mt-1">{error}</span>
      )}
    </div>
  );
}

function ResetPasswordForm({ resetEmail, resetLoading, resetError, resetSuccess, onChange, onSubmit, onBack }: {
  resetEmail: string,
  resetLoading: boolean,
  resetError: string | null,
  resetSuccess: string | null,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (e: React.FormEvent) => void,
  onBack: () => void,
}) {
  return (
    <form onSubmit={onSubmit} className={cn('flex flex-col gap-6')} noValidate>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email address and we'll send you a password reset link.
        </p>
      </div>
      <div className="grid gap-6 mt-6">
        <div className="grid gap-2">
          <Label htmlFor="resetEmail">Email</Label>
          <Input
            id="resetEmail"
            name="resetEmail"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            value={resetEmail}
            onChange={onChange}
            required
            disabled={resetLoading}
          />
          {resetError && <div className="text-xs text-destructive mt-1">{resetError}</div>}
          {resetSuccess && <div className="text-xs text-green-600 mt-1">{resetSuccess}</div>}
        </div>
        <Button type="submit" disabled={resetLoading} className="w-full">
          {resetLoading ? 'Sending...' : 'Send Reset Email'}
        </Button>
      </div>
      <div className="text-center text-sm mt-6">
        <button
          type="button"
          onClick={onBack}
          className="underline underline-offset-4 cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}

export function AuthForm({ mode, onModeChange, className, onAuthError, ...props }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleModeChange = useCallback((newMode: AuthMode) => {
    setFormValues(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
    setFormErrors(prev => ({
      ...prev,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
      general: undefined
    }));
    onModeChange(newMode);
  }, [onModeChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const errors = validateAuthForm(formValues, mode);
    setFormErrors((prev) => ({ ...prev, [name]: errors[name as keyof FormErrors] }));
  }, [formValues, mode]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const errors = validateAuthForm(formValues, mode);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, formValues.email, formValues.password);
      } else {
        await signUpWithEmailAndPassword(formValues.email, formValues.password);
      }
      navigate('/');
    } catch (err: unknown) {
      let errorCode = 'unknown-error';
      let errorMessage = 'An unexpected error occurred.';
      if (typeof err === 'object' && err !== null) {
        if ('code' in err) errorCode = String((err as {code: unknown}).code);
        if ('message' in err) errorMessage = String((err as {message: unknown}).message);
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }

      let errorMsg: string;
      if (mode === 'signup' && errorCode === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please login or use a different email.';
      } else {
        errorMsg = getFirebaseAuthErrorMessage(errorCode || errorMessage);
      }
      setFormErrors((prev) => ({ ...prev, general: errorMsg }));
      onAuthError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [formValues, mode, navigate, onAuthError]);

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    setFormErrors((prev) => ({ ...prev, general: undefined }));
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: unknown) {
      let errorCode = 'unknown-error';
      let errorMessage = 'An unexpected error occurred.';
      if (typeof err === 'object' && err !== null) {
        if ('code' in err) errorCode = String((err as {code: unknown}).code);
        if ('message' in err) errorMessage = String((err as {message: unknown}).message);
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }
      const errorMsg = getFirebaseAuthErrorMessage(errorCode || errorMessage);
      setFormErrors((prev) => ({ ...prev, general: errorMsg }));
      onAuthError?.(errorMsg);
    } finally {
      setGoogleLoading(false);
    }
  }, [onAuthError, navigate]);

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result) {
        navigate('/');
      }
    }).catch((error) => {
      // Log redirect errors
      console.error('Redirect sign-in error:', error);
    });
  }, [navigate]);

  const handleresetPassword = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setResetEmail(formValues.email || '');
    setResetError(null);
    setResetSuccess(null);
    setFormErrors({});
    onModeChange('resetPassword');
  }, [formValues.email, onModeChange]);

  const handleResetEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value);
    setResetError(null);
    setResetSuccess(null);
  }, []);

  const handleSendResetEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      setResetLoading(false);
      return;
    }
    try {
      await sendResetPasswordEmail(resetEmail);
      setResetSuccess('Password reset email sent! Please check your inbox.');
    } catch (err: unknown) {
      let errorCode = 'unknown-error';
      let errorMessage = 'An unexpected error occurred.';
      if (typeof err === 'object' && err !== null) {
        if ('code' in err) errorCode = String((err as {code: unknown}).code);
        if ('message' in err) errorMessage = String((err as {message: unknown}).message);
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }
      setResetError(getFirebaseAuthErrorMessage(errorCode || errorMessage));
    } finally {
      setResetLoading(false);
    }
  }, [resetEmail]);

  // Define common animation properties
  const animationProps = {
    layout: true,
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.25, ease: 'easeInOut', type: 'spring' },
  };

  // Use a single AnimatePresence wrapping the conditional rendering
  return (
    <AnimatePresence mode="wait" initial={false}>
      {mode === 'resetPassword' ? (
        // Motion div for reset password mode
        <motion.div key="resetPassword" {...animationProps}>
          <ResetPasswordForm
            resetEmail={resetEmail}
            resetLoading={resetLoading}
            resetError={resetError}
            resetSuccess={resetSuccess}
            onChange={handleResetEmailChange}
            onSubmit={handleSendResetEmail}
            onBack={() => handleModeChange('login')} // Use handleModeChange
          />
        </motion.div>
      ) : (
        // Motion div for login/signup modes
        <motion.div key={mode} {...animationProps}>
          <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)} {...props} noValidate>
            <FormHeader mode={mode} />
            <div className="grid gap-6 mt-6">
              <GoogleButton loading={loading || googleLoading} mode={mode} onClick={handleGoogleSignIn} />
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <EmailInput
                value={formValues.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formErrors.email}
                disabled={loading}
              />
              <PasswordInput
                value={formValues.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={formErrors.password}
                disabled={loading}
                mode={mode}
                onForgot={handleresetPassword}
              />
              {mode === 'signup' && (
                <ConfirmPasswordInput
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={formErrors.confirmPassword}
                  disabled={loading}
                />
              )}
              {formErrors.general && (
                <div className="text-xs text-destructive text-start">{formErrors.general}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? mode === 'login'
                    ? 'Signing in...'
                    : 'Signing up...'
                  : mode === 'login'
                    ? 'Login'
                    : 'Sign Up'}
              </Button>
            </div>
            <div className="text-center text-sm mt-6">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="underline underline-offset-4 cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className="underline underline-offset-4 cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}