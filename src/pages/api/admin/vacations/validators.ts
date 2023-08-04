import { VacationOverLappingError } from 'src/shared/RequestError';
import { getVacationsBetweenStartAndEndDate } from './repo';

export const validateVacationNotOverlapping = async (
  startDate: Date,
  endDate: Date
): Promise<void> => {
  const vacations = await getVacationsBetweenStartAndEndDate(startDate, endDate);
  console.log({ vacations });
  if (vacations.length) throw new VacationOverLappingError();
};
