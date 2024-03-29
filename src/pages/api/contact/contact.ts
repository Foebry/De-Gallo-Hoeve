import { contactSchema } from '@/types/schemas';
import { NextApiResponse } from 'next';
import { validate, validateCsrfToken } from 'src/services/Validator';
import { logError } from '../logError/repo';
import { ContactRequest } from './schemas';
import { sendContactMail } from './service';

export const contact = async (req: ContactRequest, res: NextApiResponse) => {
  try {
    await validateCsrfToken({ req, res });
    await validate(
      { req, res },
      { schema: contactSchema, message: 'Bericht niet verzonden' }
    );

    const { csrf, ...data } = req.body;
    await sendContactMail(data);
    return res.status(200).send({});
  } catch (e: any) {
    await logError('contact', req, e);
    return res.status(e.code).json(e.response);
  }
};
