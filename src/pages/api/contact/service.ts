import mailer from 'src/utils/Mailer';
import { ContactTemplateData } from './schemas';

export const sendContactMail = async (body: ContactTemplateData) => {
  const templateData = {
    ...body,
    mailFrom: body.email,
    email: process.env.MAIL_TEST ?? process.env.MAIL_FROM,
  };
  await mailer.sendMail('contact', templateData);
  await mailer.sendMail('contact-confirm', body);
};
