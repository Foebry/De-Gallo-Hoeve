import { ERRORLOG } from '@/types/EntityTpes/ErrorLogTypes';
import { NextApiRequest, NextApiResponse } from 'next';
import { getController } from 'src/services/Factory';
import { logError } from './repo';

interface Request extends NextApiRequest {
  body: {
    error: any;
    errorInfo: any;
    page: string;
  };
}

const createErrorLog = async (req: Request, res: NextApiResponse) => {
  try {
    const { error, errorInfo, page } = req.body;
    await logError(page, req, { ...error, errorInfo });
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};

export default createErrorLog;
