import React, { ReactNode, useState } from "react";

interface DetailsProps {
  summary: string;
  children: ReactNode;
  button?: boolean;
  className?: string | null;
}

const Details: React.FC<DetailsProps> = ({
  summary,
  children,
  button,
  className,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleToggle = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  return (
    <details
      className="w-full relative my-5 hover:cursor-pointer"
      open={isOpen}
    >
      <summary
        className={`${className} list-none text-xl text-green-200 text-center font-medium`}
        onClick={handleToggle}
      >
        {button && (
          <span
            className="absolute left-0 -top-10 w-5 h-5 text-sm text-center bg-green-300 text-gray-100 pointer-events-auto"
            onClick={handleToggle}
          >
            {isOpen ? "-" : "+"}
          </span>
        )}
        {(!isOpen || !button) && summary}
      </summary>
      {children}
    </details>
  );
};

export default Details;
