# Backend Node.js (Apollo Server + Prisma)

This is the Node.js backend for the Employee POC application, built with Apollo Server, GraphQL, Prisma, and PostgreSQL.

## Features

- **GraphQL API** with full CRUD operations for employees
- **JWT-based authentication** with role-based access control
- **Admin-only write permissions** for create, update, and delete operations
- **Pagination and filtering** for employee queries
- **Development-only rate limiter** for login attempts (5 attempts per minute per username)

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Setup & Run Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file and update it with your values:

```bash
cp .env.example .env
```

Update `.env` with:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure secret key for signing JWT tokens

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed the database

```bash
npm run seed
```

This will create:
- **Users:** admin / Password123 (role: admin), Anil / Password123 (role: employee)
- **40 sample employees** with various classes and attendance percentages

### 6. Start the development server

```bash
npm run dev
```

The server will be available at `http://localhost:4000/`.

## GraphQL Schema

### Queries

```graphql
# Get paginated list of employees with optional filtering
employees(page: Int = 1, perPage: Int = 10, filter: EmployeeFilter): EmployeesPage!

# Get a single employee by ID
employee(id: Int!): Employee
```

### Mutations

```graphql
# Login and receive JWT token
login(username: String!, password: String!): AuthPayload!

# Create a new employee (admin only)
createEmployee(input: EmployeeInput!): Employee!

# Update an existing employee (admin only)
updateEmployee(id: Int!, input: EmployeeInput!): Employee!

# Delete an employee (admin only)
deleteEmployee(id: Int!): Boolean!
```

### Types

```graphql
type Employee {
  id: Int!
  fullName: String!
  className: String
  attendancePercentage: Float
}

input EmployeeInput {
  fullName: String!
  className: String
  attendancePercentage: Float
}

type EmployeesPage {
  items: [Employee!]!
  total: Int!
  page: Int!
  perPage: Int!
}

input EmployeeFilter {
  query: String
  minAttendance: Float
}
```

## Authentication & Authorization

### Login

To authenticate, use the `login` mutation:

```graphql
mutation {
  login(username: "admin", password: "Password123") {
    token
    user {
      id
      username
      role
    }
  }
}
```

### Using JWT Token

Include the JWT token in the `Authorization` header for authenticated requests:

```
Authorization: Bearer <your-jwt-token>
```

### Admin-Only Operations

The following mutations require the `admin` role:
- `createEmployee`
- `updateEmployee`
- `deleteEmployee`

Non-admin users or unauthenticated requests will receive an `AuthenticationError`.

## Manual Verification Steps

### 1. Login as admin

```graphql
mutation {
  login(username: "admin", password: "Password123") {
    token
    user { id username role }
  }
}
```

### 2. Create an employee (with admin token)

```graphql
mutation {
  createEmployee(input: {
    fullName: "John Doe"
    className: "Class A"
    attendancePercentage: 95.5
  }) {
    id
    fullName
    className
    attendancePercentage
  }
}
```

### 3. Update an employee (with admin token)

```graphql
mutation {
  updateEmployee(id: 1, input: {
    fullName: "John Doe Updated"
    className: "Class B"
    attendancePercentage: 98.0
  }) {
    id
    fullName
    className
    attendancePercentage
  }
}
```

### 4. Delete an employee (with admin token)

```graphql
mutation {
  deleteEmployee(id: 1)
}
```

### 5. Query employees

```graphql
query {
  employees(page: 1, perPage: 10) {
    items {
      id
      fullName
      className
      attendancePercentage
    }
    total
    page
    perPage
  }
}
```

## Rate Limiting

A development-only rate limiter is implemented for login attempts:
- **Max attempts:** 5 per username
- **Window:** 1 minute

After exceeding the limit, users will receive a `RATE_LIMITED` error and must wait before retrying.

## Seeded Credentials (Local Development)

| Username | Password    | Role     |
|----------|-------------|----------|
| admin    | Password123 | admin    |
| Anil     | Password123 | employee |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run compiled JavaScript |
| `npm run seed` | Seed the database with users and employees |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHENTICATED` | Authentication required or invalid credentials |
| `BAD_USER_INPUT` | Invalid input (e.g., empty fullName) |
| `RATE_LIMITED` | Too many login attempts |
