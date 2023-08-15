import { KlantHond } from '@/types/EntityTpes/HondTypes';
import { ObjectId } from 'mongodb';
import { getKlantCollection } from 'src/utils/db';

export const getHonden = async (
  skip: number,
  take: number,
  query?: { ids?: string }
): Promise<[number, KlantHond[]]> => {
  const collection = await getKlantCollection();
  const hondIds = query?.ids?.split(',').map((id) => new ObjectId(id));

  const matchStep1 = { $match: { deleted_at: undefined } };
  const projectStep = { $project: { honden: 1, lnaam: 1, vnaam: 1, _id: 1 } };
  const unwindStep = { $unwind: { path: '$honden' } };
  const groupStep = {
    $group: {
      _id: null,
      allHonden: {
        $push: { hond: '$honden', klant: { _id: '$_id', lnaam: '$lnaam', vnaam: '$vnaam', deleted_at: '$deleted_at' } },
      },
    },
  };
  const unwindStep2 = { $unwind: { path: '$allHonden' } };
  const projectStep2 = {
    $project: {
      _id: '$allHonden.hond._id',
      ras: '$allHonden.hond.ras',
      geslacht: '$allHonden.hond.geslacht',
      geboortedatum: '$allHonden.hond.geboortedatum',
      naam: '$allHonden.hond.naam',
      created_at: '$allHonden.hond.created_at',
      updated_at: '$allHonden.hond.updated_at',
      deleted_at: '$allHonden.hond.deleted_at',
      klant: {
        _id: '$allHonden.klant._id',
        vnaam: '$allHonden.klant.vnaam',
        lnaam: '$allHonden.klant.lnaam',
      },
    },
  };
  const matchStep2 = query?.ids
    ? { $match: { deleted_at: undefined, _id: { $in: hondIds } } }
    : { $match: { deleted_at: undefined } };

  const groupedHonden = collection.aggregate<KlantHond>([
    matchStep1,
    projectStep,
    unwindStep,
    groupStep,
    unwindStep2,
    projectStep2,
    matchStep2,
  ]);

  let count = 0;
  groupedHonden.forEach((_) => {
    count += 1;
  });

  const honden = await groupedHonden.skip(skip).limit(take).toArray();

  return [count, honden];
};
