import { registerAs } from '@nestjs/config';

export default registerAs('app', () => [
  process.env.CLIENT_URL,
  'http://localhost:5173',
]);
