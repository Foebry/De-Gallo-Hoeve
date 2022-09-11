interface HelperInterface {
  getDisabledDays: (training: string) => Promise<string[]>;
  capitalize: (string: string) => string;
  createRandomConfirmCode: () => string;
}

const helper: HelperInterface = {
  getDisabledDays: async (training) => {
    const date = new Date();
    const zondag = 0;
    const [woensdag, vrijdag, zaterdag] = [3, 5, 6];
    // vandaag wordt steeds disabled
    const disabledDays = [date.toISOString().split(".")[0].split("T")[0]];

    const temp = new Date();
    const enddate = new Date(temp.setDate(temp.getDate() + 3650));

    while (true) {
      const newDate = new Date(date.setDate(date.getDate() + 1));
      const dateString = newDate.toISOString().split(".")[0].split("T")[0];
      if (training === "groep" && newDate.getDay() !== zondag)
        disabledDays.push(dateString);
      else if (
        training === "prive" &&
        ![woensdag, vrijdag, zaterdag].includes(newDate.getDay())
      )
        disabledDays.push(dateString);
      if (newDate.getTime() > enddate.getTime()) return disabledDays;
    }
  },
  capitalize: (string) => {
    const words = string.split(" ");
    return words
      .map(
        (word) =>
          word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
      )
      .join(" ");
  },
  createRandomConfirmCode: () => Math.random().toString(36).substring(2),
};

export const { getDisabledDays, capitalize, createRandomConfirmCode } = helper;
