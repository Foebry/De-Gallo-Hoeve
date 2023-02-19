import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
}

interface LinkProps extends Props {
  to: string;
}

export const Title1: React.FC<Props> = ({ children, className, color }) => {
  return (
    <h1
      className={`${className} text-5xl text-center my-18 text-black-200 4xs:text-6xl xs:text-7xl`}
    >
      {children}
    </h1>
  );
};

export const Title2: React.FC<Props> = ({ children, className }) => {
  return (
    <h2
      className={`${className} text-4xl text-black-200 4xs:text-5xl text-center mt-12 mx-auto mb-12`}
    >
      {children}
    </h2>
  );
};

export const Title3: React.FC<Props> = ({ children, className }) => {
  return (
    <h3 className={`${className} text-2xl text-center text-black-200 py-2.5`}>
      {children}
    </h3>
  );
};

export const Title4: React.FC<Props> = ({ children, className }) => {
  return (
    <h4 className={`${className} text-xl text-center text-black-200 my-1.5`}>
      {children}
    </h4>
  );
};

export const Caption: React.FC<Props> = ({ className, children }) => {
  return (
    <h4
      className={`${className} text-center text-xl text-black-200 mt-2.5 mb-5 capitalize underline`}
    >
      {children}
    </h4>
  );
};

export const Body: React.FC<Props> = ({ children, className, color }) => {
  return (
    <p className={`${className} text-${color ?? 'black-100'} text-base mb-2`}>
      {children}
    </p>
  );
};

export const EbmeddedLink: React.FC<LinkProps> = ({ children, to }) => {
  return (
    <Link href={to}>
      <span className="text-center text-green-500 underline hover:cursor-pointer">
        {children}
      </span>
    </Link>
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
    <p className={`${className} absolute left-1 -bottom-3.5 text-red-600 text-xs`}>
      {children}
    </p>
  );
};
