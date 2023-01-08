import { NextApiRequest } from "next";
import { getCurrentTime } from "src/services/Factory";
import { InternalServerError } from "src/shared/RequestError";
import { NewErrorLog } from "src/types/EntityTpes/ErrorLogTypes";
import client from "src/utils/MongoDb";

const getErrorLogCollection = () => {
  const database = process.env.MONGODB_DATABASE;
  return client.db(database).collection("ErrorLog");
};

export const save = async (errorLog: NewErrorLog): Promise<void> => {
  const { acknowledged } = await getErrorLogCollection().insertOne(errorLog);
  if (!acknowledged) throw new InternalServerError();
};

export const logError = (
  endpoint: string,
  request: NextApiRequest,
  error: any
) => {
  const errorLog = {
    created_at: getCurrentTime(),
    endpoint: request.url ?? endpoint,
    payload: request.body,
    error,
    method: request.method ?? "",
    query: request.query,
  };
  save(errorLog);
};
