import { describe, it, expect } from 'vitest';
import { isPrivateOrBlockedIp, isSafeUrl, extractVisibleText } from '../../supabase/functions/_shared/safe-url';

describe('safe-url SSRF protection', () => {
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
    // Protocols
    expect((await isSafeUrl('ftp://example.com/dump')).safe).toBe(false);
    expect((await isSafeUrl('file:///etc/hosts')).safe).toBe(false);
    expect((await isSafeUrl('javascript:alert(1)')).safe).toBe(false);

    // Ports
    expect((await isSafeUrl('http://example.com:22')).safe).toBe(false);
    expect((await isSafeUrl('http://example.com:8080')).safe).toBe(false);
    expect((await isSafeUrl('http://example.com:3000')).safe).toBe(false);

    // Permitted ports
    expect((await isSafeUrl('https://example.com')).safe).toBe(true);
    expect((await isSafeUrl('http://example.com:80')).safe).toBe(true);
    expect((await isSafeUrl('https://example.com:443')).safe).toBe(true);

    // Local hostnames and direct IP targets
    expect((await isSafeUrl('http://localhost')).safe).toBe(false);
    expect((await isSafeUrl('http://127.0.0.1')).safe).toBe(false);
    expect((await isSafeUrl('http://169.254.169.254/latest')).safe).toBe(false);
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
});
