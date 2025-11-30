import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import path from 'path';
import { resolvers } from './resolvers/employeeResolver';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

const typeDefs = readFileSync(path.join(__dirname, 'schema', 'employee-schema.graphql'), 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // basic auth context; token parsing will be in resolvers where needed
    const auth = req.headers.authorization || '';
    return { prisma, auth };
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
