import React from 'react';
import { ADMIN, INDEX, LOGIN, REGISTER } from '../types/linkTypes';
import { Title3 } from './Typography/Typography';
import Image from 'next/image';
import { useRouter } from 'next/router';
import NavLink from './NavLink';
import { Hamburger } from './Hamburger';
import { useUserContext } from 'src/context/app/UserContext';

export const Nav = () => {
  const router = useRouter();
  const { klant: activeUser, logout } = useUserContext();

  return (
    <div className="relative w-full shadow h-16 z-20 md:mb-0 md:block">
      <div className="max-w-7xl flex justify-between items-center mx-auto px-5">
        <div className="flex gap-2 items-center cursor-pointer 3xs:gap-10" onClick={() => router.push(INDEX)}>
          <div className="w-16">
            <Image
              src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659613403/De-Gallo-Hoeve/content/logo-r_vwnpdy.png"
              width={64}
              height={64}
              alt="degallohoeve training privé hond honden hondentraining hondtrainer hondentrainer"
            />
          </div>
          <div className="hidden 4xs:block text-lg uppercase text-green-200 font-medium">
            <Title3>De Gallo-Hoeve</Title3>
          </div>
        </div>
        {/* <NavLink href={CHANGELOG} label="nieuw" /> */}
        {activeUser ? (
          <div className="flex gap-10 items-center">
            <div className="hidden xs:block uppercase text-green-200 text-lg font-medium">
              <Title3>
                <span className="capitalize">Hallo</span> {activeUser.vnaam}
              </Title3>
            </div>
            <Hamburger roles={parseInt(activeUser.roles)}>
              <span className="block xs:hidden capitalize border rounded py-1 px-1.5 text-gray-100 bg-green-100 cursor-pointer w-full hover:text-green-200 hover:bg-gray-100 text-md font-medium">
                Hallo {activeUser.vnaam}
              </span>
              {parseInt(activeUser.roles) > 0 && (
                <NavLink
                  href={ADMIN}
                  label="admin"
                  className="hover:text-green-200 hover:bg-gray-100 uppercase text-md font-medium"
                />
              )}
              <button
                className="capitalize border rounded py-1 px-1.5 text-gray-100 bg-green-100 cursor-pointer w-full hover:text-green-200 hover:bg-gray-100 text-md font-medium"
                onClick={logout}
              >
                logout
              </button>
            </Hamburger>
          </div>
        ) : (
          <>
            <nav className="hidden md:flex gap-4 text-lg uppercase pr-5 text-gray-50 font-medium">
              <NavLink href={LOGIN} label="login" />
              <NavLink href={REGISTER} label="registreer" />
            </nav>
            <div className="block md:hidden">
              <Hamburger roles={0}>
                <NavLink
                  href={LOGIN}
                  label="login"
                  className="hover:text-green-200 hover:bg-gray-100 uppercase text-md font-medium"
                />
                <NavLink
                  href={REGISTER}
                  label="register"
                  className="hover:text-green-200 hover:bg-gray-100 uppercase text-md font-medium"
                />
              </Hamburger>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
