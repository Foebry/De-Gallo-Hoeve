import { NextApiRequest, NextApiResponse } from 'next';
import { contact } from './contact';
import { ContactRequest } from './schemas';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') res.status(405).send({ message: 'Not Allowed' });

  return contact(req as ContactRequest, res);
};

export default handler;
