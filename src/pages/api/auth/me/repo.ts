import { ObjectId } from 'mongodb';
import { getInschrijvingCollection, getKlantCollection } from 'src/utils/db';

export const getInschrijvingenByKlantId = async (klantId: ObjectId) => {
  const collection = await getInschrijvingCollection();
  return collection.find({ klant_id: klantId }).toArray();
};

export const getKlantById = async (klantId: string) => {
  const collection = await getKlantCollection();
  return collection.findOne({ _id: new ObjectId(klantId) });
};
