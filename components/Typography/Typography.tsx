import React, { ReactNode } from "react";

export interface Props {
  children: ReactNode;
  to?: string;
}

export const Title1: React.FC<Props> = ({ children }) => {
  return (
    <h1 className="text-center text-black-200 text-7xl my-20">{children}</h1>
  );
};

export const Title2: React.FC<Props> = ({ children }) => {
  return (
    <h2 className="text-center text-black-200 text-5xl mt-12 mb-20">
      {children}
    </h2>
  );
};

export const Title3: React.FC<Props> = ({ children }) => {
  return (
    <h3 className="text-2xl text-black-200 text-center my-2">{children}</h3>
  );
};

export const Caption: React.FC<Props> = ({ children }) => {
  return (
    <h4 className="text-center text-xl text-black-200 mt-2.5 mb-5 capitalize underline">
      {children}
    </h4>
  );
};

export const Body: React.FC<Props> = ({ children }) => {
  return <p className="text-black-200 text-base mb-2">{children}</p>;
};

export const Link: React.FC<Props> = ({ children, to }) => {
  return (
    <a
      href={to}
      className="text-center text-green-500 underline hover:cursor-pointer"
    >
      {children}
    </a>
  );
};

export const FootNote: React.FC<Props> = ({ children }) => {
  return (
    <p className="text-center text-black-200 absolute block w-full bottom-2.5">
      {children}
    </p>
  );
};
