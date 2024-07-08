import { registerAs } from '@nestjs/config';
import { ImageKitModuleOptions } from 'src/types';

export default registerAs(
  'storageConfig',
  (): ImageKitModuleOptions => ({
    privateKey: process.env.BUCKET_PRIVATE_KEY,
    publicKey: process.env.BUCKET_PUBLIC_KEY,
    urlEndpoint: process.env.BUCKET_URL_ENDPOINT,
  }),
);
