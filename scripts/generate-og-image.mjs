import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build CRC32 lookup table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buffer[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + length);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

export function generateOgImage(outputPath) {
  const width = 1200;
  const height = 630;

  // Obsidian background (#05060A)
  const bgR = 5;
  const bgG = 6;
  const bgB = 10;

  // Uncompressed raw scanlines: each scanline has 1 byte filter type (0) + width * 3 bytes (RGB)
  const rowStride = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowStride);

  // Aurora light blobs
  const mintCenter = { x: 300, y: 180, r: 45, g: 226, b: 166, radius: 450, maxAlpha: 0.28 };
  const cyanCenter = { x: 900, y: 220, r: 34, g: 211, b: 238, radius: 450, maxAlpha: 0.22 };
  const goldCenter = { x: 600, y: 480, r: 245, g: 185, b: 74, radius: 400, maxAlpha: 0.12 };

  // Center node mark geometry (diamond / 3 nodes)
  const centerNode = { x: 600, y: 240, r: 28 };
  const sat1 = { x: 500, y: 170, r: 16 };
  const sat2 = { x: 700, y: 170, r: 16 };
  const sat3 = { x: 600, y: 350, r: 18 };

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      let r = bgR;
      let g = bgG;
      let b = bgB;

      // 1. Grid lines (56px spacing, subtle 4% white)
      if (x % 56 === 0 || y % 56 === 0) {
        r = Math.min(255, r + 8);
        g = Math.min(255, g + 9);
        b = Math.min(255, b + 14);
      }

      // 2. Mint Blob
      const distMint = Math.hypot(x - mintCenter.x, y - mintCenter.y);
      if (distMint < mintCenter.radius) {
        const factor = Math.cos((distMint / mintCenter.radius) * (Math.PI / 2)) * mintCenter.maxAlpha;
        r += mintCenter.r * factor;
        g += mintCenter.g * factor;
        b += mintCenter.b * factor;
      }

      // 3. Cyan Blob
      const distCyan = Math.hypot(x - cyanCenter.x, y - cyanCenter.y);
      if (distCyan < cyanCenter.radius) {
        const factor = Math.cos((distCyan / cyanCenter.radius) * (Math.PI / 2)) * cyanCenter.maxAlpha;
        r += cyanCenter.r * factor;
        g += cyanCenter.g * factor;
        b += cyanCenter.b * factor;
      }

      // 4. Gold Blob
      const distGold = Math.hypot(x - goldCenter.x, y - goldCenter.y);
      if (distGold < goldCenter.radius) {
        const factor = Math.cos((distGold / goldCenter.radius) * (Math.PI / 2)) * goldCenter.maxAlpha;
        r += goldCenter.r * factor;
        g += goldCenter.g * factor;
        b += goldCenter.b * factor;
      }

      // 5. Connective line traces (satellites to center node)
      const distLine1 = distanceToSegment(x, y, sat1.x, sat1.y, centerNode.x, centerNode.y);
      const distLine2 = distanceToSegment(x, y, sat2.x, sat2.y, centerNode.x, centerNode.y);
      const distLine3 = distanceToSegment(x, y, sat3.x, sat3.y, centerNode.x, centerNode.y);

      [distLine1, distLine2, distLine3].forEach((d) => {
        if (d < 3) {
          const intensity = 1 - d / 3;
          r += 45 * intensity * 0.7;
          g += 226 * intensity * 0.7;
          b += 166 * intensity * 0.7;
        }
      });

      // 6. Draw Nodes
      const distCenter = Math.hypot(x - centerNode.x, y - centerNode.y);
      if (distCenter < centerNode.r + 8) {
        if (distCenter < centerNode.r) {
          // Gold / Aurora Leader Node
          r = 245;
          g = 185;
          b = 74;
        } else {
          // Glow ring
          r = Math.min(255, r + 90);
          g = Math.min(255, g + 70);
          b = Math.min(255, b + 30);
        }
      }

      [sat1, sat2, sat3].forEach((sat, i) => {
        const d = Math.hypot(x - sat.x, y - sat.y);
        if (d < sat.r + 6) {
          if (d < sat.r) {
            r = i === 1 ? 34 : 45;
            g = i === 1 ? 211 : 226;
            b = i === 1 ? 238 : 166;
          } else {
            r = Math.min(255, r + 40);
            g = Math.min(255, g + 80);
            b = Math.min(255, b + 90);
          }
        }
      });

      // Write pixel values clamped 0-255
      const pxOffset = rowOffset + 1 + x * 3;
      rawData[pxOffset] = Math.min(255, Math.floor(r));
      rawData[pxOffset + 1] = Math.min(255, Math.floor(g));
      rawData[pxOffset + 2] = Math.min(255, Math.floor(b));
    }
  }

  // Compress raw image data with zlib
  const compressedData = zlib.deflateSync(rawData, { level: 9 });

  // PNG Header (8 bytes)
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk (13 bytes)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(2, 9); // Color type 2: RGB
  ihdrData.writeUInt8(0, 10); // Compression 0
  ihdrData.writeUInt8(0, 11); // Filter 0
  ihdrData.writeUInt8(0, 12); // Interlace 0
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  // Assemble full PNG
  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);

  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`[generate-og-image] Generated 1200x630 OpenGraph image at: ${outputPath} (${pngBuffer.length} bytes)`);
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(x - x1, y - y1);
  let t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + t * (x2 - x1)), y - (y1 + t * (y2 - y1)));
}

// Auto-run if executed directly
const defaultOut = path.resolve(__dirname, '../public/og-image.png');
generateOgImage(defaultOut);
