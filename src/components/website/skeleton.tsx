import React, { ReactNode } from 'react';
import { useBannerContext } from 'src/context/BannerContext';
import Banner from '../Banner/index.page';
import Footer from '../Footer';
import { Nav } from '../Nav';

interface Props {
  children: ReactNode;
}

const Skeleton: React.FC<Props> = ({ children }) => {
  const { bannerContent } = useBannerContext();
  return (
    <>
      {bannerContent.length > 0 && <Banner content={bannerContent} />}
      <Nav />
      {children}
      <Footer />
    </>
  );
};

export default Skeleton;
