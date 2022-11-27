interface Mailer {
  sendMail: (type: string, data: any) => Promise<void>;
  contact: (data: { naam: string; email: string; bericht: string }) => void;
}

const send = async (msg: any) => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export const getTemplateId = (type: string): string => {
  return type === "register"
    ? "d-749bfb287b074dc68c8de14ac73ae240"
    : type === "inschrijving"
    ? "d-454de7c4904a4e11a3583562345443b1"
    : type === "register-headsup"
    ? "d-26a342a4849645dbb53266ec8e4c0ff5"
    : type === "inschrijving-headsup"
    ? "d-32b2e43b878e480192fc34b41a640979"
    : "";
  // let templateId: string;
  // switch (type) {
  //   case "register":
  //     templateId = "d-749bfb287b074dc68c8de14ac73ae240";
  //     break;
  //   case "contact":
  //     templateId = "a";
  //     break;
  //   case "inschrijving":
  //     templateId = "d-454de7c4904a4e11a3583562345443b1 ";
  //     break;
  //   default:
  //     templateId = "";
  //     break;
  // }

  // return templateId;
};

const mailer: Mailer = {
  sendMail: async (type, { email, ...templateData }) => {
    await send({
      to: process.env.NODE_ENV !== "production" ? process.env.MAIL_TO : email,
      from: process.env.MAIL_FROM,
      templateId: getTemplateId(type),
      dynamic_template_data: { ...templateData },
    });
  },

  contact: ({ naam, email, bericht }) => {
    send({
      to: "info@degallohoeve.be",
      from: "info@degallohoeve.be",
      subject: "contact",
      text: bericht,
      html: bericht,
    });

    // mailer.sendMail("contact", { naam, email, bericht });
  },
};

export default mailer;
