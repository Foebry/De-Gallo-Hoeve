import React from "react";
import { Caption } from "./Typography/Typography";
import { Body } from "./Typography/Typography";

export interface ServiceProps {
  id: string;
  caption: string;
  image: string;
  text: string;
  alt: string;
}

const Service: React.FC<ServiceProps> = ({ caption, image, text, alt }) => {
  return (
    <article className="basis-24 max-w-2xs min-h-xs min-w-2xs flex-grow flex-shrink">
      <div className="shadow-sm w-full rounded-sm hover:cursor-pointer hover:shadow-none hover:ml-1">
        <img
          className="block rounded-sm w-full aspect-3/2"
          src={image}
          alt={alt}
        />
      </div>
      <Caption>{caption}</Caption>
      <Body>{text}</Body>
    </article>
  );
};

export default Service;
