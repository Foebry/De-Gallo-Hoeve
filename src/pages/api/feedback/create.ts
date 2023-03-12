import { NextApiResponse } from 'next';
import Feedback from 'src/entities/Feedback';
import { validate } from 'src/services/Validator';
import { LinkExpiredError } from 'src/shared/RequestError';
import { getKlantIdFromConfirmCode } from '../confirm/[code]/repo';
import { getFeedbackById, saveFeedback } from './repo';
import { FeedbackRequest, FeedBackSchema } from './schemas';

export const createFeedback = async (req: FeedbackRequest, res: NextApiResponse) => {
  try {
    await validate(
      { req, res },
      {
        schema: FeedBackSchema,
        message: 'Gelieve alle verplichte vragen (*) te beantwoorden',
      }
    );
    const { code } = req.query;
    const { communication, happiness, helpful, overall, recommend, usage, missing } =
      req.body;

    const now = new Date().getTime();
    const [_id, valid_to] = getKlantIdFromConfirmCode(code);
    if (now > valid_to) throw new LinkExpiredError();

    const existingFeedback = await getFeedbackById(_id);
    if (existingFeedback) throw new LinkExpiredError();

    const feedback = Feedback.Create(
      happiness,
      communication,
      helpful,
      usage,
      recommend,
      missing,
      overall
    );
    await saveFeedback(feedback);

    return res.status(201).send('OK');
  } catch (err: any) {
    return res.status(err.code).json(err.response);
  }
};
