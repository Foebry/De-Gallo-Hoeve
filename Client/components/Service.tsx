import { useRouter } from "next/router";
import React from "react";
import { Caption } from "./Typography/Typography";
import { Body } from "./Typography/Typography";

export interface ServiceProps {
  id: string;
  caption: string;
  image: string;
  summary: string;
  alt?: string;
  link: string;
}

const Service: React.FC<ServiceProps> = ({
  caption,
  image,
  summary,
  alt = "",
  link,
}) => {
  const router = useRouter();
  return (
    <article className="block min-w-2xs min-h-xs max-w-2xs flex-grow flex-shrink basis-76 md:basis-38">
      <div
        className="shadow-sm w-full rounded-sm hover:cursor-pointer hover:shadow-none hover:ml-1"
        onClick={() => router.push(link)}
      >
        <img
          className="block rounded-sm w-full aspect-3/2"
          src={image}
          alt={alt}
        />
      </div>
      <Caption>{caption}</Caption>
      <div className="h-52 overflow-hidden">
        <Body>{summary}</Body>
      </div>
    </article>
  );
};

export default Service;
