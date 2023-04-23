import { getAllKlanten, KLANT } from 'src/controllers/KlantController';
import { createDefaultFeedbackConfiguration, getController } from 'src/services/Factory';
import { closeClient } from 'src/utils/db';
import logger from 'src/utils/logger';

export const handler = async () => {
  try {
    const allKlanten = await getAllKlanten(true);
    const klantenToUpdate = allKlanten.filter((klant) => !klant.feedbackConfiguration);
    logger.info(`Found ${klantenToUpdate.length} klanten to update`);

    for (const klant of klantenToUpdate) {
      klant.feedbackConfiguration = createDefaultFeedbackConfiguration();
      await getController(KLANT).update(klant._id, klant);
    }

    logger.info(`Script done...`);
  } catch (error: any) {
    logger.error(error.message);
  } finally {
    await closeClient();
    return true;
  }
};

export const description = () => {
  const fileName = __filename.split('\\').reverse()[0].split('.')[0];
  logger.info(
    `${fileName} - Will update all klanten and add the "feedbackConfiguration"-key with default value.`
  );
};
