import { NextApiRequest, NextApiResponse } from 'next';
import { createFeedback } from './create';
import { listFeedback } from './list';
import { CreateFeedbackRequest } from './schemas';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return createFeedback(req as CreateFeedbackRequest, res);
  if (req.method === 'GET') return listFeedback(res);
  else return res.status(405).json({ message: 'Not Allowed' });
};

export default handler;
