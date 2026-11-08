import { GoogleGenAI } from '@google/genai';
import type { z } from 'zod';
import { HttpError } from './auth.ts';

export interface GenerateJsonOptions<T = unknown> {
  system: string;
  user: string;
  schema?: z.ZodType<T>;
  jsonSchema?: Record<string, unknown>;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

/**
 * Strips markdown code block wrappers (```json ... ```) if returned by the model.
 */
export function cleanJsonText(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('```')) {
    const lines = trimmed.split('\n');
    const filtered = lines.filter((line, idx) => {
      if (idx === 0 && line.startsWith('```')) return false;
      if (idx === lines.length - 1 && line.startsWith('```')) return false;
      return true;
    });
    return filtered.join('\n').trim();
  }
  return trimmed;
}

/**
 * Checks if an error warrants a model fallback (HTTP 429 Rate Limit or HTTP 503 Service Unavailable).
 */
export function isRetryableFallbackError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as { status?: number; code?: number | string; message?: string };
  if (err.status === 429 || err.status === 503) return true;
  if (err.code === 429 || err.code === 503) return true;
  const msg = (err.message || '').toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('resource exhausted') ||
    msg.includes('overloaded') ||
    msg.includes('unavailable')
  );
}

/**
 * Executes a single generation call against Gemini with timeout and error handling.
 */
async function callGeminiModel(
  ai: GoogleGenAI,
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  jsonSchema?: Record<string, unknown>,
  timeoutMs = 30000,
): Promise<string> {
  const startTime = Date.now();

  const generatePromise = ai.models.generateContent({
    model: modelName,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature,
      responseMimeType: 'application/json',
      responseSchema: jsonSchema,
      maxOutputTokens: 2000,
    },
  });

  let timeoutId: number | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new HttpError('upstream_unavailable', `AI model request timed out after ${timeoutMs / 1000}s.`, 504));
    }, timeoutMs) as unknown as number;
  });

  try {
    const result = await Promise.race([generatePromise, timeoutPromise]);
    const durationMs = Date.now() - startTime;
    console.log(`[gemini] model=${modelName} status=200 duration=${durationMs}ms`);
    return result.text || '{}';
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * Primary Gemini JSON generation wrapper per docs/ARCHITECTURE.md section 8.
 * - Tries GEMINI_MODEL
 * - Falls back to GEMINI_FALLBACK_MODEL on 429/503
 * - Enforces JSON schema / Zod validation
 * - Retries once on invalid JSON
 * - 30s timeout
 * - NEVER logs prompt or user content
 */
export async function generateJson<T>(options: GenerateJsonOptions<T>): Promise<T> {
  const deno = (globalThis as unknown as { Deno?: { env: { get(k: string): string | undefined } } }).Deno;
  const apiKey = (deno ? deno.env.get('GEMINI_API_KEY') : process.env.GEMINI_API_KEY) || '';
  if (!apiKey) {
    throw new HttpError('internal_error', 'GEMINI_API_KEY is not configured on the backend.', 500);
  }

  const primaryModel = (deno ? deno.env.get('GEMINI_MODEL') : process.env.GEMINI_MODEL) || 'gemini-2.5-flash';
  const fallbackModel = (deno ? deno.env.get('GEMINI_FALLBACK_MODEL') : process.env.GEMINI_FALLBACK_MODEL) || 'gemini-2.5-flash-lite';
  const temperature = options.temperature ?? 0.3;
  const timeoutMs = options.timeoutMs ?? 30000;

  const ai = new GoogleGenAI({ apiKey });

  // Attempt generation with retry for malformed JSON
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    let rawText = '';
    let usedModel = primaryModel;

    try {
      rawText = await callGeminiModel(
        ai,
        primaryModel,
        options.system,
        options.user,
        temperature,
        options.jsonSchema,
        timeoutMs,
      );
    } catch (err) {
      if (err instanceof HttpError && err.code === 'upstream_unavailable') {
        throw err;
      }

      if (isRetryableFallbackError(err)) {
        console.warn(`[gemini] Primary model ${primaryModel} failed with 429/503. Attempting fallback to ${fallbackModel}`);
        usedModel = fallbackModel;
        try {
          rawText = await callGeminiModel(
            ai,
            fallbackModel,
            options.system,
            options.user,
            temperature,
            options.jsonSchema,
            timeoutMs,
          );
        } catch (fallbackErr) {
          console.error(`[gemini] Fallback model ${fallbackModel} also failed:`, (fallbackErr as Error).message);
          throw new HttpError('upstream_unavailable', 'AI reasoning services are temporarily overloaded. Please try again.', 503);
        }
      } else {
        console.error(`[gemini] Model error on ${usedModel}:`, (err as Error).message);
        throw new HttpError('upstream_unavailable', 'Failed to communicate with AI model.', 503);
      }
    }

    // Parse and validate JSON output
    try {
      const cleaned = cleanJsonText(rawText);
      const parsed = JSON.parse(cleaned);

      if (options.schema) {
        return options.schema.parse(parsed);
      }
      return parsed as T;
    } catch (parseErr) {
      lastError = parseErr;
      console.warn(`[gemini] JSON schema parse failed on attempt ${attempt}. Retrying once.`);
      if (attempt === 2) {
        break;
      }
    }
  }

  console.error('[gemini] Model failed to produce valid JSON adhering to schema after retry:', lastError);
  throw new HttpError('bad_model_output', 'AI model output failed schema validation.', 502);
}
