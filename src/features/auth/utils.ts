/**
 * Validates that a redirect path is safe and strictly relative.
 * Rejects absolute URLs, protocol-relative URLs (//), backslash variations (/\),
 * and scheme-injected strings (javascript:, data:), defaulting to /app.
 */
export function validateRedirectPath(path: unknown): string {
  if (typeof path !== 'string') {
    return '/app';
  }

  const trimmed = path.trim();

  // Must start with exactly one forward slash
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return '/app';
  }

  // Reject paths containing protocols or control characters before query/hash
  // e.g. /login?redirect=/foo:bar is okay in query, but /foo:bar/path is suspicious
  const pathWithoutQuery = trimmed.split('?')[0]?.split('#')[0] ?? '';
  if (pathWithoutQuery.includes(':') || pathWithoutQuery.includes('\\')) {
    return '/app';
  }

  return trimmed;
}
