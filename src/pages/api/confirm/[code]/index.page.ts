import { NextApiRequest, NextApiResponse } from 'next';
import { reset } from './reset';
import { confirm } from './confirm';
import { ConfirmRequest, ResetRequest } from './schemas';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return confirm(req as ConfirmRequest, res);
  else if (req.method === 'PUT') return reset(req as ResetRequest, res);
  else return res.status(405).json({ code: 405, message: 'Not Allowed' });
};

export default handler;
