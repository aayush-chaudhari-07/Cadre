import { describe, it, expect } from 'vitest';
import {
  profileFormSchema,
  workspaceFormSchema,
  passwordChangeSchema,
  deleteAccountFormSchema,
} from '@/features/settings/schemas';

describe('Settings Validation Schemas', () => {
  describe('profileFormSchema', () => {
    it('accepts valid display name and avatar url', () => {
      const valid = {
        display_name: 'Alex Morgan',
        avatar_url: 'https://example.com/avatar.png',
      };
      expect(profileFormSchema.safeParse(valid).success).toBe(true);
    });

    it('accepts empty avatar url string', () => {
      const valid = {
        display_name: 'Alex Morgan',
        avatar_url: '',
      };
      expect(profileFormSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects empty display name or invalid url', () => {
      expect(profileFormSchema.safeParse({ display_name: '' }).success).toBe(false);
      expect(
        profileFormSchema.safeParse({
          display_name: 'Valid Name',
          avatar_url: 'not-a-valid-url',
        }).success,
      ).toBe(false);
    });
  });

  describe('workspaceFormSchema', () => {
    it('validates workspace name bounds', () => {
      expect(workspaceFormSchema.safeParse({ name: 'Acme RevOps' }).success).toBe(true);
      expect(workspaceFormSchema.safeParse({ name: 'A' }).success).toBe(false); // too short
      expect(workspaceFormSchema.safeParse({ name: 'a'.repeat(65) }).success).toBe(false); // too long
    });
  });

  describe('passwordChangeSchema', () => {
    it('accepts matching passwords with 8+ characters', () => {
      const valid = {
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
      };
      expect(passwordChangeSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const invalid = {
        password: 'ValidPassword123!',
        confirmPassword: 'DifferentPassword456!',
      };
      const result = passwordChangeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe('Passwords do not match.');
      }
    });

    it('rejects passwords shorter than 8 characters', () => {
      const invalid = {
        password: 'short',
        confirmPassword: 'short',
      };
      expect(passwordChangeSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('deleteAccountFormSchema', () => {
    it('only accepts exact uppercase literal "DELETE"', () => {
      expect(deleteAccountFormSchema.safeParse({ confirmation: 'DELETE' }).success).toBe(true);
      expect(deleteAccountFormSchema.safeParse({ confirmation: 'delete' }).success).toBe(false);
      expect(deleteAccountFormSchema.safeParse({ confirmation: 'Delete' }).success).toBe(false);
      expect(deleteAccountFormSchema.safeParse({ confirmation: 'REMOVE' }).success).toBe(false);
      expect(deleteAccountFormSchema.safeParse({ confirmation: '' }).success).toBe(false);
    });
  });
});

