# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Casamia Balance Hoi An — a marketing/showcase website for a Hoi An urban development project. Built as a single-page React application. All UI content is in Vietnamese.

## Tech Stack

- **Framework:** React 19 + TypeScript (Vite 8)
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite` plugin, NOT PostCSS)
- **Smooth Scrolling:** Lenis — initialized via `useLenis()` hook in `src/hooks/useLenis.ts`
- **Icons:** lucide-react
- **Fonts:** Inter (sans), Playfair Display (serif), 1FTV Sagire (display), 1FTV Alishanty Signature (script) — custom fonts loaded from `/public` as `.otf` files

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check (`tsc -b`) then build for production
- `npm run lint` — ESLint
- `npm run preview` — preview production build locally

## Architecture

Single-page app with all content in `src/App.tsx`. No routing library or component decomposition yet — everything (header, hero, about, amenities carousel, location/map, contact, footer) lives in one component.

- `src/main.tsx` — React entry point
- `src/App.tsx` — monolithic page component (~all sections inline)
- `src/hooks/useLenis.ts` — smooth scroll setup via Lenis
- `src/index.css` — Tailwind import + `@theme {}` tokens + custom CSS utilities

## Tailwind v4 Notes

This project uses Tailwind CSS v4 which differs from v3:
- Theme customization uses `@theme {}` directive in CSS (not `tailwind.config.js`)
- Custom colors/fonts are defined in `src/index.css` under `@theme {}` and referenced as utilities (e.g., `bg-primary`, `text-secondary`, `font-sagire`)
- No `tailwind.config.js` or `postcss.config.js` — Tailwind is loaded as a Vite plugin

## Design Tokens (defined in `src/index.css`)

- `--color-primary: #1a1a2e` (deep navy)
- `--color-secondary: #8B181B` (deep red)
- `--color-accent: #d4af37` (bright gold)
- `--color-warm: #FFFCF6` (warm off-white background)
- `--color-dark: #0f0f1a` (footer/dark sections)
- `--font-sagire` / `--font-alishanty` — custom display/script fonts

## Custom CSS Utilities (in `src/index.css`)

- `.btn-inverted-corners` / `.inverted-corners-lg` — inverted-radius button/card masks using CSS `mask` with radial gradients
- `.location-scrollbar` — thin custom scrollbar styling
- `.location-item` — hover underline animation via `::after` pseudo-element
