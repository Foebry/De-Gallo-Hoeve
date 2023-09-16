import { ObjectId } from 'mongodb';
import { getInschrijvingCollection } from 'src/utils/db';

export const getInschrijvingenByKlantId = async (klantId: ObjectId) => {
  const collection = await getInschrijvingCollection();
  return collection.find({ klant_id: klantId }).toArray();
};
