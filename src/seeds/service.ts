import { AppDataSource } from "../dataSource";
import { Service } from "../entities/Service";

async function seedServices() {
  const dataSource = await AppDataSource.initialize();
  const serviceRepo = dataSource.getRepository(Service);

  const services = [
    { name: 'delivery' },
    { name: 'pick-up' },
    { name: 'payment' },
  ];

  for (const serviceData of services) {
    const exists = await serviceRepo.findOneBy({ name: serviceData.name });
    if (!exists) {
      const service = serviceRepo.create(serviceData);
      await serviceRepo.save(service);
      console.log(`Inserted service: ${service.name}`);
    } else {
      console.log(`Service already exists: ${serviceData.name}`);
    }
  }

  await dataSource.destroy();
  console.log('Service seeding complete!');
}

seedServices().catch(console.error);