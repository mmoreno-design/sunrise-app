// Run: node generate-icons.js
// Creates simple SVG-based PNG icons

import fs from 'fs';

function createIconSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#4A90D9"/>
  <text x="${size/2}" y="${size * 0.72}" text-anchor="middle" font-size="${size * 0.55}" font-family="-apple-system, sans-serif">🌅</text>
</svg>`;
}

// Write SVG files (these work as icons on most platforms)
fs.writeFileSync('./public/icon-192.svg', createIconSVG(192));
fs.writeFileSync('./public/icon-512.svg', createIconSVG(512));

// For PNG, we'll just use the SVG renamed for now
fs.copyFileSync('./public/icon-192.svg', './public/icon-192.png');
fs.copyFileSync('./public/icon-512.svg', './public/icon-512.png');

console.log('Icons generated in /public/');
