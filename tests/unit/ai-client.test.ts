import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

import { AiError, ERROR_MESSAGES, analyzeLead } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

describe('AI Client Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('instantiates AiError with code, message, and status', () => {
    const err = new AiError('quota_exceeded', 'Daily limit reached', 429);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AiError');
    expect(err.code).toBe('quota_exceeded');
    expect(err.message).toBe('Daily limit reached');
    expect(err.status).toBe(429);
  });

  it('maps all defined architecture error codes to friendly messages', () => {
    const requiredCodes = [
      'unauthorized',
      'forbidden',
      'invalid_input',
      'quota_exceeded',
      'bad_model_output',
      'upstream_unavailable',
      'blocked_url',
      'internal_error',
    ];

    for (const code of requiredCodes) {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(ERROR_MESSAGES[code]!.length).toBeGreaterThan(10);
    }
  });

  it('maps Edge Function error response to friendly error messages without network call', async () => {
    const mockInvoke = vi.mocked(supabase.functions.invoke);

    // Test error with context code
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: {
        message: 'Rate limited',
        name: 'FunctionsHttpError',
        context: {
          json: async () => ({ error: { code: 'quota_exceeded' } }),
        },
      } as unknown as Error,
    });

    await expect(
      analyzeLead({
        orgId: 'org-123',
        leadId: '123',
        company: 'Acme Corp',
        leadText: 'Interested in enterprise plan',
      }),
    ).rejects.toThrow(ERROR_MESSAGES.quota_exceeded);

    // Test data-level error payload
    mockInvoke.mockResolvedValueOnce({
      data: {
        error: { code: 'unauthorized', message: 'Token expired' },
      } as unknown as Record<string, unknown>,
      error: null,
    });

    await expect(
      analyzeLead({
        orgId: 'org-123',
        leadId: '456',
        company: 'Beta Inc',
        leadText: 'Trial follow-up',
      }),
    ).rejects.toThrow(ERROR_MESSAGES.unauthorized);

    // Test fallback to upstream_unavailable for generic errors
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: {
        message: 'Network connection failure',
        name: 'FunctionsFetchError',
      } as unknown as Error,
    });

    await expect(
      analyzeLead({
        orgId: 'org-123',
        leadId: '789',
        company: 'Gamma LLC',
        leadText: 'Inquiry',
      }),
    ).rejects.toThrow(ERROR_MESSAGES.upstream_unavailable);
  });
});
