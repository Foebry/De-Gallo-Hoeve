import React, { ReactElement } from 'react';
import { Title3 } from 'src/components/Typography/Typography';
import { GoQuote } from 'react-icons/go';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { nanoid } from 'nanoid';

type Props = {
  name: string;
  rating: number;
  feedback: string;
};

const FeedbackCard: React.FC<Props> = ({ name, rating, feedback }) => {
  const stars = getStarsFromRating(rating);
  return (
    <div className="rounded border border-green-200 px-4 py-2 min-w-xs max-w-md">
      <Title3 className="text-green-200">{name}</Title3>
      <div className="text-center flex justify-center gap-1 mb-5 mt-2">{stars}</div>
      <div>
        <GoQuote className="text-green-200" />
        <p className="text-center italic">{feedback}</p>
        <div className="flex flex-row-reverse">
          <GoQuote className="text-green-200 rotate-180" />
        </div>
      </div>
    </div>
  );
};

const getStarsFromRating = (rating: number): ReactElement[] => {
  const maxStars = 5;
  const fullStars = new Array(Math.floor(rating / 1))
    .fill(0)
    .map(() => <BsStarFill fill="#FFD700" key={nanoid(5)} />);
  const halfStar = rating % 1 ? <BsStarHalf fill="#FFD700" key={nanoid(5)} /> : undefined;

  const stars = halfStar ? [...fullStars, halfStar] : fullStars;
  const missingStars = new Array(maxStars - stars.length)
    .fill(0)
    .map(() => <BsStar fill="#FFD700" key={nanoid(5)} />);

  return [...stars, ...missingStars];
};

export default FeedbackCard;
