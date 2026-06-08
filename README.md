# Casamia Balanca Hoi An

A real estate marketing website for **Casamia Balanca** — an urban development project in Hoi An, Vietnam. The site showcases the property, provides news and gallery content, and includes an admin dashboard for content management.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Backend:** Node.js, Express, TypeScript
- **Database:** MySQL
- **Auth:** JWT + bcryptjs

## Project Structure

```
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/    # Header, Footer, UI widgets
│   │   ├── pages/admin/   # Admin dashboard & login
│   │   ├── hooks/         # Custom hooks (Lenis scroll, visibility, etc.)
│   │   ├── data/          # Static data (gallery, news)
│   │   └── App.tsx        # Main application entry
│   └── public/            # Static assets & fonts
│
├── backend/               # Express API server
│   ├── src/
│   │   ├── controllers/   # Auth, contacts, gallery, news, downloads, sections
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/     # JWT authentication
│   │   ├── config/        # Database connection
│   │   └── seed.ts        # Database seeding
```

## Features

- Property showcase with hero video, gallery, and news sections
- Contact form for inquiries
- File download support for brochures/documents
- Admin dashboard for managing gallery images, news articles, and site content
- Smooth scroll animations (Lenis)
- Responsive design

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```
