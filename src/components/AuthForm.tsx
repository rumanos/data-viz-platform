import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthMode = 'login' | 'signup' | 'resetPassword';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (data: { email: string; password?: string }) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
}

export function AuthForm({ mode, onModeChange, onGoogleSignIn }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '', confirmPassword: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        email: formValues.email,
        password: mode !== 'resetPassword' ? formValues.password : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'resetPassword') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Enter your email to receive a reset link</p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <button
            type="button"
            onClick={() => onModeChange('login')}
            className="text-sm underline"
          >
            Back to Login
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>
      </div>

      {onGoogleSignIn && (
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleSignIn}
          disabled={loading}
        >
          Continue with Google
        </Button>
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => onModeChange('resetPassword')}
                className="text-sm underline"
              >
                Forgot password?
              </button>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
        </div>

        {mode === 'signup' && (
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading
            ? mode === 'login'
              ? 'Signing in...'
              : 'Creating account...'
            : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
        </Button>

        <button
          type="button"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="text-sm underline"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </form>
  );
}
