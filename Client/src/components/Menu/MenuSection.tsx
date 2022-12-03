import Link from "next/link";
import React, { ReactNode } from "react";

interface Props {
  title: string;
  children?: ReactNode;
  icon: ReactNode;
  link?: string;
}

const MenuSection: React.FC<Props> = ({ title, children, icon, link }) => {
  return (
    <div className="my-5 text-gray-100">
      {link ? (
        <Link href={link}>
          <p className="flex items-center gap-2 capitalize cursor-pointer hover:font-bold">
            {icon}
            {title}
          </p>
        </Link>
      ) : (
        <p className="flex items-center gap-2 capitalize">
          {icon}
          {title}
        </p>
      )}
      {children && <div>{children}</div>}
    </div>
  );
};

export default MenuSection;
