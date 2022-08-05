import React, { useEffect, useState } from "react";
import Link from "next/link";
import { INDEX, LOGIN, REGISTER } from "../types/linkTypes";
import { Title3 } from "./Typography/Typography";
import useMutation from "../hooks/useMutation";
import { LOGOUT } from "../types/apiTypes";
import Button from "./buttons/Button";
import Image from "next/image";
import { useRouter } from "next/router";

export const Nav = () => {
  const [userName, setUserName] = useState<string | null>();
  const logout = useMutation();
  const router = useRouter();

  const onLogout = async () => {
    await logout(LOGOUT, {}, {}, {}, { method: "DELETE" });
    localStorage.clear();
  };

  useEffect(() => {
    setInterval(() => {
      setUserName(localStorage.getItem("naam"));
    }, 1000);
  }, []);

  return (
    <div className="relative w-full h-16 hidden md:flex justify-between items-center px-76 shadow z-20">
      <div
        className="flex gap-10 items-center cursor-pointer"
        onClick={() => router.push(INDEX)}
      >
        <div className="w-16">
          <Image
            src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659613403/De-Gallo-Hoeve/content/logo-r_vwnpdy.png"
            width={64}
            height={64}
          />
        </div>
        <div className="text-lg uppercase text-green-200 font-medium">
          <Title3>De Gallo-Hoeve</Title3>
        </div>
      </div>
      <nav className="flex gap-4 text-lg uppercase pr-5 text-gray-50 font-medium">
        <Link href={LOGIN}>
          <Button label="Login" />
        </Link>
        <Link href={REGISTER}>
          <Button label="Registreer" />
        </Link>
        {userName && (
          <span
            className="text-gray-900 hover:cursor-pointer text-lg"
            onClick={onLogout}
          >
            Logout
          </span>
        )}
      </nav>
    </div>
  );
};

export const MobileNav = () => {
  return (
    <div className="visible md:invisible">
      <div className="navigation__logo">
        <img src="./images/logo.png" alt="" />
      </div>
      <nav className="burger">
        <ul>
          <li>
            <a href="#">home</a>
          </li>
          <li>
            <a href="#">hotel</a>
          </li>
          <li>
            <a href="#">trainingen</a>
          </li>
          <li>
            <a href="#">contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
