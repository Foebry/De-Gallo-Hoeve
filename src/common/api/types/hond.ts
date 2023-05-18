import { Geslacht } from '@/types/EntityTpes/HondTypes';

export type HondDto = {
  id: string;
  naam: string;
  geslacht: Geslacht;
  created_at: string;
  updated_at: string;
  ras: string;
  klant: {
    id: string;
    vnaam: string;
    lnaam: string;
  };
};
