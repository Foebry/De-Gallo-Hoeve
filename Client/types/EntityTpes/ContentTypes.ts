import { ObjectId } from "mongodb";

export interface ContentCollection extends EditContent {
  _id: ObjectId;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export interface EditContent {
  subtitle: string;
  content: string;
  image: string;
  default_content: string;
}

export interface EditContentBody {}
