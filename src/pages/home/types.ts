import { FeedbackDto } from 'src/common/api/types/feedback';

export type IndexData = {
  prijsExcl: number;
  kmHeffing: number;
  gratisVerplaatsingBinnen: number;
  feedback?: FeedbackDto[];
};
