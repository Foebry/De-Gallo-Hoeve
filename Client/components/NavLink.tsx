import Link from "next/link";
import React from "react";

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
  return (
    <div className="capitalize border rounded py-1 px-1.5 text-gray-100 bg-green-100 cursor-pointer">
      <Link href={href}>{label}</Link>
    </div>
  );
};

export default NavLink;
