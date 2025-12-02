import express, { Application } from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/schema";
import { resolvers } from "./resolvers/employeeResolver";
import { createContext } from "./context";

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const app: Application = express();

app.use(cors());
app.get("/", (_req, res) => res.send("OK"));

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => createContext()
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

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