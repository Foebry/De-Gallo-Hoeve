import { NextApiRequest, NextApiResponse } from 'next';
import createErrorLog from './create';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') res.status(405).send('Not Allowed');

  return createErrorLog(req, res);
};

export default handler;
