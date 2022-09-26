import { ObjectId } from "mongodb";

export interface ContentCollection extends EditContent {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
  updated_by: Date;
}

export interface EditContent {
  subtitle: string;
  content: string;
  image: string;
  default_content: string;
}

export interface EditContentBody {}
