import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';
import { closeClient } from 'src/utils/db';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') return logout(res);
  return res.status(405).json({ code: 405, message: 'Not Allowed' });
};

const logout = async (res: NextApiResponse) => {
  destroyCookie({ res }, 'JWT', {
    httpOnly: true,
    maxAge: 3600,
    secure: false,
    sameSite: 'strict',
    path: '/',
  });
  destroyCookie({ res }, 'Client', {
    httpOnly: false,
    maxAge: 3600,
    secure: false,
    sameSite: 'strict',
    path: '/',
  });

  return res.status(200).json({});
};

export default handler;
