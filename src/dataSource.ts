import { DataSource } from 'typeorm';
import { Lead } from './entities/Lead';
import { Service } from './entities/Service';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Lead, Service],
  synchronize: true, // Use migrations in production!
  logging: false,
});