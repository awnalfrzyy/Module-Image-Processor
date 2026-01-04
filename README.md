Native Image Processor

high-performance image processing engine built in Rust and exposed as a Node.js module using NAPI-RS. The project is designed to handle demanding tasks like shopping receipt rendering and image manipulation faster than pure JavaScript libraries.

Key Features

- Rust-Powered Performance: Uses Rust's image library for low-level pixel processing.
- Receipt Generator: Instantly render dynamic text to image templates.
- Cross-Platform: Available for Linux (Debian/Ubuntu), Windows, and macOS (Intel/M1/M2).
- Type Safety: Full TypeScript support for easy integration.

Installation
You can install this module directly from GitHub:

- $npm install github:username/module-image-processor

Use:
import { generateReceipt } from 'module-image-processor';

// Generate original shopping receipts
generateReceipt(
'assets/bg-receipt.png',
'assets/font.ttf',
'temp/result.png',
'STORE ROCKET',
'Rp 750.000'
);

Development

- Install Dependensi: $sudo apt install -y clang pkg-config libfontconfig1-dev
- Build Module:npm install npm run build
