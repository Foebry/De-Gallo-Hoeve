import { getAllKlanten } from 'src/controllers/KlantController';
import logger from 'src/utils/logger';
import { sendPriceAdjustmentEmailTo } from 'src/utils/Mailer';

export const handler = async () => {
  try {
    const allKlanten = await getAllKlanten();
    const allKlantenToSendEmailTo = allKlanten.filter((klant) => klant.roles === '0');

    const templateData = {
      startDate: '15 september 2023',
      startDateShort: '15 september',
      newPrice: 35,
      service: 'privé-trainingen',
    };

    await sendPriceAdjustmentEmailTo(allKlantenToSendEmailTo, templateData);

    return true;
  } catch (error: any) {
    logger.error(error.message);
  }
};

export const description = () => {
  const fileName = __filename.split('\\').reverse()[0].split('.')[0];
  logger.info(
    `${fileName} - Will send an email to all regular klanten to inform them of an upcoming price adjustment.`
  );
};
