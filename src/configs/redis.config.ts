import { registerAs } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
export default registerAs(
  'redisConfig',
  (): RedisClientOptions => ({
    password: 'A!a2h3m4a5d@',
    socket: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
  }),
);
