import { getAllKlanten, KLANT } from 'src/controllers/KlantController';
import { getAllRassen, RAS } from 'src/controllers/rasController';
import { getController } from 'src/services/Factory';
import logger from 'src/utils/logger';

export const handler = async () => {
  try {
    const allRassen = await getAllRassen();
    const allKlanten = await getAllKlanten(true);

    logger.info(`Found ${allRassen.length} rassen to update`);
    logger.info(`Found ${allKlanten.length} klanten to update`);

    for (const ras of allRassen) {
      ras.naam = ras.naam.toLowerCase();
      await getController(RAS).update(ras._id, ras);
    }
    for (const klant of allKlanten) {
      klant.honden.forEach((hond) => (hond.ras = hond.ras.toLowerCase()));
      await getController(KLANT).update(klant._id, klant);
    }
    logger.info(`Script done...`);

    return true;
  } catch (error: any) {
    logger.error(error.message);
    return false;
  }
};

export const description = () => {
  const fileName = __filename.split('\\').reverse()[0].split('.')[0];
  logger.info(
    `${fileName} - Will update all rassen to have their names in lowerCasing. And update all klanten to have their honden.ras also lowerCased.`
  );
};
