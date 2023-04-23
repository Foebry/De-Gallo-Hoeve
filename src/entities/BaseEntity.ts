import { ObjectId } from 'mongodb';
import { getCurrentTime } from 'src/shared/functions';

export type BaseEntityType = {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
};

class BaseEntity {
  _id!: ObjectId;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  constructor() {
    this._id = new ObjectId();
    this.created_at = getCurrentTime();
    this.updated_at = this.created_at;
  }
}

export default BaseEntity;
