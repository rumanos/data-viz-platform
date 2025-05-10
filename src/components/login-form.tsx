import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signInWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth'
import { auth, getFirebaseAuthErrorMessage } from '../lib/firebase'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface LoginFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onLoginError?: (error: string) => void
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm({
  className,
  onLoginError,
  ...props
}: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const navigate = useNavigate()

  const validate = (values: typeof formValues): FormErrors => {
    const errors: FormErrors = {}
    // Email validation
    if (!values.email) {
      errors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Please enter a valid email address.'
    }
    // Password validation
    if (!values.password) {
      errors.password = 'Password is required.'
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }
    return errors
  }

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
    e.preventDefault()
    setLoading(true)
    const errors = validate(formValues)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      setLoading(false)
      return
    }
    try {
      await signInWithEmailAndPassword(auth, formValues.email, formValues.password)
      navigate('/dashboard')
    } catch (err: any) {
      const errorMsg = getFirebaseAuthErrorMessage(err.code || err.message || '')
      setFormErrors((prev) => ({ ...prev, general: errorMsg }))
      onLoginError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setFormErrors((prev) => ({ ...prev, general: undefined }))
    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
      // Note: The redirect will happen here, so the code below won't execute
      // The auth state change will be handled by your app's auth listener
    } catch (err: any) {
      const errorMsg = getFirebaseAuthErrorMessage(err.code || err.message || '')
      setFormErrors((prev) => ({ ...prev, general: errorMsg }))
      onLoginError?.(errorMsg)
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

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props} noValidate>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
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
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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
        {formErrors.general && (
          <div className="text-xs text-destructive text-start">{formErrors.general}</div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
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
          {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
