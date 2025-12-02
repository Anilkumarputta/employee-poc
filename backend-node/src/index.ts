import express, { Application } from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/schema";
import * as resolversModule from "./resolvers"; // may export `resolvers` or default
import employeeResolver from "./resolvers/employeeResolver";
import { createContext } from "./context";
import { getUserFromToken } from "./auth";

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const app: Application = express();

app.use(cors());
app.get("/", (_req, res) => res.send("OK"));

/**
 * Merge resolver modules safely:
 * - resolversModule may export `resolvers` (named), a default, or export individual fields.
 * - employeeResolver is a module that contains Mutation/Query fragments (default export).
 * We deep-merge Query / Mutation objects so both modules' resolvers are available.
 */
function mergeResolvers(a: any, b: any) {
  const result: any = { ...a };
  for (const key of Object.keys(b)) {
    if (typeof b[key] === "object" && b[key] !== null) {
      result[key] = { ...(result[key] || {}), ...b[key] };
    } else {
      result[key] = b[key];
    }
  }
  return result;
}

function resolveModuleExports(mod: any) {
  if (!mod) return {};
  if (mod.resolvers) return mod.resolvers;
  if (mod.default) return mod.default;
  return mod;
}

const baseResolvers = resolveModuleExports(resolversModule);
const mergedResolvers = mergeResolvers(baseResolvers, employeeResolver);

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: mergedResolvers,
    context: async ({ req }) => {
      const auth = req?.headers?.authorization;
      const user = await getUserFromToken(auth);
      return createContext(user);
    }
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: "/graphql" });

  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});