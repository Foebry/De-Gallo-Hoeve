import React from "react";

export interface ImageProps {
  id?: string;
  source: string;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ source, alt }) => {
  return (
    <article className="hidden first:block min-w-full max-w-1/2 basis-52 shadow-2sm 2xs:block 2xs:min-w-3xs xs:max-w-1/5 md:basis-15p lg:max-w-15p">
      <img
        className="block w-full h-auto aspect-square"
        src={source}
        alt={alt ?? "honden hotel"}
      />
    </article>
  );
};

export default Image;
