import moment from 'moment';
import { IsKlantCollection } from 'src/common/domain/klant';
import { getInschrijvingenByIds } from 'src/controllers/InschrijvingController';
import { getAllKlanten } from 'src/controllers/KlantController';

export const nextThresholdShouldTrigger = (value: IsKlantCollection): boolean => {
  const trainingAmount = value.inschrijvingen.length;
  const feedbackConfig = value.feedbackConfiguration;
  const treshold100 = feedbackConfig.find((setting) => setting.trainingCount === 100);
  const treshold50 = feedbackConfig.find((setting) => setting.trainingCount === 50);
  const treshold20 = feedbackConfig.find((setting) => setting.trainingCount === 20);
  const treshold10 = feedbackConfig.find((setting) => setting.trainingCount === 10);
  const treshold5 = feedbackConfig.find((setting) => setting.trainingCount === 5);
  const treshold1 = feedbackConfig.find((setting) => setting.trainingCount === 1);

  if (trainingAmount >= 100 && treshold100?.triggered === false) return true;
  else if (trainingAmount >= 50 && treshold50?.triggered === false) return true;
  else if (trainingAmount >= 20 && treshold20?.triggered === false) return true;
  else if (trainingAmount >= 10 && treshold10?.triggered === false) return true;
  else if (trainingAmount >= 5 && treshold5?.triggered === false) return true;
  else if (trainingAmount >= 1 && treshold1?.triggered === false) return true;
  else return false;
};

export const getIdsOfKlantenWhereNewTresholdWasBreached = async (): Promise<
  IsKlantCollection[]
> => {
  const allKlanten = await getAllKlanten();
  const yesterday = moment().subtract(1, 'day').toISOString().split('T')[0];
  const dateYesterday = new Date(yesterday);
  const mappedKlanten = await Promise.all(
    allKlanten.map(async (klant) => {
      const inschrijvingen = await getInschrijvingenByIds(klant.inschrijvingen);
      klant.inschrijvingen = inschrijvingen
        .filter((inschrijving) => inschrijving.datum.getTime() < dateYesterday.getTime())
        .map((inschrijving) => inschrijving._id);
      return klant;
    })
  );

  const filteredKlanten = mappedKlanten.filter(nextThresholdShouldTrigger);
  const filteredKlantenIds = filteredKlanten.map((klant) => klant._id.toString());

  return allKlanten.filter((klant) => filteredKlantenIds.includes(klant._id.toString()));
};
