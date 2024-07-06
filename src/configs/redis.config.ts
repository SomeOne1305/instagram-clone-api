import { registerAs } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
export default registerAs(
  'redisConfig',
  (): RedisClientOptions => ({
    // password: 'A!a2h3m4a5d@',
    // socket: {
    //   host: process.env.REDIS_HOST,
    //   port: +process.env.REDIS_PORT,
    // },
    url: 'redis://default:AanfAAIncDEyODBjOTM0YmZjMDE0NDE3YTkwY2JkNjNjNDA2YWE4ZnAxNDM0ODc@immense-baboon-43487.upstash.io:6379',
  }),
);
