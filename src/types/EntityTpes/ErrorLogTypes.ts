import { ObjectId } from "mongodb";

export interface ErrorLogCollection extends NewErrorLog {
  _id: ObjectId;
}

export interface NewErrorLog {
  created_at: Date;
  endpoint: string;
  payload: object;
  error: any;
  method: string;
  query?: object | string[];
}

export const ERRORLOG = "ErrorLogController";
