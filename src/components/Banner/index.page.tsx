import { nanoid } from 'nanoid';
import React from 'react';

type Props = {
  content: string;
};

const Banner: React.FC<Props> = ({ content }) => {
  return (
    <div className="border-2 border-green-200 text-center bg-green-100 py-2">
      {content.split('\n').map((paragraph) => (
        <p className="text-xl text-gray-100" key={nanoid()}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default Banner;
