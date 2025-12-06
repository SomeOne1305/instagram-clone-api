import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// export default registerAs(
//   'databaseConfig',
//   (): TypeOrmModuleOptions => ({
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: 5432,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//     synchronize: true,
//   }),
// );
export default registerAs(
  'databaseConfig',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: `${process.env.DB_PASS}`,
    database: process.env.DB_NAME,
    applicationName: process.env.DB_PROJECT_ID,
    // host: 'localhost',
    // port: 5432,
    // username: 'postgres',
    // password: '12345678',
    // database: 'instagram',
    // url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require&charset=utf8`,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
);
