# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Casamia Balance Hoi An — a marketing/showcase website for a Hoi An urban development project. Built as a single-page React application.

## Tech Stack

- **Framework:** React 19 + TypeScript (Vite 8)
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite` plugin, NOT PostCSS)
- **Smooth Scrolling:** Lenis — initialized via `useLenis()` hook in `src/hooks/useLenis.ts`
- **Fonts:** Inter (sans) + Playfair Display (serif) via Google Fonts

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check (`tsc -b`) then build for production
- `npm run lint` — ESLint
- `npm run preview` — preview production build locally

## Architecture

Single-page app with all content in `src/App.tsx`. No routing library yet.

- `src/main.tsx` — React entry point
- `src/App.tsx` — main page component with all sections (header, hero, about, residences, contact, footer)
- `src/hooks/useLenis.ts` — smooth scroll setup via Lenis
- `src/index.css` — Tailwind import + theme tokens (custom colors, fonts) + Lenis CSS resets

## Tailwind v4 Notes

This project uses Tailwind CSS v4 which differs from v3:
- Theme customization uses `@theme {}` directive in CSS (not `tailwind.config.js`)
- Custom colors are defined in `src/index.css` under `@theme {}` and referenced as utilities (e.g., `bg-primary`, `text-secondary`)
- No `tailwind.config.js` or `postcss.config.js` — Tailwind is loaded as a Vite plugin

## Design Tokens (defined in `src/index.css`)

- `--color-primary: #1a1a2e` (deep navy)
- `--color-secondary: #c9a96e` (gold)
- `--color-accent: #d4af37` (bright gold)
- `--color-warm: #f5f0e8` (warm off-white background)
- `--color-dark: #0f0f1a` (footer/dark sections)
