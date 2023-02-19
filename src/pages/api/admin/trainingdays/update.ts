import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import {
  getInschrijvingenByDates,
  INSCHRIJVING,
} from 'src/controllers/InschrijvingController';
import { deleteMany, saveMany, TRAININGDAY } from 'src/controllers/TrainingDayController';
import { adminApi } from 'src/services/Authenticator';
import { createTrainingDay, getController } from 'src/services/Factory';
import { ConfirmationNeededError } from 'src/shared/RequestError';
import mailer from 'src/utils/Mailer';
import {
  getDatesFromDeletedAndUpdatedTrainingDays,
  getDifferenceInTrainingDays,
  orderInschrijvingenToDeleteByKlantId,
} from './helpers';
import { cancelInschrijving } from './repo';
import { EditRequest, EditResponse } from './schemas';

export const setAvailabelDays = async (req: EditRequest, res: EditResponse) => {
  try {
    adminApi({ req, res });
    const { selected, confirmed } = req.body;

    const { currentTrainingDays, deletedTrainingDays, daysToAdd, daysToUpdate } =
      await getDifferenceInTrainingDays(selected);

    const inschrijvingenDatesToCheck = getDatesFromDeletedAndUpdatedTrainingDays(
      deletedTrainingDays,
      daysToUpdate,
      currentTrainingDays
    );

    const inschrijvingenToDelete = await getInschrijvingenByDates(
      inschrijvingenDatesToCheck
    );

    if (inschrijvingenToDelete.length > 0 && !confirmed)
      throw new ConfirmationNeededError({
        message: `Je staat op het punt om trainingdagen of -tijdstippen te verwijderen waar iemand zich op had ingeschreven.
          Als je doorgaat worden deze inschrijvingen geannuleerd en krijgen de klanten een annulatie-email.`,
      });

    if (inschrijvingenToDelete.length > 0) {
      for (const inschrijving of inschrijvingenToDelete) {
        await cancelInschrijving(inschrijving);
      }

      const orderedInschrijvingen = await orderInschrijvingenToDeleteByKlantId(
        inschrijvingenToDelete
      );
      for (const record of orderedInschrijvingen) {
        const data = Object.values(record)[0];
        data.email = process.env.MAIL_TO ?? data.email;
        await mailer.sendMail('inschrijving-annulatie-admin', data);
      }
    }

    if (deletedTrainingDays.length) {
      const _ids = deletedTrainingDays.map((day) => day._id);
      await deleteMany(_ids);
    }

    if (daysToAdd.length) {
      const trainingDays = daysToAdd.map((day: TrainingDayDto) => createTrainingDay(day));
      await saveMany(trainingDays);
    }

    for (const trainingDay of daysToUpdate) {
      await getController(TRAININGDAY).updateOne(trainingDay);
    }

    return res.status(200).send(selected);
  } catch (e: any) {
    return res.status(e.code).json(e.response);
  }
};
