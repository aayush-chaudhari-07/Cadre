import { assertEquals } from '@std/assert';
import { isPrivateOrBlockedIp, isSafeUrl, extractVisibleText } from '../safe-url.ts';

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
  assertEquals(isPrivateOrBlockedIp('172.15.255.255'), false); // Below 172.16
  assertEquals(isPrivateOrBlockedIp('172.32.0.1'), false); // Above 172.31
});

Deno.test('isSafeUrl: rejects prohibited protocols, ports, and internal hosts', async () => {
  // Protocol checks
  const ftp = await isSafeUrl('ftp://example.com/file.txt');
  assertEquals(ftp.safe, false);

  const file = await isSafeUrl('file:///etc/passwd');
  assertEquals(file.safe, false);

  const js = await isSafeUrl('javascript:alert(1)');
  assertEquals(js.safe, false);

  // Port checks
  const sshPort = await isSafeUrl('http://example.com:22');
  assertEquals(sshPort.safe, false);

  const devPort = await isSafeUrl('http://example.com:3000');
  assertEquals(devPort.safe, false);

  const altPort = await isSafeUrl('https://example.com:8080');
  assertEquals(altPort.safe, false);

  // Permitted ports
  const defaultPort = await isSafeUrl('https://example.com');
  assertEquals(defaultPort.safe, true);

  const port80 = await isSafeUrl('http://example.com:80');
  assertEquals(port80.safe, true);

  const port443 = await isSafeUrl('https://example.com:443');
  assertEquals(port443.safe, true);

  // Prohibited hostnames
  const localhost = await isSafeUrl('http://localhost:80');
  assertEquals(localhost.safe, false);

  const subLocalhost = await isSafeUrl('http://api.localhost');
  assertEquals(subLocalhost.safe, false);

  const internalHost = await isSafeUrl('http://service.internal');
  assertEquals(internalHost.safe, false);

  const directLoopbackIp = await isSafeUrl('http://127.0.0.1/admin');
  assertEquals(directLoopbackIp.safe, false);

  const directMetadataIp = await isSafeUrl('http://169.254.169.254/latest/meta-data');
  assertEquals(directMetadataIp.safe, false);
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
});

