import React, { useEffect, useMemo, useState } from "react";
import { INDEX, LOGIN, REGISTER } from "../types/linkTypes";
import { Title3 } from "./Typography/Typography";
import useMutation from "../hooks/useMutation";
import { LOGOUT, TRANSFER } from "../types/apiTypes";
import Button from "./buttons/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import NavLink from "./NavLink";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export const Nav = () => {
  const logout = useMutation();
  const router = useRouter();

  const onLogout = async () => {
    await logout(LOGOUT, {}, { method: "DELETE" });
    router.push(INDEX);
  };

  const [userName, setUserName] = useState<string>();

  const cookies = parseCookies();
  useEffect(() => {
    const token = cookies.Client;
    const secret = process.env.NEXT_PUBLIC_COOKIE_SECRET;
    if (token) {
      const verifiedToken = jwt.verify(token, `${secret}`, {
        algorithms: ["RS256", "HS256"],
      });
      const payload = JSON.parse(JSON.stringify(verifiedToken));
      setUserName(payload.name);
    } else setUserName(undefined);
  }, [cookies]);

  // const userName = useMemo(() => {
  //   const token = cookies.Client;
  //   const secret = process.env.NEXT_PUBLIC_COOKIE_SECRET;
  //   if (token) {
  //     const verifiedToken = jwt.verify(token, `${secret}`, {
  //       algorithms: ["RS256", "HS256"],
  //     });
  //     const payload = JSON.parse(JSON.stringify(verifiedToken));
  //     return payload.name;
  //   }
  //   return undefined;
  // }, [cookies]);

  return (
    <div className="relative mb-30 w-full shadow h-16 z-20 md:mb-0 md:block">
      <div className="max-w-7xl flex justify-between items-center mx-auto px-5">
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
          <div className="hidden xs:block text-lg uppercase text-green-200 font-medium">
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
          <nav className="hidden md:flex gap-4 text-lg uppercase pr-5 text-gray-50 font-medium">
            <NavLink href={LOGIN} label="login" />
            <NavLink href={REGISTER} label="registreer" />
          </nav>
        )}
      </div>
    </div>
  );
};

export const MobileNav = () => {
  return (
    <div className="block md:invisible">
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
