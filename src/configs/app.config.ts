import { registerAs } from '@nestjs/config';

export default registerAs('app', () => [
  process.env.ADMIN,
  'http://localhost:5173',
]);
