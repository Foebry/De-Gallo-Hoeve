import { ObjectId } from 'mongodb';
import { getCurrentTime } from 'src/shared/functions';
import {Document} from 'mongodb'

export interface ObjectLiteral extends Document {
  [k: string]: any;
}

export default class Entitybase implements ObjectLiteral {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  name = Entitybase.name;

  constructor() {
    this._id = new ObjectId();
    this.created_at = getCurrentTime();
    this.updated_at = this.created_at;
    this.deleted_at = undefined;
  }

  softDelete = () => {
    this.deleted_at = getCurrentTime();
  };
}
