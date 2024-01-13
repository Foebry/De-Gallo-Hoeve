import { RasCollection } from '@/types/EntityTpes/RasTypes';

export const mapToRasDto = (ras: RasCollection) => ({
  id: ras._id.toString(),
  naam: ras.naam,
  soort: ras.soort,
});
