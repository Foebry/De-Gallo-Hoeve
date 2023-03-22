import { BaseEntityType } from '@/types/EntityTpes/BaseEntityType';
import BaseEntity from './BaseEntity';

export type FeedBackCollection = BaseEntityType & {
  name: string;
  code: string;
  happiness: number;
  communication: number;
  helpful: number;
  usage: number;
  recommend: number;
  missing?: string;
  overall?: string;
};

class Feedback extends BaseEntity {
  name!: string;
  code!: string;
  happiness!: number;
  communication!: number;
  helpful!: number;
  usage!: number;
  recommend!: number;
  missing?: string;
  overall?: string;

  static Create(
    code: string,
    happiness: number,
    communication: number,
    helpful: number,
    usage: number,
    recommend: number,
    missing?: string,
    overall?: string,
    name?: string
  ) {
    const feedBack = new Feedback();
    feedBack.code = code;
    feedBack.happiness = happiness;
    feedBack.communication = communication;
    feedBack.helpful = helpful;
    feedBack.usage = usage;
    feedBack.recommend = recommend;
    feedBack.missing = missing;
    feedBack.overall = overall;
    feedBack.name = name || 'Anoniem';

    return feedBack;
  }
}

export default Feedback;
