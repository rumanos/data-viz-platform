import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signInWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth'
import { auth, getFirebaseAuthErrorMessage, signUpWithEmailAndPassword, sendResetPasswordEmail } from '../lib/firebase'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

type AuthMode = 'login' | 'signup';

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

export function AuthForm({ mode, onModeChange, className, onAuthError, ...props }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleModeChange = (newMode: AuthMode) => {
    setFormValues(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
    setFormErrors(prev => ({
      ...prev,
      password: undefined,
      confirmPassword: undefined
    }));
    onModeChange(newMode);
  };

  const validate = (values: typeof formValues): FormErrors => {
    const errors: FormErrors = {};
    // Email validation
    if (!values.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    // Password validation
    if (!values.password) {
      errors.password = 'Password is required.';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (mode === 'signup') {
      // Confirm password validation
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    const errors = validate(formValues)
    setFormErrors((prev) => ({ ...prev, [name]: errors[name as keyof FormErrors] }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const errors = validate(formValues);
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
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = getFirebaseAuthErrorMessage(err.code || err.message || '');
      setFormErrors((prev) => ({ ...prev, general: errorMsg }));
      onAuthError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setFormErrors((prev) => ({ ...prev, general: undefined }))
    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
      // Note: The redirect will happen here, so the code below won't execute
      // The auth state change will be handled by the app's auth listener
    } catch (err: any) {
      const errorMsg = getFirebaseAuthErrorMessage(err.code || err.message || '')
      setFormErrors((prev) => ({ ...prev, general: errorMsg }))
      onAuthError?.(errorMsg)
    } finally {
      setGoogleLoading(false)
    }
  }

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result) {
        // User successfully signed in
        navigate('/dashboard')
      }
    }).catch((error) => {
      // Handle any errors
      console.error('Redirect sign-in error:', error)
    })
  }, [navigate])

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowResetDialog(true);
    setResetEmail(formValues.email || '');
    setResetError(null);
    setResetSuccess(null);
  };

  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value);
    setResetError(null);
    setResetSuccess(null);
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setResetError(getFirebaseAuthErrorMessage(err.code || err.message || ''));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)} {...props} noValidate>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          layout
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeInOut', type: 'spring' }}
        >
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
          <div className="grid gap-6 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                value={formValues.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? 'email-error' : undefined}
                required
              />
              {formErrors.email && (
                <span id="email-error" className="text-xs text-destructive mt-1">{formErrors.email}</span>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {mode === 'login' && (
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={formValues.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? 'password-error' : undefined}
                required
              />
              {formErrors.password && (
                <span id="password-error" className="text-xs text-destructive mt-1">{formErrors.password}</span>
              )}
            </div>
            {mode === 'signup' && (
              <motion.div
                key="confirmPassword"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="grid gap-2"
              >
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!formErrors.confirmPassword}
                  aria-describedby={formErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                  required
                />
                {formErrors.confirmPassword && (
                  <span id="confirmPassword-error" className="text-xs text-destructive mt-1">{formErrors.confirmPassword}</span>
                )}
              </motion.div>
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
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Button variant="outline" className="w-full" type="button" disabled={loading || googleLoading} onClick={handleGoogleSignIn} aria-busy={googleLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-5 w-5 inline-block align-text-bottom">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              {googleLoading
                ? mode === 'login'
                  ? 'Signing in with Google...'
                  : 'Signing up with Google...'
                : 'Continue with Google'}
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
        </motion.div>
      </AnimatePresence>
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a password reset link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendResetEmail} className="space-y-4">
            <Input
              id="resetEmail"
              name="resetEmail"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              value={resetEmail}
              onChange={handleResetEmailChange}
              required
              disabled={resetLoading}
            />
            {resetError && <div className="text-xs text-destructive">{resetError}</div>}
            {resetSuccess && <div className="text-xs text-green-600">{resetSuccess}</div>}
            <DialogFooter>
              <Button type="submit" disabled={resetLoading} className="w-full">
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </form>
  );
}

// For backward compatibility, export LoginForm as AuthForm in login mode
export function LoginForm(props: Omit<AuthFormProps, 'mode'>) {
  return <AuthForm mode="login" {...props} />;
}
