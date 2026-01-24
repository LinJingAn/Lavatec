# Lavatec (Next.js)

This repository contains the Lavatec front-end migrated from Vite to Next.js.

## Routing

The application remains a React Router SPA. Next.js serves a single catch-all route
and dynamically mounts the SPA on the client (SSR disabled).

- Entry: `src/spa/Spa.tsx`
- Catch-all: `src/app/[[...slug]]/page.tsx`

## Getting started

1) Install dependencies

   npm install

2) Create your env file

   cp .env.example .env.local

3) Run the dev server

   npm run dev

Then open `http://localhost:3000`.

## Environment variables

Client-side variables must be prefixed with `NEXT_PUBLIC_`.

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (if using the logistics map)
