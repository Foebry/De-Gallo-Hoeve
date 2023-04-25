import { mapToFeedbackList } from './mappers';
import { getAllFeedback } from './repo';
import { ListFeedbackResponse } from './schemas';

export const listFeedback = async (res: ListFeedbackResponse) => {
  try {
    const feedbackList = await getAllFeedback();

    const data = mapToFeedbackList(feedbackList);

    return res.status(200).send(data);
  } catch (err: any) {
    return res.status(err.code).json(err.response);
  }
};
