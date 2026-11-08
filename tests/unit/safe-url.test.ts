import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isPrivateOrBlockedIp,
  isSafeUrl,
  extractVisibleText,
  fetchPublicPage,
} from '../../supabase/functions/_shared/safe-url';

describe('safe-url SSRF protection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('blocks private, loopback and cloud metadata IP ranges', () => {
    // Loopback
    expect(isPrivateOrBlockedIp('127.0.0.1')).toBe(true);
    expect(isPrivateOrBlockedIp('127.100.0.1')).toBe(true);
    expect(isPrivateOrBlockedIp('::1')).toBe(true);

    // Private networks (RFC 1918)
    expect(isPrivateOrBlockedIp('10.0.0.1')).toBe(true);
    expect(isPrivateOrBlockedIp('172.16.0.1')).toBe(true);
    expect(isPrivateOrBlockedIp('172.31.255.255')).toBe(true);
    expect(isPrivateOrBlockedIp('192.168.1.1')).toBe(true);

    // Cloud metadata service (169.254.169.254)
    expect(isPrivateOrBlockedIp('169.254.169.254')).toBe(true);
    expect(isPrivateOrBlockedIp('169.254.1.1')).toBe(true);
    expect(isPrivateOrBlockedIp('fe80::1')).toBe(true);

    // Public IPs should be allowed
    expect(isPrivateOrBlockedIp('8.8.8.8')).toBe(false);
    expect(isPrivateOrBlockedIp('93.184.216.34')).toBe(false);
    expect(isPrivateOrBlockedIp('172.15.0.1')).toBe(false);
    expect(isPrivateOrBlockedIp('172.32.0.1')).toBe(false);
  });

  it('rejects dangerous protocols, non-standard ports, and local hostnames', async () => {
    // Non-HTTP schemes
    expect((await isSafeUrl('ftp://example.com/dump')).safe).toBe(false);
    expect((await isSafeUrl('file:///etc/hosts')).safe).toBe(false);
    expect((await isSafeUrl('javascript:alert(1)')).safe).toBe(false);
    expect((await isSafeUrl('gopher://example.com')).safe).toBe(false);
    expect((await isSafeUrl('ldap://example.com')).safe).toBe(false);

    // Blocked ports
    expect((await isSafeUrl('http://example.com:22')).safe).toBe(false);
    expect((await isSafeUrl('http://example.com:8080')).safe).toBe(false);
    expect((await isSafeUrl('http://example.com:3000')).safe).toBe(false);

    // Permitted ports
    expect((await isSafeUrl('https://example.com')).safe).toBe(true);
    expect((await isSafeUrl('http://example.com:80')).safe).toBe(true);
    expect((await isSafeUrl('https://example.com:443')).safe).toBe(true);

    // Blocked hosts per Prompt 11 requirements
    expect((await isSafeUrl('http://localhost')).safe).toBe(false);
    expect((await isSafeUrl('http://127.0.0.1')).safe).toBe(false);
    expect((await isSafeUrl('http://169.254.169.254')).safe).toBe(false);
    expect((await isSafeUrl('http://10.0.0.1')).safe).toBe(false);
    expect((await isSafeUrl('http://internal.service.local')).safe).toBe(false);
  });

  it('extracts visible text and strips dangerous tags', () => {
    const html = `
      <div>
        <style>.hide { display: none; }</style>
        <script>alert("hacked");</script>
        <h1>Competitor Headline &amp; Positioning</h1>
        <p>Enterprise SaaS solutions for high-velocity teams.</p>
      </div>
    `;
    const text = extractVisibleText(html);
    expect(text).not.toContain('alert');
    expect(text).not.toContain('.hide');
    expect(text).toContain('Competitor Headline & Positioning');
    expect(text).toContain('Enterprise SaaS solutions for high-velocity teams.');
  });

  it('blocks redirects to private IP addresses in fetchPublicPage', async () => {
    // Mock initial fetch returning a 302 redirect to 127.0.0.1
    const mockFetch = vi.fn().mockResolvedValueOnce({
      status: 302,
      headers: new Headers({
        Location: 'http://127.0.0.1/internal-status',
      }),
      ok: false,
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(fetchPublicPage('https://public-competitor.com')).rejects.toThrow(
      /blocked_url|Target hostname is a private/i,
    );
  });

  it('caps huge responses at 500KB and extracts clean text', async () => {
    // Generate an oversized 800KB text response
    const largeChunk = 'A'.repeat(800 * 1024);
    const mockFetch = vi.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      headers: new Headers({
        'content-type': 'text/html; charset=utf-8',
      }),
      text: async () => `<html><body><p>${largeChunk}</p></body></html>`,
    });
    vi.stubGlobal('fetch', mockFetch);

    const { text } = await fetchPublicPage('https://public-competitor.com');
    // Resulting visible text must be capped at 12,000 chars per architecture limits
    expect(text.length).toBeLessThanOrEqual(12000);
  });
});
