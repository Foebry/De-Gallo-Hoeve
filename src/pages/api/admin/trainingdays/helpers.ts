import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { InschrijvingCollection } from '@/types/EntityTpes/InschrijvingTypes';
import { TrainingDaysCollection } from '@/types/EntityTpes/TrainingType';
import { getKlantById } from 'src/controllers/KlantController';
import { toReadableDate } from 'src/shared/functions';
import { notEmpty } from 'src/shared/RequestHelper';
import { getEnabledTrainingDays } from './repo';

export const getDifferenceInTrainingDays = async (
  selected: TrainingDayDto[]
): Promise<{
  currentTrainingDays: TrainingDaysCollection[];
  deletedTrainingDays: TrainingDaysCollection[];
  daysToUpdate: TrainingDaysCollection[];
  daysToAdd: TrainingDayDto[];
}> => {
  const currentTrainingDays = await getEnabledTrainingDays();

  const hasDateBeenRemoved = (day: TrainingDaysCollection) =>
    !selected
      .map((newDay: TrainingDayDto) => newDay.date.split('T')[0])
      .includes(day.date.toISOString().split('T')[0]);

  const deletedTrainingDays = currentTrainingDays.filter(hasDateBeenRemoved);

  const daysToAdd = selected.filter(
    (newDay: TrainingDayDto) =>
      !currentTrainingDays
        .map((day) => day.date.toISOString().split('T')[0])
        .includes(newDay.date.split('T')[0])
  );

  const daysToUpdate = currentTrainingDays
    .filter(
      (curr) =>
        !deletedTrainingDays
          .map((day) => day.date.toISOString().split('T')[0])
          .includes(curr.date.toISOString().split('T')[0])
    )
    .filter(
      (curr) =>
        !daysToAdd
          .map((day: TrainingDayDto) => day.date.split('T')[0])
          .includes(curr.date.toISOString().split('T')[0])
    )
    .map((curr) => ({
      ...curr,
      timeslots:
        selected.find(
          (dto: TrainingDayDto) =>
            dto.date.split('T')[0] === curr.date.toISOString().split('T')[0]
        )?.timeslots ?? [],
    }));

  return { currentTrainingDays, deletedTrainingDays, daysToUpdate, daysToAdd };
};

export const getDatesFromDeletedAndUpdatedTrainingDays = (
  deletedTrainingDays: TrainingDaysCollection[],
  daysToUpdate: TrainingDaysCollection[],
  currentTrainingDays: TrainingDaysCollection[]
): Date[] => {
  let allDates = deletedTrainingDays
    .map((trainingDay) => {
      const day = trainingDay.date.toISOString().split('T')[0];
      const timeslots = trainingDay.timeslots;
      return timeslots.map((timeslot) => new Date(`${day}T${timeslot}`));
    })
    .reduce((acc, curr) => [...acc, ...curr], []);

  const moreDates = daysToUpdate
    .map((trainingDay) => {
      const day = trainingDay.date.toISOString().split('T')[0];
      const missingTimeslots = currentTrainingDays
        .find(
          (currentTrainingDay) =>
            currentTrainingDay.date.toISOString() === trainingDay.date.toISOString()
        )
        ?.timeslots.filter((timeslot) => !trainingDay.timeslots.includes(timeslot));

      return missingTimeslots?.map((timeslot) => {
        return new Date(`${day}T${timeslot}:00.000Z`);
      });
    })
    .filter(notEmpty)
    .reduce((acc, curr) => [...acc, ...curr]);

  return [...allDates, ...moreDates];
};

export const orderInschrijvingenToDeleteByKlantId = async (
  inschrijvingen: InschrijvingCollection[]
): Promise<Record<string, { vnaam: string; trainingen: string[]; email: string }>[]> => {
  const orderedInschrijvingen: Record<
    string,
    { vnaam: string; trainingen: string[]; email: string }
  >[] = [];
  for (const inschrijving of inschrijvingen) {
    const klant_id = inschrijving.klant.id;
    const klant = await getKlantById(klant_id);
    if (!klant) continue;
    const klantFoundInList = orderedInschrijvingen.find((record) =>
      Object.keys(record).includes(klant_id.toString())
    );
    if (!klantFoundInList) {
      const datum = toReadableDate(inschrijving.datum);
      orderedInschrijvingen.push({
        [klant_id.toString()]: {
          vnaam: inschrijving.klant.vnaam,
          trainingen: [datum],
          email: klant?.email,
        },
      });
    } else {
      orderedInschrijvingen.forEach((record) => {
        if (record !== klantFoundInList) return;
        const klantId = inschrijving.klant.id.toString();
        record[klantId].trainingen.push(toReadableDate(inschrijving.datum));
      });
    }
  }

  return orderedInschrijvingen;
};
