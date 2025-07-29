import { DataSource } from 'typeorm';
import 'dotenv/config';
import { Lead } from './entities/Lead';
import { Service } from './entities/Service';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Lead, Service],
  synchronize: true, 
  logging: false,
});