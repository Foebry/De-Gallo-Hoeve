import { NextApiRequest, NextApiResponse } from 'next';
import { NotAllowedError } from 'src/shared/RequestError';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    throw new NotAllowedError();
  } catch (e: any) {
    return res.status(e.code).send(e.response);
  }
};

export default handler;
