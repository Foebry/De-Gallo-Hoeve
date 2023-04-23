import { NextApiRequest, NextApiResponse } from 'next';
import { updateFeedbackConfigurationForKlant } from 'src/common/domain/klant';
import { KLANT } from 'src/controllers/KlantController';
import { getController } from 'src/services/Factory';
import { getDomain } from 'src/shared/functions';
import { InsecureCronRequestError } from 'src/shared/RequestError';
import logger from 'src/utils/logger';
import { sendFeedBackMailsForKlanten } from 'src/utils/Mailer';
import { getKlantenForFeedback } from '../../admin/klanten/repo';

export interface CronFeedbackEmailRequest extends NextApiRequest {
  query: { key: string };
}

const handler = async (req: CronFeedbackEmailRequest, res: NextApiResponse) => {
  try {
    logger.info(`Starting job...`);
    const { key } = req.query;
    if (key !== process.env.CRON_FEEDBACK_EMAIL_KEY) throw new InsecureCronRequestError();
    const klantController = getController(KLANT);
    const klanten = await getKlantenForFeedback();
    logger.info(`found ${klanten.length} klanten to send feedback-email to`);
    await sendFeedBackMailsForKlanten(klanten, getDomain(req));

    klanten.forEach((klant) => updateFeedbackConfigurationForKlant(klant));
    await Promise.all(klanten.map((klant) => klantController.update(klant._id, klant)));

    logger.info(`job done...`);
    return res.status(200).send({ success: true });
  } catch (err: any) {
    return res.status(err.code).json(err.response);
  }
};

export default handler;
