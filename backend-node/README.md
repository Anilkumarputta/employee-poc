# backend-node

Node + TypeScript GraphQL backend (Prisma + Apollo).

Local dev:
1. Copy env:
   cp .env.example .env
   Edit .env to set DATABASE_URL and JWT_SECRET.

2. Install & build:
   cd backend-node
   npm install
   npx prisma generate
   npm run build

3. Run migrations and seed:
   npx prisma migrate deploy
   npm run seed

4. Start:
   npm run start
   # or dev:
   npm run dev
