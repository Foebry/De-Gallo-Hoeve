import { ConfirmCollection } from '@/types/EntityTpes/ConfirmTypes';
import { IsKlantCollection } from '@/types/EntityTpes/KlantTypes';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import {
  createRandomConfirmCode,
  getCurrentTime,
  toLocalTime,
} from 'src/shared/functions';

export const createRandomConfirm = (klant?: IsKlantCollection): ConfirmCollection => {
  const currentTime = getCurrentTime();
  return {
    _id: new ObjectId(),
    code: createRandomConfirmCode(),
    created_at: currentTime,
    klant_id: klant?._id ?? new ObjectId(),
    valid_to: toLocalTime(moment(currentTime).add(1, 'hour').format()),
  };
};
