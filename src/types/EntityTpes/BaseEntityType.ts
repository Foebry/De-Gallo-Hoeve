import { ObjectId } from 'mongodb';

export type BaseEntityType = {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};
