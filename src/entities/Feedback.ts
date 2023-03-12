import { BaseEntityType } from '@/types/EntityTpes/BaseEntityType';
import BaseEntity from './BaseEntity';

export type FeedBackCollection = BaseEntityType & {
  happiness: number;
  communication: number;
  helpful: number;
  usage: number;
  recommend: number;
  missing?: string;
  overall?: string;
};

class Feedback extends BaseEntity {
  happiness!: number;
  communication!: number;
  helpful!: number;
  usage!: number;
  recommend!: number;
  missing?: string;
  overall?: string;

  static Create(
    happiness: number,
    communication: number,
    helpful: number,
    usage: number,
    recommend: number,
    missing?: string,
    overall?: string
  ) {
    const feedBack = new Feedback();
    feedBack.happiness = happiness;
    feedBack.communication = communication;
    feedBack.helpful = helpful;
    feedBack.usage = usage;
    feedBack.recommend = recommend;
    feedBack.missing = missing;
    feedBack.overall = overall;

    return feedBack;
  }
}

export default Feedback;
