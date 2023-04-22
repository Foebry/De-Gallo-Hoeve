import { IsKlantCollection } from 'src/common/domain/klant';

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
