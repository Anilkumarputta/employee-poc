import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers/employeeResolver';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

dotenv.config();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const typeDefs = readFileSync(path.join(__dirname, 'schema', 'employee-schema.graphql'), 'utf8');

interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const auth = req.headers.authorization || '';
    let user: JwtPayload | null = null;

    if (auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        user = jwt.verify(token, JWT_SECRET) as JwtPayload;
      } catch {
        // Invalid token, user remains null
        user = null;
      }
    }

    return { prisma, user };
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
