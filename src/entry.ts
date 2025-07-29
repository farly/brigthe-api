import http from 'http';
import { createApolloServer } from './server';

async function startServer() {
  const { app, server } = await createApolloServer();

  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 4000;

  await new Promise<void>((resolve) =>
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
      resolve();
    })
  );

  const shutdown = () => {
    console.log('Shutting down server...');
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return { httpServer, server };
}

startServer().catch(console.error);