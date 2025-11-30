# Employee POC

This repository will contain a full-stack proof-of-concept for an employee listing application.

Below are the exact assignment instructions and the concrete plan for both frontend and backend work. I will add these files and start implementing as soon as I have collaborator access to the repository.

Original assignment (deadline: 2 days after assignment)
- This is the test project only. You can take as much time as needed. Send me the deployed live app URL and Github link. No access limitations on the app. The deadline to submit is 2 days after assignment.
- If the design, presentation and code are good, you will be scheduled for an interview with the hiring manager.
- Focus on presentation and scalable code: beautiful and extraordinary design: first impression. Show creativity.

We are looking for a backend engineer skilled in GraphQL and Node.js and Spring Boot to support a React-based application.

Frontend requirements (POC)
- Hamburger menu with just one level sub-menu deep on a few menu items.
- Horizontal menu with a few sample menu items.
- Main content showing a beautiful grid view. Example: employees data in 10 columns.
- Toggle to show the same employees data in a tile view showing necessary fields only.
- Each tile will have a bun (3-dot) button for additional options such as edit, flag, delete etc.
- When a tile is clicked, show the entire details of the record in a beautiful view (expanded tile or pop-up). Must be able to navigate back to the tile view.
- Any public API can be used to display the content on the grid/tile (or use seeded sample data).

Backend requirements
- Backend Setup: Create a GraphQL API.
- Data Model: Store employee data with fields like ID, name, age, class, subjects, and attendance.
- GraphQL Schema:
  - Queries:
    - List employees with optional filters.
    - Retrieve details for a single employee.
    - List employees with pagination.
  - Mutations:
    - Add employee
    - Update employee
- Pagination & Sorting: Implement pagination for queries and sorting.
- Authentication & Authorization: Secure API with role-based access control (admin, employee). Few features accessible to employee and few for admin.
- Performance Optimization: Demonstrate essential performance considerations.

What I will deliver
- Frontend: React + TypeScript, Tailwind CSS (or chosen UI stack). Hamburger + horizontal menus, grid & tile views, tile action menu, expanded detail view, responsive and polished UI.
- Backend (Node.js): Apollo Server (GraphQL) + TypeScript + Prisma + PostgreSQL. Full GraphQL schema, resolvers, cursor/offset pagination, filters, sorting, mutations, JWT auth with role checks.
- Backend (Spring Boot): Functional GraphQL service with equivalent schema and authentication concept.
- Seed users:
  - admin / Password123 (role: admin)
  - Anil / Password123 (role: employee)
- Performance considerations: cursor pagination, DB indexes, DataLoader batching, connection pooling, caching demonstration, rate-limiting middleware example.
- Deployment: Frontend to Vercel (recommended), backends to Render or Railway, PostgreSQL hosted via Render/Railway. Live URLs will be provided with no access limitations.
- Tests: Basic unit/integration tests for critical resolvers and UI flows.
- Documentation: Clear README, env examples, run & deploy instructions, and human-friendly branch/commit naming and file structure.

Branch and commit conventions (human-friendly)
- Branches: feature/hamburger-menu, feature/horizontal-menu, feature/grid-and-tile-view, feature/employee-detail-modal, backend-node/graphql-api, backend-spring/graphql-api, chore/seed-data, fix/auth-jwt, ci/deploy-scripts
- Commits: Short plain-English summaries (e.g. "Add hamburger and horizontal menus", "Seed DB with sample employees and users (admin, Anil)").

Repository layout (separate repos per your preference)
- /frontend — React app (Vite + TypeScript + Tailwind)
  - /src/pages
  - /src/components
  - /src/styles
- /backend-node — Node.js + TypeScript + Apollo Server + Prisma
  - /src/schema
  - /src/resolvers
  - /src/auth
  - /prisma
- /backend-spring — Spring Boot GraphQL service
  - Standard Maven/Gradle layout
- /infra — docker-compose for local Postgres, .env examples, deployment notes

Quick local setup notes (Node backend)
1. Create a Postgres DB and set DATABASE_URL in /backend-node/.env
2. From /backend-node:
   - npm install
   - npx prisma migrate dev --name init
   - npm run seed
   - npm run dev
3. From /frontend:
   - npm install
   - set VITE_API_URL to the backend GraphQL endpoint
   - npm run dev

Next steps (what I will do once invited)
1. Accept the collaborator invite for username: copilot.
2. Push the initial skeleton for frontend, backend-node, backend-spring, infra and README.
3. Seed the database with sample employees and the seed users (admin, Anil).
4. Implement Node backend first (full features), implement Spring Boot service in parallel.
5. Implement frontend and connect to the Node backend for full demo functionality.
6. Deploy both backends and frontend, share live URLs and GitHub links.
7. After initial push, you can remove the temporary collaborator if you want.

If anything in these instructions should be modified (passwords, extra seed data, color theme, or other constraints), tell me now. Otherwise, please send the collaborator invite and reply here with exactly: invite sent
