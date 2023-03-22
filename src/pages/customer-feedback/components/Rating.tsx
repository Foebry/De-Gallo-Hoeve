import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FormError, Title4 } from 'src/components/Typography/Typography';
import { FeedbackBody } from 'src/pages/api/feedback/schemas';

type Props = {
  question: string;
  min: string;
  max: string;
  value: number;
  onChange: any;
  required?: boolean;
  fieldState?: any;
  name: string;
  errors: Partial<FeedbackBody>;
};

const Rating: React.FC<Props> = ({
  question,
  min,
  max,
  value,
  onChange,
  required = true,
  errors,
  name,
}) => {
  const [rating, setRating] = useState<number>(value ?? 0);
  const [chosenRating, setChosenRating] = useState<number>(value ?? 0);
  const [error, setError] = useState<string | undefined | number>(
    errors[name as keyof typeof errors]
  );
  return (
    <div>
      <Title4 className={`${error ? 'text-red-900' : 'text-green-200'} mb-10`}>
        {question} {required && <span className="text-red-900">*</span>}
      </Title4>
      <div className="flex gap-5 justify-center mb-20 relative">
        {new Array(5).fill(0).map((_, index) =>
          rating >= index + 1 ? (
            <div className="relative" key={nanoid(5)}>
              {index === 0 && (
                <span className="absolute -top-8 right-0 whitespace-nowrap font-semibold">
                  {min}
                </span>
              )}
              {index === 4 && (
                <span className="absolute -top-8 left-0 whitespace-nowrap font-semibold">
                  {max}
                </span>
              )}
              <AiFillStar
                fill="#FFD700"
                className="text-4xl cursor-pointer"
                key={nanoid(5)}
                onMouseEnter={() => setRating(() => index + 1)}
                onMouseLeave={() => setRating(() => chosenRating || 0)}
                onClick={() => {
                  setChosenRating(() => index + 1);
                  setError(undefined);
                  onChange(index + 1);
                }}
              />
            </div>
          ) : (
            <div className="relative" key={nanoid(5)}>
              {index === 0 && (
                <span className="absolute -top-8 right-0 whitespace-nowrap font-semibold">
                  {min}
                </span>
              )}
              {index === 4 && (
                <span className="absolute -top-8 left-0 whitespace-nowrap font-semibold">
                  {max}
                </span>
              )}
              <AiOutlineStar
                className="text-4xl cursor-pointer"
                key={nanoid(5)}
                onMouseEnter={() => setRating(() => index + 1)}
                onMouseLeave={() => setRating(() => chosenRating || 0)}
                onClick={() => {
                  setChosenRating(() => index + 1);
                  setError(undefined);
                  onChange(index + 1);
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Rating;
