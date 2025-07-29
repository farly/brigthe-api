import { createApp } from './app';
import { AppDataSource } from './dataSource';
import { Service } from './entities/Service';

async function run() {
  await AppDataSource.initialize();

  // Seed services if not present
  const serviceRepo = AppDataSource.getRepository(Service);
  const baseServices = ['delivery', 'pick-up', 'payment'];
  for (const name of baseServices) {
    const exists = await serviceRepo.findOneBy({ name });
    if (!exists) {
      await serviceRepo.save(serviceRepo.create({ name }));
    }
  }

  const app = await createApp();

  const PORT = process.env.PORT || 4000;
  const server = app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  );

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server closed');
      AppDataSource.destroy().then(() => {
        console.log('Data Source closed');
        process.exit(0);
      });
    });
  });
}

run().catch(error => {
  console.error('Error during Data Source initialization:', error);
})