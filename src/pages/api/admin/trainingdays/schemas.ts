import { TrainingDayDto } from '@/types/DtoTypes/TrainingDto';
import { NextApiRequest, NextApiResponse } from 'next';

export interface EditRequest extends NextApiRequest {
  body: { selected: TrainingDayDto[]; confirmed?: boolean };
}

export type EditResponse = NextApiResponse<TrainingDayDto[]>;
export type ListResponse = NextApiResponse<TrainingDayDto[]>;
