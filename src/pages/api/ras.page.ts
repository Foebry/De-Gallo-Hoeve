import { NextApiRequest, NextApiResponse } from 'next';
import { getRasOptions } from 'src/utils/MongoDb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).send({});

  const rassen = await getRasOptions();

  return res.status(200).send(rassen);
};

export default handler;
