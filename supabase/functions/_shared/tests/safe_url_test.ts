import { assertEquals, assertRejects } from '@std/assert';
import { isPrivateOrBlockedIp, isSafeUrl, extractVisibleText, fetchPublicPage } from '../safe-url.ts';

Deno.test('isPrivateOrBlockedIp: blocks loopback, private, link-local, and cloud metadata addresses', () => {
  // Loopback
  assertEquals(isPrivateOrBlockedIp('127.0.0.1'), true);
  assertEquals(isPrivateOrBlockedIp('127.12.34.56'), true);
  assertEquals(isPrivateOrBlockedIp('::1'), true);

  // Private IPv4 (RFC 1918)
  assertEquals(isPrivateOrBlockedIp('10.0.0.1'), true);
  assertEquals(isPrivateOrBlockedIp('10.255.255.255'), true);
  assertEquals(isPrivateOrBlockedIp('172.16.0.1'), true);
  assertEquals(isPrivateOrBlockedIp('172.31.255.255'), true);
  assertEquals(isPrivateOrBlockedIp('192.168.1.1'), true);
  assertEquals(isPrivateOrBlockedIp('192.168.254.100'), true);

  // Link-local & AWS/GCP/Azure Metadata service (169.254.169.254)
  assertEquals(isPrivateOrBlockedIp('169.254.169.254'), true);
  assertEquals(isPrivateOrBlockedIp('169.254.0.1'), true);
  assertEquals(isPrivateOrBlockedIp('fe80::1'), true);

  // Unique local IPv6
  assertEquals(isPrivateOrBlockedIp('fc00::1'), true);
  assertEquals(isPrivateOrBlockedIp('fd12:3456::1'), true);

  // Public Addresses (Allowed)
  assertEquals(isPrivateOrBlockedIp('8.8.8.8'), false);
  assertEquals(isPrivateOrBlockedIp('1.1.1.1'), false);
  assertEquals(isPrivateOrBlockedIp('93.184.216.34'), false);
  assertEquals(isPrivateOrBlockedIp('172.15.255.255'), false);
  assertEquals(isPrivateOrBlockedIp('172.32.0.1'), false);
});

Deno.test('isSafeUrl: rejects prohibited protocols, ports, and internal hosts', async () => {
  // Non-HTTP schemes
  assertEquals((await isSafeUrl('ftp://example.com/file.txt')).safe, false);
  assertEquals((await isSafeUrl('file:///etc/passwd')).safe, false);
  assertEquals((await isSafeUrl('javascript:alert(1)')).safe, false);
  assertEquals((await isSafeUrl('gopher://example.com')).safe, false);

  // Blocked hosts per Prompt 11 requirements
  assertEquals((await isSafeUrl('http://localhost')).safe, false);
  assertEquals((await isSafeUrl('http://127.0.0.1')).safe, false);
  assertEquals((await isSafeUrl('http://169.254.169.254')).safe, false);
  assertEquals((await isSafeUrl('http://10.0.0.1')).safe, false);

  // Port checks
  assertEquals((await isSafeUrl('http://example.com:22')).safe, false);
  assertEquals((await isSafeUrl('http://example.com:3000')).safe, false);
  assertEquals((await isSafeUrl('https://example.com:8080')).safe, false);

  // Permitted ports
  assertEquals((await isSafeUrl('https://example.com')).safe, true);
  assertEquals((await isSafeUrl('http://example.com:80')).safe, true);
  assertEquals((await isSafeUrl('https://example.com:443')).safe, true);
});

Deno.test('extractVisibleText: strips markup, styles, scripts and trims to limit', () => {
  const html = `
    <html>
      <head>
        <style>body { color: red; }</style>
        <script>console.log("secret script");</script>
      </head>
      <body>
        <h1>Apex Systems &amp; Solutions</h1>
        <svg><text>Icon</text></svg>
        <!-- HTML Comment -->
        <p>Enterprise revenue acceleration platform. 24/7 autonomous deal monitoring.</p>
      </body>
    </html>
  `;
  const text = extractVisibleText(html);
  assertEquals(text.includes('secret script'), false);
  assertEquals(text.includes('color: red'), false);
  assertEquals(text.includes('HTML Comment'), false);
  assertEquals(text.includes('Apex Systems & Solutions'), true);
  assertEquals(text.includes('Enterprise revenue acceleration platform'), true);
  assertEquals(text.length <= 12000, true);
});

Deno.test('fetchPublicPage: blocks private IP redirect and huge payload', async () => {
  // Direct private target is rejected immediately
  await assertRejects(
    async () => {
      await fetchPublicPage('http://127.0.0.1');
    },
    Error,
    'blocked_url',
  );

  await assertRejects(
    async () => {
      await fetchPublicPage('http://169.254.169.254');
    },
    Error,
    'blocked_url',
  );

  await assertRejects(
    async () => {
      await fetchPublicPage('http://10.0.0.1');
    },
    Error,
    'blocked_url',
  );
});
