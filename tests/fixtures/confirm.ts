import { ConfirmCollection } from '@/types/EntityTpes/ConfirmTypes';
import { IsKlantCollection } from '@/types/EntityTpes/KlantTypes';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import { createRandomConfirmCode } from 'src/pages/api/confirm/[code]/repo';
import { getCurrentTime, toLocalTime } from 'src/shared/functions';

export const createRandomConfirm = (klant?: IsKlantCollection): ConfirmCollection => {
  const currentTime = getCurrentTime();
  return {
    _id: new ObjectId(),
    code: createRandomConfirmCode(klant?._id ?? new ObjectId()),
    created_at: currentTime,
    klant_id: klant?._id ?? new ObjectId(),
    valid_to: toLocalTime(moment(currentTime).add(1, 'hour').format()),
  };
};
