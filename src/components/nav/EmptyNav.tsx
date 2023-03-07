import Image from 'next/image';
import React from 'react';
import { Title3 } from '../Typography/Typography';

const EmptyNav: React.FC<{}> = () => {
  return (
    <div className="relative mb-30 w-full shadow h-16 z-20 md:mb-0 md:block">
      <div className="max-w-7xl flex justify-between items-center mx-auto px-5">
        <div className="flex gap-2 items-center 3xs: gap-10">
          <div className="w-16">
            <Image
              src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659613403/De-Gallo-Hoeve/content/logo-r_vwnpdy.png"
              width={64}
              height={64}
              alt="degallohoeve training privé hond honden hondentraining hondtrainer hondentrainer"
            />
          </div>
          <div className="hidden 4xs:block text-lg uppercase text-green-200 font-medium">
            <Title3>De Gallo-Hoeve</Title3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyNav;
