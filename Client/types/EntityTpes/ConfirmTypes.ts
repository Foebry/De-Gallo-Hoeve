import { ObjectId } from "mongodb";

export interface ConfirmCollection extends NewConfirm {
  _id: ObjectId;
  code: string;
  valid_to: Date;
}

export interface NewConfirm {
  klant_id: ObjectId;
  created_at: Date;
}

export const CONFIRM = "ConfirmController";
