export type InschrijvingDto = {
  id: string;
  datum: string;
  training: string;
  created_at: string;
  klant: {
    id: string;
    vnaam: string;
    lnaam: string;
  };
  hond: {
    id: string;
    naam: string;
    ras: string;
  };
};
