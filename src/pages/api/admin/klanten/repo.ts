import moment from 'moment';
import { WithId } from 'mongodb';
import { IsKlantCollection } from 'src/common/domain/klant';
import { getInschrijvingCollection, getKlantCollection } from 'src/utils/db';
import { nextThresholdShouldTrigger } from './service';

export type KlantenQuery = Partial<{
  search: string;
  ids: string;
}>;

export const getKlantenForFeedback = async () => {
  const inschrijvingCollection = await getInschrijvingCollection();
  const klantCollection = await getKlantCollection();

  const yesterday = new Date(`${moment().subtract(1, 'day').toISOString().split('T')[0]}T00:00:00.000Z`);
  const today = new Date(`${moment().toDate().toISOString().split('T')[0]}T00:00:00.000Z`);
  const inschrijvingFilter = { datum: { $gt: yesterday, $lt: today } };

  const yesterdayInschrijvingen = await inschrijvingCollection.find(inschrijvingFilter).toArray();
  const klantIds = yesterdayInschrijvingen.map((inschrijving) => inschrijving.klant.id);
  const klanten = await klantCollection.find({ _id: { $in: klantIds } }).toArray();

  const filteredKlanten = klanten.filter(nextThresholdShouldTrigger);

  return filteredKlanten;
};

export const getKlanten = async (
  skip: number,
  take: number,
  query?: KlantenQuery
): Promise<[number, WithId<IsKlantCollection>[]]> => {
  const collection = await getKlantCollection();
  const refinementQuery: Record<string, any> = { deleted_at: { deleted_at: undefined } };
  if (query?.search) {
    const searchQuery = {
      $or: [
        { email: { $regex: `${query.search}`, $options: 'i' } },
        { gemeente: { $regex: `${query.search}`, $options: 'i' } },
        { vnaam: { $regex: `${query.search}`, $options: 'i' } },
        { lnaam: { $regex: `${query.search}`, $options: 'i' } },
      ],
    };
    refinementQuery.search = searchQuery;
  }
  if (query?.ids) {
    const idsQuery = {
      id: { $in: query.ids },
    };
    refinementQuery.ids = idsQuery;
  }
  const refinements = Object.values(refinementQuery);

  const count = await collection.countDocuments({ $and: refinements });
  const klanten = await collection.find({ $and: refinements }).skip(skip).limit(take).toArray();

  return [count, klanten];
};
