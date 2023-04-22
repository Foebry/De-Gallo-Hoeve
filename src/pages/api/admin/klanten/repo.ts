import moment from 'moment';
import { getInschrijvingCollection, getKlantCollection } from 'src/utils/db';
import { nextThresholdShouldTrigger } from './service';

export const getKlantenForFeedback = async () => {
  const inschrijvingCollection = await getInschrijvingCollection();
  const klantCollection = await getKlantCollection();

  const yesterday = new Date(moment().subtract(1, 'day').toISOString().split('T')[0]);
  const today = new Date(moment().toDate().toISOString().split('T')[0]);
  const inschrijvingFilter = { datum: { $gt: yesterday, $lt: today } };

  const yesterdayInschrijvingen = await inschrijvingCollection
    .find(inschrijvingFilter)
    .toArray();
  const klantIds = yesterdayInschrijvingen.map((inschrijving) => inschrijving.klant.id);
  const klanten = await klantCollection.find({ _id: { $in: klantIds } }).toArray();

  const filteredKlanten = klanten.filter(nextThresholdShouldTrigger);

  return filteredKlanten;
};
