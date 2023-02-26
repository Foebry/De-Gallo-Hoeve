import React from 'react';
import { Title2, Title3 } from '../components/Typography/Typography';
import Image from 'next/image';
import { Nav } from 'src/components/Nav';

export const FallBack = () => {
  return (
    <>
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
          <Title2 className="text-green-200">Oeps, er is iets mis gegaan</Title2>
          <Title3>
            Klik{' '}
            <a className="text-green-200 underline" href="/">
              hier
            </a>{' '}
            om terug te keren naar de home pagina
          </Title3>
        </div>
      </div>
    </>
  );
};

export default FallBack;
