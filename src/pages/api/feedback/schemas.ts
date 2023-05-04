import { NextApiRequest, NextApiResponse } from 'next';
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

export interface CreateFeedbackRequest extends NextApiRequest {
  body: FeedbackBody;
  query: {
    code: string;
  };
}

export type FeedbackDto = {
  name: string;
  rating: number;
  feedback: string;
};

export type ListFeedbackResponse = NextApiResponse<FeedbackDto[]>;

export const FeedBackSchema = object({
  happiness: number()
    .required({
      happiness: 'isRequired',
      message: 'Gelieve alle verplichte velden (*) in te vullen',
    })
    .min(1)
    .max(5),
  communication: number()
    .required({
      communication: 'required',
      message: 'Gelieve alle verplichte velden (*) in te vullen',
    })
    .min(1)
    .max(5),
  helpful: number()
    .required({
      helpful: 'required',
      message: 'Gelieve alle verplichte velden (*) in te vullen',
    })
    .min(1)
    .max(5),
  usage: number()
    .required({
      usage: 'required',
      message: 'Gelieve alle verplichte velden (*) in te vullen',
    })
    .min(1)
    .max(5),
  recommend: number()
    .required({
      recommend: 'required',
      message: 'Gelieve alle verplichte velden (*) in te vullen',
    })
    .min(1)
    .max(5),
  missing: string().optional(),
  overall: string()
    .required({
      overall: 'required',
      message: 'Gelieve alle verplichte velden (*) in te vullen',
    })
    .max(200, {
      overall: 'Gelieve een maximum van 200 characters te hanteren',
    }),
});
