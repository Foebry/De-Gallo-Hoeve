import { ObjectId } from 'mongodb';
import { NextApiRequest } from 'next';
import { getCurrentTime } from 'src/shared/functions';
import { InternalServerError } from 'src/shared/RequestError';
import { NewErrorLog } from 'src/types/EntityTpes/ErrorLogTypes';
import { getErrorLogCollection } from 'src/utils/db';

const save = async (errorLog: NewErrorLog): Promise<void> => {
  const collection = await getErrorLogCollection();
  const { acknowledged } = await collection.insertOne({
    _id: new ObjectId(),
    ...errorLog,
  });
  if (!acknowledged) throw new InternalServerError();
};

export const logError = async (
  endpoint: string,
  request: NextApiRequest | undefined,
  error: any
) => {
  const errorLog = {
    created_at: getCurrentTime(),
    endpoint: request?.url ?? endpoint,
    payload: request?.body,
    error,
    method: request?.method ?? '',
    query: request?.query,
  };
  save(errorLog);
};

const deleteAll = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    const collection = await getErrorLogCollection();
    await collection.deleteMany({});
  }
};

const errorLogController: ErrorLogController = {
  logError,
  deleteAll,
};

export type ErrorLogController = {
  logError: (endpoint: string, request: NextApiRequest, error: any) => Promise<void>;
  deleteAll: () => Promise<void>;
};

export default errorLogController;
