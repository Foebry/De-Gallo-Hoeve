import { NextApiResponse } from 'next';
import { getKlantById } from 'src/controllers/KlantController';
import Feedback from 'src/entities/Feedback';
import { validate } from 'src/services/Validator';
import { LinkAlreadyUsedError, LinkExpiredError } from 'src/shared/RequestError';
import { getIdAndExpirationTimeFromCode } from '../confirm/[code]/repo';
import { getFeedbackByCode, saveFeedback } from './repo';
import { CreateFeedbackRequest, FeedBackSchema } from './schemas';

export const createFeedback = async (
  req: CreateFeedbackRequest,
  res: NextApiResponse
) => {
  try {
    await validate({ req, res }, { schema: FeedBackSchema });
    const { code } = req.query;
    const { communication, happiness, helpful, overall, recommend, usage, missing } =
      req.body;

    const now = new Date().getTime();
    const [_id, expiration] = getIdAndExpirationTimeFromCode(code);
    if (now > expiration) throw new LinkExpiredError();

    const klant = await getKlantById(_id);
    if (!klant) throw new LinkExpiredError();

    const existingFeedback = await getFeedbackByCode(code);
    if (existingFeedback) throw new LinkAlreadyUsedError();

    const feedback = Feedback.Create(
      code,
      happiness,
      communication,
      helpful,
      usage,
      recommend,
      missing,
      overall,
      klant.vnaam
    );
    const { insertedId: feedbackId } = await saveFeedback(feedback);

    return res.status(201).send({ ...feedback, _id: feedbackId.toString() });
  } catch (err: any) {
    return res.status(err.code).json(err.response);
  }
};
