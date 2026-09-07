# Mariutil QR Code Generator

A fast, privacy-first QR Code Generator for URLs and text. QR codes are created entirely in the browser, so user-entered content is never sent to a backend.

## Features

- Generate QR codes from URLs, plain text, phone numbers, or email text
- Download high-resolution PNG files
- Download scalable SVG files
- Copy the original content
- Clear the input and preview
- Responsive, keyboard-accessible interface
- Friendly validation and generation errors
- SEO metadata, structured data, `robots.txt`, and `sitemap.xml`

## Tech Stack

- React 19
- TypeScript
- Vite
- `qrcode` for client-side QR encoding
- Lucide React for interface icons

## Local Development

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Cloudflare Pages Deployment

This is a static Vite site and can be deployed directly to Cloudflare Pages.

```bash
npm run build
npx wrangler pages deploy dist --project-name mariutil-qr-code-generator
```

The current Pages deployment is available at:

<https://aa6f3735.mariutil-qr-code-generator.pages.dev>

For the intended production hostname, connect `qr.mariutil.com` as a custom domain in Cloudflare Pages.

## Privacy

QR generation uses the `qrcode` package in the browser. The app has no backend API, database, analytics for entered content, login, or QR history. User content remains in the current browser session and is not uploaded.

## Project Structure

- `src/App.tsx`: QR generation, validation, copying, downloading, and page content
- `src/components/SiteHeader.tsx`: Mariutil navigation header
- `src/components/SiteFooter.tsx`: Mariutil footer
- `src/style.css`: responsive tool and shared layout styling
- `public/robots.txt`: crawler instructions
- `public/sitemap.xml`: search engine sitemap
- `index.html`: page metadata and structured data
