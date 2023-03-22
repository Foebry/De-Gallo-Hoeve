import { ObjectId } from 'mongodb';
import Feedback, { FeedBackCollection } from 'src/entities/Feedback';
import { getFeedbackCollection } from 'src/utils/db';

export const getFeedbackById = async (
  _id: ObjectId
): Promise<FeedBackCollection | null> => {
  const collection = await getFeedbackCollection();
  return collection.findOne({ _id });
};

export const getFeedbackByCode = async (
  code: string
): Promise<FeedBackCollection | null> => {
  const collection = await getFeedbackCollection();
  return collection.findOne({ code });
};

export const saveFeedback = async (feedback: Feedback): Promise<void> => {
  const collection = await getFeedbackCollection();
  await collection.insertOne(feedback);
};
