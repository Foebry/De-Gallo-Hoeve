import React, { ReactNode } from "react";

export interface Props {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const Title1: React.FC<Props> = ({ children }) => {
  return (
    <h1 className="text-5xl text-center my-18 text-black-200 3xs:text-6xl xs:text-7xl">
      {children}
    </h1>
  );
};

export const Title2: React.FC<Props> = ({ children }) => {
  return (
    <h2 className="text-4xl text-black-200 3xs:text-5xl text-center mt-12 mx-auto mb-18">
      {children}
    </h2>
  );
};

export const Title3: React.FC<Props> = ({ children }) => {
  return (
    <h3 className="text-2xl text-center text-black-200 my-2.5">{children}</h3>
  );
};

export const Caption: React.FC<Props> = ({ children }) => {
  return (
    <h4 className="text-center text-xl text-black-200 mt-2.5 mb-5 capitalize underline">
      {children}
    </h4>
  );
};

export const Body: React.FC<Props> = ({ children, className }) => {
  return (
    <p className={`${className} text-black-100 text-base mb-2`}>{children}</p>
  );
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

export const FormError: React.FC<Props> = ({ children, className }) => {
  return (
    <p
      className={`${className} absolute left-1 -bottom-3.5 text-red-600 text-xs`}
    >
      {children}
    </p>
  );
};
