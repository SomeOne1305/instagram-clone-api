import { registerAs } from '@nestjs/config';

export default registerAs('app', () => [
  process.env.CLIENT_URL,
  'https://insta-clone-application.vercel.app/',
  'https://insta-clone-application.vercel.app',
  'http://localhost:5173',
]);
