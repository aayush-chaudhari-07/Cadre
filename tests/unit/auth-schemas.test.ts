import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/features/auth/schemas';
import { workspaceSchema } from '@/features/workspace/schemas';

describe('Auth & Workspace Form Schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const res = loginSchema.safeParse({
        email: 'founder@cadre.example',
        password: 'securepassword123',
      });
      expect(res.success).toBe(true);
    });

    it('rejects invalid emails and empty passwords', () => {
      const invalidEmail = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(invalidEmail.success).toBe(false);

      const emptyPassword = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      });
      expect(emptyPassword.success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    it('accepts valid signup input with terms agreed', () => {
      const res = signupSchema.safeParse({
        displayName: 'Jane Doe',
        email: 'jane@enterprise.example',
        password: 'superSecretPassword99',
        terms: true,
      });
      expect(res.success).toBe(true);
    });

    it('rejects short display names', () => {
      const res = signupSchema.safeParse({
        displayName: 'J',
        email: 'jane@enterprise.example',
        password: 'superSecretPassword99',
        terms: true,
      });
      expect(res.success).toBe(false);
    });

    it('rejects passwords under 8 characters', () => {
      const res = signupSchema.safeParse({
        displayName: 'Jane Doe',
        email: 'jane@enterprise.example',
        password: 'short',
        terms: true,
      });
      expect(res.success).toBe(false);
    });

    it('requires terms to be true', () => {
      const res = signupSchema.safeParse({
        displayName: 'Jane Doe',
        email: 'jane@enterprise.example',
        password: 'superSecretPassword99',
        terms: false,
      });
      expect(res.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('validates email format', () => {
      expect(forgotPasswordSchema.safeParse({ email: 'test@domain.com' }).success).toBe(true);
      expect(forgotPasswordSchema.safeParse({ email: 'bad-email' }).success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('accepts matching passwords >= 8 chars', () => {
      const res = resetPasswordSchema.safeParse({
        password: 'newSecurePassword2026',
        confirmPassword: 'newSecurePassword2026',
      });
      expect(res.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const res = resetPasswordSchema.safeParse({
        password: 'newSecurePassword2026',
        confirmPassword: 'differentPassword123',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0]?.message).toBe('Passwords do not match');
      }
    });

    it('rejects passwords under 8 characters', () => {
      const res = resetPasswordSchema.safeParse({
        password: 'short',
        confirmPassword: 'short',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('workspaceSchema', () => {
    it('accepts valid workspace names and sample data flag', () => {
      const res = workspaceSchema.safeParse({
        name: 'Apex Growth Labs',
        startWithSampleData: true,
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.startWithSampleData).toBe(true);
      }
    });

    it('rejects names shorter than 2 or longer than 80 characters', () => {
      expect(workspaceSchema.safeParse({ name: 'A' }).success).toBe(false);
      expect(workspaceSchema.safeParse({ name: 'a'.repeat(81) }).success).toBe(false);
    });
  });
});
