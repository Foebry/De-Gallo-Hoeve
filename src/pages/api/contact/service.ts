import mailer from 'src/utils/Mailer';
import { ContactRequestBody } from './schemas';

export const sendContactMail = async (body: ContactRequestBody) => {
  const templateData = {
    ...body,
    mailFrom: body.email,
    email: process.env.MAIL_TO ?? process.env.MAIL_FROM,
  };
  await mailer.sendMail('contact', templateData);
  await mailer.sendMail('contact-confirm', body);
};
