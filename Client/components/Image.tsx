import React from "react";

export interface ImageProps {
  id: string;
}

const Image = () => {
  return (
    <article className="hidden first:block min-w-full max-w-1/2 basis-52 shadow-2sm 2xs:block 2xs:min-w-3xs xs:max-w-1/5 md:basis-15p lg:max-w-15p">
      <img
        className="block w-full h-auto aspect-square"
        src="https://loremflickr.com/200/200/dog"
        alt="honden hotel"
      />
    </article>
  );
};

export default Image;
