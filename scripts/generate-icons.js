const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(size, bgRGB, fgRGB) {
  // Simple uncompressed/deflated raw RGBA to PNG
  const width = size;
  const height = size;

  // Raw image data with filter byte (0) before each scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const radius = width / 2;
  const cx = width / 2;
  const cy = width / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded squircle / icon shape
      // Carer teal background: #0f766e -> [15, 118, 110]
      // Inner loop / cross / heart motif in white or mint
      
      // Heart/care loop motif:
      // Normalized coords -1 to 1
      const nx = (x - cx) / (width * 0.35);
      const ny = (cy - y) / (height * 0.35) + 0.2; // inverted y

      // Equation of heart: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      const heartEq = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * Math.pow(ny, 3);
      
      // Cross / care emblem in center
      const inCrossH = Math.abs(dx) < width * 0.18 && Math.abs(dy - height * 0.02) < height * 0.06;
      const inCrossV = Math.abs(dx) < width * 0.06 && Math.abs(dy - height * 0.02) < height * 0.18;
      const inCross = inCrossH || inCrossV;

      const inHeart = heartEq <= 0.05 && heartEq >= -0.7;

      if (inCross || inHeart) {
        rawData[pxOffset] = fgRGB[0];     // R
        rawData[pxOffset + 1] = fgRGB[1]; // G
        rawData[pxOffset + 2] = fgRGB[2]; // B
        rawData[pxOffset + 3] = 255;       // A
      } else {
        rawData[pxOffset] = bgRGB[0];     // R
        rawData[pxOffset + 1] = bgRGB[1]; // G
        rawData[pxOffset + 2] = bgRGB[2]; // B
        rawData[pxOffset + 3] = 255;       // A
      }
    }
  }

  // Deflate IDAT data
  const compressed = zlib.deflateSync(rawData);

  // CRC32 implementation
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const typeAndData = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 79, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Carer teal color: rgb(15, 118, 110) / #0f766e
// Foreground white: rgb(255, 255, 255)
const bgTeal = [15, 118, 110];
const fgWhite = [255, 255, 255];

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), createPNG(192, bgTeal, fgWhite));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), createPNG(512, bgTeal, fgWhite));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createPNG(180, bgTeal, fgWhite));

// Also write an SVG version
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="128" fill="#0f766e"/>
  <path d="M256 140 C210 90 140 100 110 150 C70 220 130 300 256 390 C382 300 442 220 402 150 C372 100 302 90 256 140 Z" fill="none" stroke="#ffffff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="232" y="195" width="48" height="120" rx="12" fill="#ffffff"/>
  <rect x="196" y="231" width="120" height="48" rx="12" fill="#ffffff"/>
</svg>`;
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);

console.log('PWA icons created successfully in public/icons/');

