import { NextApiRequest } from 'next';

export type ContactTemplateData = {
  email: string;
  naam: string;
  bericht: string;
};

export type ContactRequestBody = ContactTemplateData & {
  csrf: string;
};

export interface ContactRequest extends NextApiRequest {
  body: ContactRequestBody;
}
