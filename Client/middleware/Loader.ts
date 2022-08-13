import db, { conn } from "./db";

interface Klant {
  id: number;
  email: string;
  roles: string;
  password: string;
  vnaam: string;
  lnaam: string;
  gsm: string;
  straat: string;
  nr: number;
  gemeente: string;
  postcode: number;
  verified: number;
}
interface Option {
  key: number;
  label: string;
}
interface Loader {
  getKlantByEmail: (email: string) => Promise<Klant>;
  getKlantById: (id: number) => Promise<Klant>;
  getDisabledDays: (training: string) => Promise<string[]>;
  getRasOptions: () => Promise<Option[]>;
  getHondOptions: (klant_id: number) => Promise<Option[]>;
}

const loader: Loader = {
  getKlantByEmail: async (email) => {
    return (await conn
      .select("*")
      .from("klant")
      .where({ email })
      .first()) as Klant;
  },

  getKlantById: async (id) => {
    return (await conn
      .select("*")
      .from("klant")
      .where({ id })
      .first()) as Klant;
  },

  getDisabledDays: async (training) => {
    const date = new Date();
    const disabledDays = [date.toISOString().split(".")[0].split("T")[0]];
    const temp = new Date();
    const enddate = new Date(temp.setDate(temp.getDate() + 365));
    while (true) {
      const newDate = new Date(date.setDate(date.getDate() + 1));
      const dateString = newDate.toISOString().split(".")[0].split("T")[0];
      if (training === "groep" && newDate.getDay() !== 0)
        disabledDays.push(dateString);
      else if (training === "prive" && ![3, 5, 6].includes(newDate.getDay()))
        disabledDays.push(dateString);
      if (newDate.getTime() > enddate.getTime()) return disabledDays;
    }
  },

  getRasOptions: async () => {
    return (await db.query({
      builder: conn.select("id as key", "naam as label").from("ras"),
    })) as Option[];
  },

  getHondOptions: async (klant_id) => {
    return (await db.query({
      builder: conn
        .select("id as value", "naam as label")
        .from("hond")
        .where({ klant_id }),
    })) as Option[];
  },
};

export const {
  getKlantByEmail,
  getKlantById,
  getDisabledDays,
  getRasOptions,
  getHondOptions,
} = loader;
