import 'reflect-metadata';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import app from './app'; // your express app
import { expressMiddleware } from '@as-integrations/express5';
import { buildSchema } from 'type-graphql';
import { LeadResolver } from './resolvers/LeadResolver';
import { AppDataSource } from './dataSource';

async function startServer() {
  await AppDataSource.initialize();

  const httpServer = http.createServer(app);

  const schema = await buildSchema({
    resolvers: [LeadResolver],
    validate: false, 
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server),
  );

  const PORT = process.env.PORT || 4000;
  await httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });

  const shutdown = async () => {
    console.log('Shutting down server...');
    await server.stop();
    await httpServer.close();
    console.log('Server shut down gracefully');
  }

  process.on('SIGINT', async () => {
    await shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await shutdown();
    process.exit(0);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start', err);
});
