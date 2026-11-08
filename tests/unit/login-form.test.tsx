import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<void> | void;
  serverError?: string | null;
}

function TestLoginForm({ onSubmit, serverError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <div className="p-4 max-w-sm">
      {serverError && (
        <div role="alert" className="text-red-500">
          <AlertCircle />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email && <p role="alert">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
          {errors.password && <p role="alert">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

describe('Component: Login Form', () => {
  it('renders email and password inputs with proper accessible labels', () => {
    render(<TestLoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates invalid email format and shows error message', async () => {
    render(<TestLoginForm onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility when eye button is clicked', () => {
    render(<TestLoginForm onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('password');
  });

  it('displays server error banner when passed', () => {
    render(<TestLoginForm onSubmit={vi.fn()} serverError="Invalid login credentials" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/invalid login credentials/i);
  });

  it('submits valid input credentials', async () => {
    const handleLogin = vi.fn();
    render(<TestLoginForm onSubmit={handleLogin} />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'founder@northwind.io' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'SuperSecret123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith(
        {
          email: 'founder@northwind.io',
          password: 'SuperSecret123!',
        },
        expect.anything(),
      );
    });
  });
});
