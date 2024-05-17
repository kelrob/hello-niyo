import { DataSource } from 'typeorm';
import 'dotenv/config.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  ssl: process.env.DB_SSL.toString() == 'true',
  subscribers: [],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  migrationsRun: true,
});

AppDataSource.initialize()
  .then(() => {
    const database = process.env.DB_PORT;
    console.log(`Data Source has been initialized ${database} `);
  })
  .catch((err) => {
    const database = process.env.DB_NAME;
    console.log({ database });
    console.error(`Data Source initialization error`, err);
  });

export default AppDataSource;
