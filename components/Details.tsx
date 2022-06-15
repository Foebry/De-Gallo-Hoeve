import React, { ReactNode } from "react";

interface DetailsProps {
  summary: string;
  children: ReactNode;
}

const Details: React.FC<DetailsProps> = ({ summary, children }) => {
  return (
    <details className="relative my-5 -mx-20 px-30 py-5 border-2 border-solid border-green-100 rounded-md hover:cursor-pointer">
      <summary className="list-none text-xl">
        {summary}
        <span className="absolute right-2.5">open</span>
      </summary>
      {children}
    </details>
  );
};

export default Details;
