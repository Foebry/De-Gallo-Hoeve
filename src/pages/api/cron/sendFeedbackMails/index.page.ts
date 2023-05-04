import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';
import sendFeedbackMails, { CronFeedbackEmailRequest } from './job';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') throw new NotAllowedError();
    return sendFeedbackMails(req as CronFeedbackEmailRequest, res);
  } catch (err: any) {
    return res.status(err.status).json(err.response);
  }
};

export default handler;
