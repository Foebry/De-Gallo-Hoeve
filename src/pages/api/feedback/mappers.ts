import { FeedBackCollection, getRating } from 'src/entities/Feedback';
import { FeedbackDto } from './schemas';

export const mapToFeedbackList = (
  feedbackList: FeedBackCollection[]
): FeedbackDto[] | [] =>
  feedbackList.map((feedback) => ({
    id: feedback._id.toString(),
    feedback: feedback.overall!,
    name: feedback.name,
    rating: getRating(feedback),
  }));
