export type KlantDto = {
  id: string;
  vnaam: string;
  lnaam: string;
  verified: boolean;
  created_at: string;
  straat: string;
  nr: string;
  bus?: string;
  gemeente: string;
  postcode: string;
  email: string;
};
