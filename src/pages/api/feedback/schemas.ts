import { NextApiRequest } from 'next';
import { number, object, string } from 'yup';

export type FeedbackBody = {
  happiness: number;
  communication: number;
  helpful: number;
  usage: number;
  recommend: number;
  missing?: string;
  overall?: string;
};

export interface FeedbackRequest extends NextApiRequest {
  body: FeedbackBody;
  query: {
    code: string;
  };
}

export const FeedBackSchema = object({
  happiness: number().required({ happiness: 'required' }).min(1).max(5),
  communication: number().required({ communication: 'required' }).min(1).max(5),
  helpful: number().required({ helpful: 'required' }).min(1).max(5),
  usage: number().required({ useful: 'required' }).min(1).max(5),
  recommend: number().required({ recommend: 'required' }).min(1).max(5),
  missing: string().optional(),
  overall: string().optional(),
});
