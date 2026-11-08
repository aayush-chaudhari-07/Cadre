/**
 * CORS handling with strict ALLOWED_ORIGINS allowlist.
 * Per docs/SECURITY.md: Never use wildcard '*' in production.
 */

export function getAllowedOrigins(): string[] {
  // Read from Deno or global env
  const deno = (globalThis as unknown as { Deno?: { env: { get(k: string): string | undefined } } }).Deno;
  const raw = (deno ? deno.env.get('ALLOWED_ORIGINS') : process.env.ALLOWED_ORIGINS) || '';
  const origins = raw
    .split(',')
    .map((o: string) => o.trim())
    .filter(Boolean);

  // If none configured, default to standard local Vite development origin
  if (origins.length === 0) {
    return ['http://localhost:5173'];
  }
  return origins;
}

export function getCorsHeaders(req?: Request): Record<string, string> {
  const allowed = getAllowedOrigins();
  const origin = req?.headers.get('Origin') || '';

  // Only allow origin if it exists in the allowlist
  const isAllowed = origin ? allowed.includes(origin) : false;
  const allowOrigin = isAllowed ? origin : allowed[0] || 'http://localhost:5173';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

/**
 * Handle OPTIONS preflight requests.
 * Returns a 204/200 Response if OPTIONS, or null if another method.
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req),
    });
  }
  return null;
}
