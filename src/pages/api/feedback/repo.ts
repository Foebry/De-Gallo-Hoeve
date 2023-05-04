import moment from 'moment';
import { InsertOneResult, ObjectId } from 'mongodb';
import Feedback, { FeedBackCollection } from 'src/entities/Feedback';
import { getFeedbackCollection } from 'src/utils/db';

export const getFeedbackById = async (
  _id: ObjectId
): Promise<FeedBackCollection | null> => {
  const collection = await getFeedbackCollection();
  return collection.findOne({ _id });
};

export const getAllFeedback = async (): Promise<FeedBackCollection[]> => {
  const collection = await getFeedbackCollection();
  const daysAgo = moment().subtract(7, 'days').toDate();
  return collection
    .find({ created_at: { $lte: daysAgo } }, { sort: { created_at: -1 } })
    .toArray();
};

export const getFeedbackByCode = async (
  code: string
): Promise<FeedBackCollection | null> => {
  const collection = await getFeedbackCollection();
  return collection.findOne({ code });
};

export const saveFeedback = async (
  feedback: Feedback
): Promise<InsertOneResult<FeedBackCollection>> => {
  const collection = await getFeedbackCollection();
  return collection.insertOne(feedback);
};

export const deleteAll = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    const collection = await getFeedbackCollection();
    await collection.deleteMany({});
  }
};
