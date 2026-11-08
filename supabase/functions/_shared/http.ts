import { getCorsHeaders } from './cors.ts';

export type ErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'invalid_input'
  | 'quota_exceeded'
  | 'bad_model_output'
  | 'upstream_unavailable'
  | 'blocked_url'
  | 'internal_error';

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
  };
}

/**
 * Standard JSON response helper with CORS and content-type headers.
 */
export function json<T>(data: T, status = 200, req?: Request): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Standard error response helper adhering to { error: { code, message } } shape.
 */
export function error(
  code: ErrorCode,
  message: string,
  status = 400,
  req?: Request,
): Response {
  const body: ErrorResponse = {
    error: {
      code,
      message,
    },
  };
  return json(body, status, req);
}

