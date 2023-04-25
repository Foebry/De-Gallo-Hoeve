import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Nav } from 'src/components/Nav';
import { Title2, Title3 } from 'src/components/Typography/Typography';

type Props = {};

const NotFoundPage: React.FC<Props> = ({}) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>De Gallo-hoeve - 404</title>
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
          <Title2 className="text-green-200">Oeps, deze pagina bestaat niet</Title2>
          <Title3>
            Klik{' '}
            <button className="text-green-200 underline" onClick={() => router.back()}>
              hier
            </button>{' '}
            om terug te keren naar de vorige pagina
          </Title3>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
