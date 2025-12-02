-- Create Employee table
CREATE TABLE "Employee" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "position" text,
  "salary" double precision,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
