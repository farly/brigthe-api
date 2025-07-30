import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { buildSchema } from 'type-graphql';
import app from './app';
import { LeadResolver } from './resolvers/LeadResolver';
import { AppDataSource } from './dataSource';

export async function createApolloServer() {
  await AppDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [LeadResolver],
    validate: true,
  });

  const server = new ApolloServer({ schema });
  await server.start();

  app.use('/graphql', expressMiddleware(server));

  return { app, server };
}