import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { useBannerContext } from 'src/context/BannerContext';

type Props = {
  content: string;
};

const Banner: React.FC<Props> = ({ content }) => {
  const { bannerContent } = useBannerContext();

  useEffect(() => {
    console.log({ updatedBannerContent: bannerContent });
  }, [bannerContent]);
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
