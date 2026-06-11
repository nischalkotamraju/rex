#!/usr/bin/env node
// Felix Icon Generator — pure Node.js, no external dependencies
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/icons');
fs.mkdirSync(outDir, { recursive: true });

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function createPNG(size) {
  const rgba = new Uint8Array(size * size * 4);
  const cx = size / 2, cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx + 0.5, dy = y - cy + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const rr = size * 0.46;

      if (dist > rr) { rgba[idx + 3] = 0; continue; }

      // Blue background
      rgba[idx] = 0x1a; rgba[idx + 1] = 0x73; rgba[idx + 2] = 0xe8; rgba[idx + 3] = 255;

      // Star shape
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      const pts = 5;
      const a = Math.PI / pts;
      const mod = ((angle % (2 * a)) + 2 * a) % (2 * a);
      const starR = (size * 0.26) + (size * 0.18) * (1 - Math.abs(mod - a) / a);
      if (dist < starR) {
        rgba[idx] = 255; rgba[idx + 1] = 255; rgba[idx + 2] = 255; rgba[idx + 3] = 255;
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;

  const raw = [];
  for (let y = 0; y < size; y++) {
    raw.push(0);
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      raw.push(rgba[i], rgba[i+1], rgba[i+2], rgba[i+3]);
    }
  }

  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(Buffer.from(raw))),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const size of [16, 48, 128]) {
  const p = path.join(outDir, `icon${size}.png`);
  fs.writeFileSync(p, createPNG(size));
  console.log(`Generated: ${p}`);
}
console.log('Done.');
