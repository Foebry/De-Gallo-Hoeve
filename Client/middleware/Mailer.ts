interface Mailer {
  sendMail: (type: string, data: any) => void;
  contact: (data: { naam: string; email: string; bericht: string }) => void;
}

const send = (msg: any) => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require("@sendgrid/mail");
  console.log(process.env.SENDGRID_API_KEY);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export const getTemplateId = (type: string): string => {
  let templateId: string;
  switch (type) {
    case "register":
      templateId = "d-749bfb287b074dc68c8de14ac73ae240";
      break;
    case "contact":
      templateId = "a";
    default:
      templateId = "";
      break;
  }

  return templateId;
};

const mailer: Mailer = {
  sendMail: (type, { email, ...templateData }) => {
    send({
      to: email,
      from: "info@degallohoeve.be",
      templateId: getTemplateId(type),
      dynamic_template_data: { ...templateData },
    });
  },

  contact: ({ naam, email, bericht }) => {
    send({
      to: "sander.fabry@gmail.com",
      from: "info@degallohoeve.be",
      subject: "contact",
      text: bericht,
      html: bericht,
    });

    // mailer.sendMail("contact", { naam, email, bericht });
  },
};

export default mailer;
