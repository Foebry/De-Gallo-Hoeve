import { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { adminApi } from 'src/services/Authenticator';
import { logError } from '../../logError/repo';
import listHonden, { ListRequest } from './list';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // adminApi({ req, res });

    if (req.method != 'GET') return res.status(405).send('Not Allowed');

    return listHonden(req as ListRequest, res);
  } catch (e: any) {
    await logError('honden', req, e);
    const isAxiosError = e instanceof AxiosError;
    if (isAxiosError === false) return res.status(500).send({ message: 'Er is iets misgegaan' });
    return res.status(e.code).send(e.message);
  }
};

export default handler;
