interface Mailer {
  sendMail: (type: string) => void;
}

const mailer: Mailer = {
  sendMail: (type) => {
    console.log(`sending ${type} mail`);
  },
};

export default mailer;
