import moment from 'moment';
import { getNextTresholdAmount, IsKlantCollection } from 'src/common/domain/klant';
import { createRandomConfirmCode } from 'src/pages/api/confirm/[code]/repo';
import { logError } from 'src/pages/api/logError/repo';
import logger from './logger';

interface Mailer {
  sendMail: (type: string, data: any) => Promise<void>;
  contact: (data: { naam: string; email: string; bericht: string }) => Promise<void>;
}

const send = async (msg: any) => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail
    .send(msg)
    .then(() => {
      logger.info('Email sent');
    })
    .catch((error: any) => {
      logError('email', undefined, error);
      logger.error(error);
    });
};

export const getTemplateId = (type: string): string => {
  return type === 'register'
    ? 'd-749bfb287b074dc68c8de14ac73ae240'
    : type === 'inschrijving'
    ? 'd-454de7c4904a4e11a3583562345443b1'
    : type === 'register-headsup'
    ? 'd-26a342a4849645dbb53266ec8e4c0ff5'
    : type === 'inschrijving-headsup'
    ? 'd-32b2e43b878e480192fc34b41a640979'
    : type === 'inschrijving-annulatie-admin'
    ? 'd-302fd6359b784bb0983be6328420059b'
    : type === 'resetConfirm'
    ? 'd-02f99049dfcd4fafbd96ecae9ec0b405'
    : type === 'customerFeedback'
    ? 'd-5390df6e28734a3d884d08d1431e6d91'
    : type === TemplateIds.CONTACT
    ? 'd-b46dde21b5e14253b390b49b4ac6c33f'
    : type === TemplateIds.CONTACT_CONFIRM
    ? 'd-ed7c6f5b2f164d4c99f5d5cd9de6a6c4'
    : '';
};

enum TemplateIds {
  RESET_CONFIRM = 'resetConfirm',
  CUSTOMER_FEEDBACK = 'customerFeedback',
  CONTACT = 'contact',
  CONTACT_CONFIRM = 'contact-confirm',
}

const mailer: Mailer = {
  sendMail: async (type, { email, ...dynamic_template_data }) => {
    await send({
      to: email,
      from: process.env.MAIL_FROM,
      templateId: getTemplateId(type),
      dynamic_template_data,
    });
  },

  /**
   * @deprecated
   * Should use the sendMail function instead
   */
  contact: async ({ naam, email, bericht }) => {
    await send({
      to: process.env.MAIL_FROM,
      from: process.env.MAIL_TO,
      subject: 'contact',
      text: bericht,
      html: bericht,
    });

    // mailer.sendMail("contact", { naam, email, bericht });
  },
};

type ResetConfirmData = {
  email: string;
  vnaam: string;
  code: string;
  domain?: string;
};

export const sendResetConfirmMail = async (
  klant: IsKlantCollection,
  code: string,
  domain: string | undefined
) => {
  const resetConfirmTemplateData: ResetConfirmData = {
    email: process.env.MAIL_TO ?? klant.email,
    vnaam: klant.vnaam,
    code,
    domain: domain ?? 'https://degallohoeve.be',
  };
  await mailer.sendMail(TemplateIds.RESET_CONFIRM, resetConfirmTemplateData);
};

export const sendFeedBackMailsForKlanten = async (
  klanten: IsKlantCollection[],
  domain: string | undefined
) => {
  const mailsToSend = klanten.map((klant) => ({
    email: process.env.MAIL_TO ?? klant.email,
    vnaam: klant.vnaam,
    amount: getNextTresholdAmount(klant),
    domain: domain ?? 'https://degallohoeve.be',
    code: createRandomConfirmCode(klant._id, {
      valid_to: moment().add(1, 'year').toDate(),
    }),
  }));

  await Promise.all(
    mailsToSend.map((templateData) =>
      mailer.sendMail(TemplateIds.CUSTOMER_FEEDBACK, templateData)
    )
  );
};

export default mailer;
