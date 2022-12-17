import React, { ReactNode } from "react";
import MenuItem from "../components/Menu/MenuItem";
import MenuSection from "../components/Menu/MenuSection";
import {
  ADMIN,
  ADMINEDITINDEX,
  ADMINEDITTRAININGDAYS,
  ADMINLISTBREEDS,
  ADMINLISTDOGS,
  ADMINLISTSUBSCRIPTIONS,
  ADMINLISTTRAININGS,
  ADMINLISTUSERS,
} from "src/types/linkTypes";
import { BiUser } from "react-icons/bi";
import { BsCalendarDay, BsListUl } from "react-icons/bs";
import { GiSittingDog, GiJumpingDog } from "react-icons/gi";
import { FaDatabase, FaDog, FaEdit } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";

interface Props {
  children: ReactNode;
}

const Dashboard: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex" style={{ height: "100%" }}>
      <aside
        className="bg-green-200 px-2 pt-5 min-h-full"
        style={{ width: "12.5%" }}
      >
        <MenuSection title="dashboard" icon={<AiOutlineHome />} link={ADMIN} />
        <MenuSection title="gegevens aanpassen" icon={<FaEdit />}>
          <MenuItem
            title="Website"
            icon={<CgWebsite />}
            link={ADMINEDITINDEX}
          />
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
          <MenuItem
            title="honden"
            icon={<GiSittingDog />}
            link={ADMINLISTDOGS}
          />
          <MenuItem title="rassen" icon={<FaDog />} link={ADMINLISTBREEDS} />
          <MenuItem
            title="trainingen"
            icon={<GiJumpingDog />}
            link={ADMINLISTTRAININGS}
          />
        </MenuSection>
      </aside>
      <section style={{ width: "87.5%" }}>
        <div className="w-10/12 mx-auto py-10">{children}</div>
      </section>
    </div>
  );
};

export default Dashboard;
