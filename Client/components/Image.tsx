import React from "react";

export interface ImageProps {
  id: string;
}

const Image = () => {
  return (
    <article className="flex flex-grow flex-shrink basis-15p max-w-15p min-w-3xs shadow-2sm">
      <img
        className="block w-full h-auto aspect-square"
        src="https://loremflickr.com/200/200/dog"
        alt="honden hotel"
      />
    </article>
  );
};

export default Image;
