import React, { ReactNode, useContext } from 'react';
import MenuItem from '../Menu/MenuItem';
import MenuSection from '../Menu/MenuSection';
import {
  ADMIN,
  ADMINEDITINDEX,
  ADMINEDITTRAININGDAYS,
  ADMINLISTBREEDS,
  ADMINLISTDOGS,
  ADMINLISTSUBSCRIPTIONS,
  ADMINLISTTRAININGS,
  ADMINLISTUSERS,
  VAKANTIECONTROL,
} from 'src/types/linkTypes';
import { BiUser } from 'react-icons/bi';
import { BsCalendarDay, BsListUl, BsCalendar2RangeFill } from 'react-icons/bs';
import { GiSittingDog, GiJumpingDog } from 'react-icons/gi';
import { FaDatabase, FaDog, FaEdit } from 'react-icons/fa';
import { CgWebsite } from 'react-icons/cg';
import { AiOutlineHome } from 'react-icons/ai';
import Banner from '../Banner/index.page';
import { useBannerContext } from 'src/context/BannerContext';
import { ModalContext } from 'src/context/ModalContext';
import Modal from 'src/components/Modal/Modal/BaseModal';

interface Props {
  children: ReactNode;
}

const Dashboard: React.FC<Props> = ({ children }) => {
  const { bannerContent, isBannerActive } = useBannerContext();
  const { isModalActive, closeModal } = useContext(ModalContext);
  const shouldCloseModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget && e.currentTarget.classList.contains('dashboard'))
      closeModal();
  };

  return (
    <div>
      {isBannerActive && <Banner content={bannerContent} />}
      <div className="flex" style={{ height: '100%' }}>
        <aside className="bg-green-300 px-2 pt-5 min-h-full" style={{ width: '12.5%' }}>
          <MenuSection title="dashboard" icon={<AiOutlineHome />} link={ADMIN} />
          <MenuSection title="gegevens aanpassen" icon={<FaEdit />}>
            <MenuItem
              title="vakanties"
              icon={<BsCalendar2RangeFill />}
              link={VAKANTIECONTROL}
            />
            <MenuItem title="Website" icon={<CgWebsite />} link={ADMINEDITINDEX} />
            <MenuItem
              title="Trainingdagen"
              icon={<BsCalendarDay />}
              link={ADMINEDITTRAININGDAYS}
            />
          </MenuSection>
          <MenuSection title="Gegevens raadplegen" icon={<FaDatabase />}>
            <MenuItem title="Klanten" icon={<BiUser />} link={ADMINLISTUSERS} />
            <MenuItem
              title="inschrijvingen"
              icon={<BsListUl />}
              link={ADMINLISTSUBSCRIPTIONS}
            />
            <MenuItem title="honden" icon={<GiSittingDog />} link={ADMINLISTDOGS} />
            <MenuItem title="rassen" icon={<FaDog />} link={ADMINLISTBREEDS} />
            <MenuItem
              title="trainingen"
              icon={<GiJumpingDog />}
              link={ADMINLISTTRAININGS}
            />
          </MenuSection>
        </aside>
        <section style={{ width: '87.5%' }}>
          <div className={`w-10/12 mx-auto py-10 relative`}>
            {isModalActive && <Modal />}
            <div
              className={`dashboard ${isModalActive ? 'blur-sm' : undefined}`}
              onClick={shouldCloseModal}
            >
              {children}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
