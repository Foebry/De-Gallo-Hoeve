import { NextApiRequest } from 'next';

export type ContactRequestBody = {
  email: string;
  naam: string;
  bericht: string;
};

export interface ContactRequest extends NextApiRequest {
  body: ContactRequestBody;
}
