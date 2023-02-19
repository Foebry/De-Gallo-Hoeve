import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { NextApiRequest, NextApiResponse } from 'next';
import { GenericRequest } from '../../auth/login.page';

interface Request extends NextApiRequest {
  body: { selected: TrainingDayDto[]; confirmed?: boolean };
}
export type EditRequest = GenericRequest<Request>;

export type EditResponse = NextApiResponse<TrainingDayDto[]>;
export type ListResponse = NextApiResponse<TrainingDayDto[]>;
