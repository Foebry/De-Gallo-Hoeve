import React, { ReactNode } from "react";
import Link from "next/link";

interface Props {
  title: string;
  icon?: string | ReactNode;
  link: string;
}

const MenuItem: React.FC<Props> = ({ title, icon, link }) => {
  return (
    <div className="flex gap-2 items-center cursor-pointer text-gray-100 pl-5 my-2 capitalize hover:font-bold">
      {icon}
      <Link href={link}>{title}</Link>
    </div>
  );
};

export default MenuItem;
