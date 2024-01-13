import { RasCollection } from '@/types/EntityTpes/RasTypes';
import { RasDto } from 'src/common/api/types/ras';

export function mapToRasDto(ras: RasCollection): RasDto;
export function mapToRasDto(rassen: RasCollection[]): RasDto[];
export function mapToRasDto(rasOrRassen: RasCollection | RasCollection[]) {
  if (isRasCollection(rasOrRassen)) {
    return { id: rasOrRassen._id.toString(), naam: rasOrRassen.naam };
  }
  return rasOrRassen.map((ras) => ({ id: ras._id.toString(), naam: ras.naam }));
}

const isRasCollection = (
  rassen: RasCollection | RasCollection[]
): rassen is RasCollection => {
  return '_id' in rassen && 'naam' in rassen && 'soort' in rassen;
};
