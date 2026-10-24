const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function buildFavicons() {
  const svgPath = path.join(__dirname, '../src/app/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate PNGs
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  fs.writeFileSync(path.join(__dirname, '../public/favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(__dirname, '../public/favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(__dirname, '../src/app/apple-icon.png'), png180);
  fs.writeFileSync(path.join(__dirname, '../public/android-chrome-192x192.png'), png192);
  fs.writeFileSync(path.join(__dirname, '../public/android-chrome-512x512.png'), png512);

  // 2. Build multi-resolution ICO file (16x16, 32x32, 48x48)
  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ];

  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type = 1
  header.writeUInt16LE(images.length, 4); // count

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count (0 for PNG/no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    offset += img.buffer.length;
    entries.push(entry);
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, '../src/app/favicon.ico'), icoBuffer);

  console.log('Favicons generated successfully!');
}

buildFavicons().catch((err) => {
  console.error(err);
  process.exit(1);
});
