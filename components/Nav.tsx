import React from "react";
import Link from "next/link";
import {
  INDEX,
  HOTEL,
  TRAINING,
  CONTACT,
  LOGIN,
  REGISTER,
} from "../types/linkTypes";

export const Nav = () => {
  return (
    <div className="relative hidden md:flex justify-between h-16 rounded-l-4xl items-center  max-w-8xl my-10 mx-auto w-98p bg-grey-500">
      <div className="w-24">
        <img
          className="block w-full rounded-full aspect-square object-contain rotate-y-180 bg-grey-100"
          src="../images/logo-r.png"
          alt=""
        />
      </div>
      <div className="absolute left-40 flex gap-10 text-lg uppercase pr-5 text-gray-100">
        <Link href={LOGIN}>Login</Link>
        <Link href={REGISTER}>Registreer</Link>
      </div>
      <nav className="flex gap-10 text-lg uppercase pr-5 text-gray-100">
        <Link href={INDEX}>Home</Link>
        <Link href={HOTEL}>Hotel</Link>
        <Link href={TRAINING}>Trainingen</Link>
        <Link href={CONTACT}>Contact</Link>
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
