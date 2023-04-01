import React from 'react';
import { Body, Caption, Title3, Title4 } from 'src/components/Typography/Typography';
import { GoQuote } from 'react-icons/go';

type Props = {
  name: string;
  rating: number;
  feedback: string;
};

const FeedbackCard: React.FC<Props> = ({ name, rating, feedback }) => {
  return (
    <div className="rounded border border-green-200 px-4 py-2 min-w-xs">
      <Title3 className="text-green-200">{name}</Title3>
      <div className="text-center">rating: {rating}</div>
      <div>
        <GoQuote className="text-green-200" />
        <Title4 className="text-center">{feedback}</Title4>
        <div className="flex flex-row-reverse">
          <GoQuote className="text-green-200 rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
