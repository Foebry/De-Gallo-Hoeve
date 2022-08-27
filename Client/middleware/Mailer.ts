interface Mailer {
  sendMail: (type: string) => void;
}

const mailer: Mailer = {
  sendMail: (type) => {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: "rain_fabry@hotmail.com", // Change to your recipient
      from: "info@degallohoeve.be", // Change to your verified sender
      subject: `Sending ${type} email`,
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
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
