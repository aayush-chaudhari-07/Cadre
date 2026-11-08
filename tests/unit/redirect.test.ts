import { describe, it, expect } from 'vitest';
import { validateRedirectPath } from '@/features/auth/utils';

describe('validateRedirectPath', () => {
  it('allows safe relative paths', () => {
    expect(validateRedirectPath('/app')).toBe('/app');
    expect(validateRedirectPath('/app/leads')).toBe('/app/leads');
    expect(validateRedirectPath('/app/meetings?view=all')).toBe('/app/meetings?view=all');
    expect(validateRedirectPath('/onboarding')).toBe('/onboarding');
  });

  it('rejects protocol-relative URLs (open redirect vector)', () => {
    expect(validateRedirectPath('//evil.com')).toBe('/app');
    expect(validateRedirectPath('//attacker.com/app')).toBe('/app');
  });

  it('rejects backslash evasion techniques', () => {
    expect(validateRedirectPath('/\\evil.com')).toBe('/app');
    expect(validateRedirectPath('/app\\something')).toBe('/app');
  });

  it('rejects external absolute URLs', () => {
    expect(validateRedirectPath('https://malicious.example.com')).toBe('/app');
    expect(validateRedirectPath('http://malicious.example.com/app')).toBe('/app');
  });

  it('rejects dangerous URI schemes', () => {
    expect(validateRedirectPath('javascript:alert(1)')).toBe('/app');
    expect(validateRedirectPath('/javascript:alert(1)')).toBe('/app');
    expect(validateRedirectPath('data:text/html,<html>')).toBe('/app');
  });

  it('falls back to /app on empty, null or invalid inputs', () => {
    expect(validateRedirectPath('')).toBe('/app');
    expect(validateRedirectPath('   ')).toBe('/app');
    expect(validateRedirectPath(null)).toBe('/app');
    expect(validateRedirectPath(undefined)).toBe('/app');
    expect(validateRedirectPath(12345)).toBe('/app');
    expect(validateRedirectPath({})).toBe('/app');
  });
});

