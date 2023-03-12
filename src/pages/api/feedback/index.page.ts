import { NextApiRequest, NextApiResponse } from 'next';
import { createFeedback } from './create';
import { FeedbackRequest } from './schemas';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return createFeedback(req as FeedbackRequest, res);
  else return res.status(405).json({ message: 'Not Allowed' });
};

export default handler;
