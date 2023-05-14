export type HondDto = {
  id: string;
  naam: string;
  ras: {
    id: string;
    naam: string;
  };
  klant: {
    id: string;
    vnaam: string;
    lnaam: string;
  };
};
