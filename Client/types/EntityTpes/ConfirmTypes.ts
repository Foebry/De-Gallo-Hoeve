import { ObjectId } from "mongodb";

export interface ConfirmCollection extends NewConfirm {
  _id: ObjectId;
  code: string;
  valid_to: string;
}

export interface NewConfirm {
  klant_id: ObjectId;
  created_at: string;
}

export const CONFIRM = "ConfirmController";
