// app.ts
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { LeadResolver } from './resolvers/LeadResolver';

export async function createApp() {
  const schema = await buildSchema({
    resolvers: [LeadResolver],
    validate: false,
  });

  const server = new ApolloServer({ schema });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  return app;
}