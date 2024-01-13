import { NextApiRequest, NextApiResponse } from 'next';
import { getRassen } from './list';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'GET') return res.status(405).send({});

    const rassen = await getRassen(req, res);

    return res.status(200).send(rassen);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default handler;
