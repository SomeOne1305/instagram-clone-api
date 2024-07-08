import { Request } from 'express';

export interface IPayload {
  id: string;
  exp: number;
  iat: number;
}

export interface IReq extends Request {
  user: {
    id: string;
  };
}

export interface ImageKitModuleOptions {
  privateKey: string;
  publicKey: string;
  urlEndpoint: string;
}
