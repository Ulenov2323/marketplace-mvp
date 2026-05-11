# Hybrid Marketplace Platform

Production-ready MVP architecture for a premium dark marketplace inspired by Playerok-style trading flows.

## Stack

- Frontend: React, Vite, TailwindCSS, Framer Motion, Lucide icons
- Backend: Node.js, Express, modular REST API structure
- Database: PostgreSQL schema in `database/schema.sql`
- Integrations: payment provider abstraction, Telegram bot integration layer

## Run

```bash
npm install
npm run dev:frontend
npm run dev:backend
```

The current environment has Node.js but `npm` is not available in PATH. Once npm is installed, the project is ready to install and run.

## Structure

- `frontend/` - premium marketplace web app
- `backend/` - Express API skeleton with domain modules
- `database/` - PostgreSQL schema and seed-friendly data model
- `docs/` - architecture notes and extension roadmap

## MVP Features

- Services marketplace with admin moderation
- Paid ad posts feed
- Homepage banner advertising rotation
- User profiles, ratings, reviews
- Telegram support redirect
- Modular payment layer for cards now and crypto/Binance Pay later
- Admin MVP for approve/reject services, delete posts, manage ads
