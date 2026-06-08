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

# Useful Extra rules for Claude.md

  ## Workflow Orchestration
  ### 1. Plan Mode Default
  - Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
  - If something goes sideways, STOP and re-plan immediately — don't keep pushing
  - Use plan mode for verification steps, not just building
  - Write detailed specs upfront to reduce ambiguity

  ### 2. Subagent Strategy to keep main context window clean
  - Offload research, exploration, and parallel analysis to subagents
  - For complex problems, throw more compute at it via subagents
  - One task per subagent for focused execution

  ### 3. Self-Improvement Loop
  - After ANY correction from the user: update 'tasks/lessons.md' with the pattern
  - Write rules for yourself that prevent the same mistake
  - Ruthlessly iterate on these lessons until mistake rate drops
  - Review lessons at session start for relevant project

  ### 4. Verification Before Done
  - Never mark a task complete without proving it works
  - Diff behavior between main and your changes when relevant
  - Ask yourself: "Would a staff engineer approve this?"
  - Run tests, check logs, demonstrate correctness

  ### 5. Demand Elegance (Balanced)
  - For non-trivial changes: pause and ask "is there a more elegant way?"
  - If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
  - Skip this for simple, obvious fixes — don't over-engineer
  - Challenge your own work before presenting it

  ### 6. Autonomous Bug Fixing
  - When given a bug report: just fix it. Don't ask for hand-holding
  - Point at logs, errors, failing tests -> then resolve them
  - Zero context switching required from the user
  - Go fix failing CI tests without being told how

  ## Task Management
  1. Plan First: Write plan to 'tasks/todo.md' with checkable items
  2. Verify Plan: Check in before starting implementation
  3. Track Progress: Mark items complete as you go
  4. Explain Changes: High-level summary at each step
  5. Document Results: Add review to 'tasks/todo.md'
  6. Capture Lessons: Update 'tasks/lessons.md' after corrections

  ## Core Principles
  - Simplicity First: Make every change as simple as possible. Impact minimal code.
  - No Laziness: Find root causes. No temporary fixes. Senior developer standards.
  - Minimal Impact: Changes should only touch what's necessary. Avoid introducing bugs.
