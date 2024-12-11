import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';


dotenvConfig({ path: '.env' });

const typeOrmConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,  
  port: parseInt(process.env.DB_PORT), 
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    'dist/**/*.entity{.ts,.js}',
  ],
  autoLoadEntities: true,
  dropSchema: false,
  synchronize: false,  
  logging: true,
  migrations: [
    'dist/migrations/*{.js,.ts}',
  ],
  migrationsRun: true,
  subscribers: [],
  extra: {
  
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  retryAttempts: 5,
  retryDelay: 3000,};

export default registerAs('typeorm', () => typeOrmConfig);


export const connectionSource = new DataSource(typeOrmConfig as DataSourceOptions);

export const connectDatabase = async () => {
  try {
    await connectionSource.initialize();
    console.log('Database connection established successfully.');
    console.log(`Connected to database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Username: ${process.env.DB_USERNAME}`);
    console.log(`Max connections in pool: ${typeOrmConfig.extra.max}`);
    console.log(`Idle timeout: ${typeOrmConfig.extra.idleTimeoutMillis} ms`);
    console.log(`Connection timeout: ${typeOrmConfig.extra.connectionTimeoutMillis} ms`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

connectDatabase();
