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
