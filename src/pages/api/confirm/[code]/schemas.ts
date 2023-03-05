import { NextApiRequest, NextApiResponse } from 'next';

export interface ResetRequest extends NextApiRequest {
  query: {
    code: string;
  };
}
export interface ConfirmRequest extends NextApiRequest {
  query: {
    code: string;
  };
}
