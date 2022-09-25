import React, { useEffect, useState } from "react";
import { INDEX, LOGIN, REGISTER } from "../types/linkTypes";
import { Title3 } from "./Typography/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
import NavLink from "./NavLink";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import { Hamburger } from "./Hamburger";

export const Nav = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>();
  const [roles, setRoles] = useState<number>();

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
      setRoles(payload.roles);
    } else {
      setUserName(undefined);
      setRoles(undefined);
    }
  }, [cookies]);

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
            <Hamburger roles={roles!}>
              <NavLink href={LOGIN} label="login" />
            </Hamburger>
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
