import { NextApiRequest, NextApiResponse } from 'next';
import sendManualFeedbackMails from './job';
import { adminApi } from 'src/services/Authenticator';
import { NotAllowedError } from 'src/shared/RequestError';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    adminApi({ req, res });
    if (req.method !== 'GET') throw new NotAllowedError();
    return sendManualFeedbackMails(req, res);
  } catch (err: any) {
    return res.status(err.code).json(err.response);
  }
};

export default handler;
