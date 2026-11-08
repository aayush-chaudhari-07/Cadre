import { assertEquals } from '@std/assert';
import { cleanJsonText, isRetryableFallbackError } from '../gemini.ts';

Deno.test('cleanJsonText: strips markdown code fences cleanly', () => {
  const inputWithFences = '```json\n{\n  "score": 92,\n  "summary": "High urgency"\n}\n```';
  const cleaned = cleanJsonText(inputWithFences);
  assertEquals(cleaned, '{\n  "score": 92,\n  "summary": "High urgency"\n}');

  const inputWithoutFences = '{"score": 92}';
  assertEquals(cleanJsonText(inputWithoutFences), '{"score": 92}');

  const inputWithPlainFences = '```\n{"score": 92}\n```';
  assertEquals(cleanJsonText(inputWithPlainFences), '{"score": 92}');
});

Deno.test('isRetryableFallbackError: identifies 429 rate limit and 503 unavailable errors', () => {
  // HTTP status codes
  assertEquals(isRetryableFallbackError({ status: 429 }), true);
  assertEquals(isRetryableFallbackError({ status: 503 }), true);
  assertEquals(isRetryableFallbackError({ code: 429 }), true);
  assertEquals(isRetryableFallbackError({ code: 503 }), true);

  // Message string detection
  assertEquals(isRetryableFallbackError(new Error('Quota exceeded for quota metric')), true);
  assertEquals(isRetryableFallbackError(new Error('RESOURCE_EXHAUSTED')), true);
  assertEquals(isRetryableFallbackError(new Error('Model is currently overloaded')), true);
  assertEquals(isRetryableFallbackError(new Error('Service Unavailable: 503')), true);

  // Non-retryable errors
  assertEquals(isRetryableFallbackError({ status: 400 }), false);
  assertEquals(isRetryableFallbackError({ status: 401 }), false);
  assertEquals(isRetryableFallbackError({ status: 404 }), false);
  assertEquals(isRetryableFallbackError(new Error('Invalid argument provided')), false);
  assertEquals(isRetryableFallbackError(null), false);
  assertEquals(isRetryableFallbackError(undefined), false);
});

