import { ApolloServer } from "apollo-server-express";
import express from "express";
import typeDefs from "./schema.graphql";
import resolvers from "./resolvers.js";

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

const port = process.env.PORT || 4000;
app.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});
