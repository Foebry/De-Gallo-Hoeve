import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain } from 'src/shared/functions';
import { sendFeedBackMailsForKlanten } from 'src/utils/Mailer';
import { getKlantenForFeedback } from '../../admin/klanten/repo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const klanten = await getKlantenForFeedback();
  await sendFeedBackMailsForKlanten(klanten, getDomain(req));

  return res.status(200).send({ success: true });
};

export default handler;
