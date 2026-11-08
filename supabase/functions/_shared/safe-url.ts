import { HttpError } from './auth.ts';

/**
 * Checks whether an IPv4 or IPv6 address is in a private, loopback,
 * link-local, or multicast reserved block per docs/SECURITY.md Section 7.
 */
export function isPrivateOrBlockedIp(ip: string): boolean {
  const cleanIp = ip.trim().toLowerCase();

  // Handle IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
  if (cleanIp.startsWith('::ffff:')) {
    return isPrivateOrBlockedIp(cleanIp.replace('::ffff:', ''));
  }

  // IPv6 Checks
  if (cleanIp.includes(':')) {
    if (cleanIp === '::1' || cleanIp === '0:0:0:0:0:0:0:1') return true; // Loopback
    if (cleanIp === '::') return true; // Unspecified
    if (cleanIp.startsWith('fc') || cleanIp.startsWith('fd')) return true; // Unique local (fc00::/7)
    if (
      cleanIp.startsWith('fe8') ||
      cleanIp.startsWith('fe9') ||
      cleanIp.startsWith('fea') ||
      cleanIp.startsWith('feb')
    ) {
      return true; // Link-local (fe80::/10)
    }
    if (cleanIp.startsWith('ff')) return true; // Multicast
    return false;
  }

  // IPv4 Checks
  const parts = cleanIp.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(isNaN)) {
    return true; // Malformed IPv4 is treated as blocked
  }

  const [a, b] = parts;
  if (a === undefined || b === undefined) return true;

  if (a === 0) return true; // Current network
  if (a === 127) return true; // Loopback (127.0.0.0/8)
  if (a === 10) return true; // Private (10.0.0.0/8)
  if (a === 172 && b >= 16 && b <= 31) return true; // Private (172.16.0.0/12)
  if (a === 192 && b === 168) return true; // Private (192.168.0.0/16)
  if (a === 169 && b === 254) return true; // Link-local / Cloud metadata (169.254.0.0/16)
  if (a >= 224 && a <= 239) return true; // Multicast
  if (a >= 240) return true; // Reserved

  return false;
}

/**
 * Validates a target URL against SSRF attacks.
 * Blocks non-http/https, non-standard ports (allowed: 80, 443),
 * local hostnames, and IP resolutions pointing to private ranges.
 */
export async function isSafeUrl(urlString: string): Promise<{ safe: boolean; reason?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { safe: false, reason: 'Invalid URL format.' };
  }

  // Scheme check: only http or https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { safe: false, reason: `Forbidden URL scheme: ${parsed.protocol}` };
  }

  // Port check: must be default, 80, or 443
  const port = parsed.port;
  if (port && port !== '80' && port !== '443') {
    return { safe: false, reason: `Forbidden port: ${port}. Only 80 and 443 are permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Hostname string checks
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.arpa')
  ) {
    return { safe: false, reason: 'Local and internal hostnames are prohibited.' };
  }

  // Direct IP in hostname
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':')) {
    if (isPrivateOrBlockedIp(hostname)) {
      return { safe: false, reason: 'Target hostname is a private or restricted IP address.' };
    }
    return { safe: true };
  }

  // DNS Resolution check (Deno environment)
  const deno = (globalThis as unknown as { Deno?: { resolveDns(h: string, r: string): Promise<string[]> } }).Deno;
  if (deno && typeof deno.resolveDns === 'function') {
    try {
      const aIps = await deno.resolveDns(hostname, 'A').catch(() => [] as string[]);
      const aaaaIps = await deno.resolveDns(hostname, 'AAAA').catch(() => [] as string[]);
      const allIps = [...aIps, ...aaaaIps];

      if (allIps.length === 0) {
        return { safe: false, reason: 'DNS resolution yielded no IP addresses.' };
      }

      for (const ip of allIps) {
        if (isPrivateOrBlockedIp(ip)) {
          return { safe: false, reason: `Resolved to blocked IP address: ${ip}` };
        }
      }
    } catch {
      return { safe: false, reason: 'DNS resolution failed.' };
    }
  }

  return { safe: true };
}

/**
 * Strips HTML tags, scripts, and styling to extract clean visible text.
 */
export function extractVisibleText(html: string): string {
  // Strip scripts, styles, SVGs, and comments
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode standard HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Collapse multiple whitespaces
  text = text.replace(/\s+/g, ' ').trim();

  // Cap at ~12,000 characters per docs/ARCHITECTURE.md Section 9
  return text.slice(0, 12000);
}

/**
 * Fetches a public competitor page with strict SSRF controls:
 * - Follows at most 3 redirects, re-checking isSafeUrl on each hop
 * - 8-second timeout
 * - Max 500KB response payload
 * - HTML or text content-type required
 * - Returns clean visible text capped at 12,000 chars
 */
export async function fetchPublicPage(
  initialUrl: string,
): Promise<{ text: string; finalUrl: string }> {
  let currentUrl = initialUrl;
  const maxRedirects = 3;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const safety = await isSafeUrl(currentUrl);
    if (!safety.safe) {
      throw new HttpError('blocked_url', safety.reason || 'Restricted target URL.', 400);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let res: Response;
    try {
      res = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'CadreBot/1.0 (+https://cadre.ai; competitive-intelligence)',
          'Accept': 'text/html,application/xhtml+xml,text/plain;q=0.9',
        },
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if ((err as Error).name === 'AbortError') {
        throw new HttpError('blocked_url', 'Request timed out after 8 seconds.', 400);
      }
      throw new HttpError('blocked_url', `Failed to connect to target URL: ${(err as Error).message}`, 400);
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle Redirects
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('Location');
      if (!location) {
        throw new HttpError('blocked_url', 'Redirect response missing Location header.', 400);
      }
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    if (!res.ok) {
      throw new HttpError('blocked_url', `Target returned HTTP status ${res.status}.`, 400);
    }

    // Content-Type validation
    const contentType = res.headers.get('content-type') || '';
    if (
      !contentType.includes('text/html') &&
      !contentType.includes('text/plain') &&
      !contentType.includes('application/xhtml+xml')
    ) {
      throw new HttpError('blocked_url', `Unsupported content type: ${contentType}`, 400);
    }

    // Read at most 500KB (512,000 bytes)
    const reader = res.body?.getReader();
    if (!reader) {
      const fullText = await res.text();
      return { text: extractVisibleText(fullText), finalUrl: currentUrl };
    }

    const maxBytes = 500 * 1024;
    let bytesReceived = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        bytesReceived += value.length;
        chunks.push(value);
        if (bytesReceived > maxBytes) {
          reader.cancel();
          break;
        }
      }
    }

    const merged = new Uint8Array(Math.min(bytesReceived, maxBytes));
    let offset = 0;
    for (const chunk of chunks) {
      const toCopy = Math.min(chunk.length, merged.length - offset);
      merged.set(chunk.subarray(0, toCopy), offset);
      offset += toCopy;
      if (offset >= merged.length) break;
    }

    const html = new TextDecoder('utf-8').decode(merged);
    return {
      text: extractVisibleText(html),
      finalUrl: currentUrl,
    };
  }

  throw new HttpError('blocked_url', 'Exceeded maximum redirect limit (3).', 400);
}
