import { createServer, IncomingMessage, RequestListener } from 'http';
import { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';

export const getRequest = (handler: NextApiHandler) => {
  const listener: RequestListener = async (req: IncomingMessage, res) => {
    const queryParams = req.url?.split('?')[1]?.split('&');
    const query = queryParams
      ?.map((param) => ({
        [param.split('=')[0]]: param.split('=')[1],
      }))
      .reduce((curr, acc) => {
        return { ...acc, ...curr };
      }, {});
    return apiResolver(
      req,
      res,
      query ?? {},
      handler,
      { previewModeEncryptionKey: '', previewModeId: '', previewModeSigningKey: '' },
      false
    );
  };
  return request(createServer(listener));
};
