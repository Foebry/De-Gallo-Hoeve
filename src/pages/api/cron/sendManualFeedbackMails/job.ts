import { NextApiRequest, NextApiResponse } from 'next';
import { updateFeedbackConfigurationForKlant } from 'src/common/domain/klant';
import { KLANT } from 'src/controllers/KlantController';
import { getController } from 'src/services/Factory';
import { getDomain } from 'src/shared/functions';
import { sendFeedBackMailsForKlanten } from 'src/utils/Mailer';
import { getIdsOfKlantenWhereNewTresholdWasBreached } from '../../admin/klanten/service';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const klantController = getController(KLANT);
  const klanten = await getIdsOfKlantenWhereNewTresholdWasBreached();

  await sendFeedBackMailsForKlanten(klanten, getDomain(req));

  klanten.forEach((klant) => updateFeedbackConfigurationForKlant(klant));
  await Promise.all(klanten.map((klant) => klantController.update(klant._id, klant)));

  return res.status(200).send({ success: true });
};

export default handler;
