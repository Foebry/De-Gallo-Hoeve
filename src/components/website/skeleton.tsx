import React, { ReactNode, useContext } from 'react';
import { useBannerContext } from 'src/context/BannerContext';
import { ModalContext } from 'src/context/ModalContext';
import Banner from '../Banner/index.page';
import Footer from '../Footer';
import { Nav } from '../Nav';

interface Props {
  children: ReactNode;
}

const Skeleton: React.FC<Props> = ({ children }) => {
  const { bannerContent } = useBannerContext();
  const { message } = useContext(ModalContext);
  return (
    <div className={message ? 'blur-sm' : undefined}>
      {bannerContent.length > 0 && <Banner content={bannerContent} />}
      <Nav />
      {children}
      <Footer />
    </div>
  );
};

export default Skeleton;
