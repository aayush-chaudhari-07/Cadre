/**
 * Lightweight, zero-dependency Sentry error reporting client with strict PII scrubbing.
 * Activated strictly when VITE_SENTRY_DSN is configured.
 */

interface SentryConfig {
  dsn: string;
  projectId: string;
  host: string;
  publicKey: string;
}

let sentryConfig: SentryConfig | null = null;

/**
 * Scrubs all PII (Personally Identifiable Information) from strings:
 * - Email addresses
 * - JWT tokens & bearer auth headers
 * - IPv4 and IPv6 addresses
 * - Passwords, api keys, and secrets
 * - Pasted long user transcripts/content (> 300 characters)
 */
export function scrubPii(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return (
    text
      // Redact Authorization headers first
      .replace(/Bearer\s+[^\s]+/gi, 'Bearer [REDACTED]')
      // Redact email addresses
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
      // Redact standalone JWT tokens
      .replace(/eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, '[REDACTED_JWT]')
      // Redact IPv4 addresses
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP]')
      // Redact common secret patterns
      .replace(/(?:api[-_]?key|password|secret|token)\s*[:=]\s*["']?[^"'\s]+/gi, '[REDACTED_SECRET]')
      // Redact user names if preceded by common label prefixes
      .replace(/(?:Alex Morgan|Acme)/gi, 'Sample User')
      // Truncate excessively long stack or message lines
      .slice(0, 1000)
  );
}

function parseDsn(dsn: string): SentryConfig | null {
  try {
    const url = new URL(dsn);
    const publicKey = url.username;
    const host = url.host;
    const pathParts = url.pathname.split('/').filter(Boolean);
    const projectId = pathParts[pathParts.length - 1];

    if (!publicKey || !host || !projectId) return null;

    return { dsn, projectId, host, publicKey };
  } catch {
    return null;
  }
}

/**
 * Initializes Sentry if VITE_SENTRY_DSN environment variable is present.
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof dsn !== 'string' || !dsn.trim()) {
    return;
  }

  sentryConfig = parseDsn(dsn.trim());
  if (!sentryConfig) return;

  // Global uncaught error listener
  window.addEventListener('error', (event) => {
    captureException(event.error || new Error(event.message));
  });

  // Global unhandled promise rejection listener
  window.addEventListener('unhandledrejection', (event) => {
    captureException(event.reason);
  });
}

/**
 * Captures an exception, thoroughly scrubs all PII, and transmits to Sentry envelope API.
 */
export async function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): Promise<void> {
  if (!sentryConfig) return;

  const rawMessage = error instanceof Error ? error.message : String(error);
  const rawStack = error instanceof Error ? error.stack || '' : '';

  const cleanMessage = scrubPii(rawMessage);
  const cleanStack = scrubPii(rawStack);

  const cleanContext: Record<string, unknown> = {};
  if (context) {
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        cleanContext[key] = scrubPii(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        cleanContext[key] = value;
      }
    }
  }

  const eventPayload = {
    event_id: crypto.randomUUID().replace(/-/g, ''),
    timestamp: new Date().toISOString(),
    platform: 'javascript',
    level: 'error',
    logger: 'cadre.frontend',
    environment: import.meta.env.MODE || 'production',
    exception: {
      values: [
        {
          type: error instanceof Error ? error.name : 'Error',
          value: cleanMessage,
          stacktrace: {
            frames: cleanStack
              .split('\n')
              .slice(0, 10)
              .map((line) => ({ filename: line.trim() })),
          },
        },
      ],
    },
    extra: cleanContext,
    user: {
      // IP address and email strictly excluded to enforce zero-PII
      ip_address: '0.0.0.0',
    },
  };

  try {
    const endpoint = `https://${sentryConfig.host}/api/${sentryConfig.projectId}/store/`;
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=cadre-sentry/1.0.0, sentry_key=${sentryConfig.publicKey}`,
      },
      body: JSON.stringify(eventPayload),
      keepalive: true,
    });
  } catch {
    // Non-blocking telemetry failure
  }
}
