import { describe, it, expect, vi } from 'vitest';
import { scrubPii, captureException, initSentry } from '@/lib/sentry';

describe('Sentry Client & PII Scrubbing (sentry.ts)', () => {
  it('scrubs email addresses from error messages', () => {
    const raw = 'Failed to process request for user alex.morgan@cadre-enterprise.com on account';
    const clean = scrubPii(raw);
    expect(clean).not.toContain('alex.morgan@cadre-enterprise.com');
    expect(clean).toContain('[REDACTED_EMAIL]');
  });

  it('scrubs JWT tokens and Bearer headers', () => {
    const raw = 'Auth error with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.signature12345';
    const clean = scrubPii(raw);
    expect(clean).not.toContain('eyJhbGci');
    expect(clean).toContain('Bearer [REDACTED]');
  });

  it('scrubs IPv4 addresses', () => {
    const raw = 'Database connection failed to 192.168.1.55 on port 5432';
    const clean = scrubPii(raw);
    expect(clean).not.toContain('192.168.1.55');
    expect(clean).toContain('[REDACTED_IP]');
  });

  it('scrubs API keys and passwords', () => {
    const raw = 'Exception occurred while evaluating api_key="secret-api-key-value" in function';
    const clean = scrubPii(raw);
    expect(clean).not.toContain('secret-api-key-value');
    expect(clean).toContain('[REDACTED_SECRET]');
  });

  it('does nothing when VITE_SENTRY_DSN is absent', async () => {
    initSentry();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await captureException(new Error('Sample test error'));
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

