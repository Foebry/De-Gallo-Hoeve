import React, { useEffect, useState } from "react";
import Link from "next/link";
import { INDEX, LOGIN, REGISTER } from "../types/linkTypes";
import { Body, Title3 } from "./Typography/Typography";
import useMutation from "../hooks/useMutation";
import { LOGOUT } from "../types/apiTypes";
import Button from "./buttons/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import NavLink from "./NavLink";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export const Nav = () => {
  const [userName, setUserName] = useState<string | undefined>();
  const logout = useMutation();
  const router = useRouter();

  const onLogout = async () => {
    await logout(LOGOUT, {}, {}, {}, { method: "DELETE" });
    router.push(INDEX);
  };

  const token = parseCookies().Client;
  const secret = process.env.NEXT_PUBLIC_COOKIE_SECRET;
  let name: string | undefined = undefined;
  if (token) {
    const verifiedToken = jwt.verify(token, `${secret}`, {
      algorithms: ["RS256", "HS256"],
    });
    name = JSON.parse(JSON.stringify(verifiedToken)).name;
  }
  if (userName !== name) setUserName(name);

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
      {userName ? (
        <div className="flex gap-10 items-center">
          <div className="uppercase text-green-200 text-lg font-medium">
            <Title3>
              <span className="capitalize">Hallo</span> {userName}
            </Title3>
          </div>
          <Button label={"Logout"} onClick={onLogout} />
        </div>
      ) : (
        <nav className="flex gap-4 text-lg uppercase pr-5 text-gray-50 font-medium">
          <NavLink href={LOGIN} label="login" />
          <NavLink href={REGISTER} label="registreer" />
        </nav>
      )}
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
