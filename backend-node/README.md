# backend-node

This is a minimal Node + TypeScript GraphQL backend using Prisma.

Quick start (local)

1. Copy .env.example to .env and set DATABASE_URL and JWT_SECRET:
   cp .env.example .env

2. Install dependencies and generate lockfile:
   cd backend-node
   npm install

3. Generate Prisma client and apply migrations (if you have migrations):
   npx prisma generate
   npx prisma migrate deploy

4. Build and run:
   npm run build
   npm run start

During development:
   npm run dev

Notes for Render
- Root directory on Render: backend-node
- Build command: npm ci && npm run build
- Start command: npx prisma migrate deploy && npm run start
- Set environment variables in Render service:
  - DATABASE_URL
  - JWT_SECRET
  - NODE_ENV=production
