import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entities from './entities';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './data/app.db',
  synchronize: true,
  logging: false,
  entities: Object.values(entities),
  migrations: [],
  subscribers: []
});
