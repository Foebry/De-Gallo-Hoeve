import React, { HTMLAttributes, ReactNode, useContext } from 'react';
import { useBannerContext } from 'src/context/BannerContext';
import { ModalContext } from 'src/context/ModalContext';
import { classNames } from 'src/shared/functions';
import Banner from '../Banner/index.page';
import Footer from '../Footer';
import { Nav } from '../Nav';
import Modal from 'src/components/Modal/Modal/BaseModal';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Skeleton: React.FC<Props> = ({ children }) => {
  const { bannerContent } = useBannerContext();
  const { isModalActive, closeModal } = useContext(ModalContext);
  const shouldCloseModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget && e.currentTarget.classList.contains('skeleton')) closeModal();
  };
  return (
    <div>
      {bannerContent.length > 0 && <Banner content={bannerContent} />}
      <Nav />
      <section className="skeleton">
        <div className={`relative`}>
          {isModalActive && <Modal />}
          <div className={`skeleton ${classNames({ 'blur-sm': isModalActive })}`} onClick={shouldCloseModal}>
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Skeleton;
