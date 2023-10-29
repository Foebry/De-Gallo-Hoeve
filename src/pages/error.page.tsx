import React, { ReactElement } from 'react';
import { EbmeddedLink, Title2, Title3 } from '../components/Typography/Typography';
import Image from 'next/image';
import { Nav } from 'src/components/Nav';
import { NextRouter, useRouter } from 'next/router';
import { FrontEndErrorCodes } from 'src/shared/functions';
import useMutation from 'src/hooks/useMutation';
import logger from 'src/utils/logger';
import Head from 'next/head';
import { REQUEST_METHOD } from 'src/utils/axios';
import { toast } from 'react-toastify';

export const FallBack = () => {
  const router = useRouter();
  const { title, link } = useGetErrorInfo(router);

  return (
    <>
      <Head>
        <title>De Gallo-hoeve - Oeps..</title>
      </Head>
      <Nav />
      <div className="flex gap-20 justify-center py-72">
        <div>
          <Image
            src="https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659613403/De-Gallo-Hoeve/content/logo-r_vwnpdy.png"
            width={204}
            height={204}
            alt="Company Logo Togo"
          />
        </div>
        <div>
          <Title2 className="text-green-200">{title}</Title2>
          <Title3>{link}</Title3>
        </div>
      </div>
    </>
  );
};

const useGetErrorInfo = (router: NextRouter) => {
  const errorCode = Object.keys(router.query)[0];
  const confirmCode = Object.values(router.query)[1];
  const reset = useMutation<{}>(`api/confirm/${confirmCode}`);
  let title: string;
  let link: ReactElement;

  const renewVerificationCode = async () => {
    try {
      const { data, error } = await reset(`/?code=${confirmCode}`, {}, { method: REQUEST_METHOD.PUT });
      if (data) {
        toast.success('We hebben u een nieuwe verificatie-email toegestuurd!');
        router.push('/');
      } else if (error) router.push(`/error?${error.code}&code=${confirmCode}`);
    } catch (e: any) {
      if (process.env.NODE_ENV === 'development') logger.error(e);
    }
  };

  switch (errorCode) {
    case FrontEndErrorCodes.KlantNotFound:
      title = 'Oeps, er is iets mis gegaan bij de registratie';
      link = (
        <>
          klik <EbmeddedLink to="/register">hier</EbmeddedLink> om terug te keren naar de registratie pagina
        </>
      );
      break;
    case FrontEndErrorCodes.KlantAlreadyVerified:
      title = 'U heeft uw account reeds geverifiëerd';
      link = (
        <>
          Klik <EbmeddedLink to="/login">hier</EbmeddedLink> om terug te keren naar de login pagina
        </>
      );
      break;
    case FrontEndErrorCodes.ExpiredConfirmCode:
      title = 'Deze verificatie-code is vervallen';
      link = (
        <>
          Klik{' '}
          <button className="text-green-200 underline" onClick={renewVerificationCode}>
            hier
          </button>{' '}
          om een nieuwe verificatie code aan te vragen
        </>
      );
      break;
    default:
      title = 'Oeps, er is iets mis gegaan';
      link = (
        <>
          Klik{' '}
          <a href="/" className="text-green-200 underline">
            hier
          </a>{' '}
          om terug te keren naar de home pagina
        </>
      );
  }

  return { title, link };
};

export default FallBack;
