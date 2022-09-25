interface Mailer {
  sendMail: (type: string, data: any) => void;
}

export const getTemplateId = (type: string): string => {
  let templateId: string;
  switch (type) {
    case "register":
      templateId = "d-749bfb287b074dc68c8de14ac73ae240";
      break;
    default:
      templateId = "";
      break;
  }

  return templateId;
};

const mailer: Mailer = {
  sendMail: (type, { email, ...templateData }) => {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email, // Change to your recipient
      from: "info@degallohoeve.be", // Change to your verified sender
      templateId: getTemplateId(type),
      dynamic_template_data: {
        ...templateData,
      },
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error: any) => {
        console.error(error);
      });
  },
};

export default mailer;
