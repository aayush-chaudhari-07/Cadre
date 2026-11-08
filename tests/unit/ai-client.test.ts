import { describe, it, expect } from 'vitest';
import { AiError, ERROR_MESSAGES } from '@/lib/ai';

describe('AI Client Error Handling', () => {
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
});

