import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import useMutation from "../hooks/useMutation";
import logout from "../pages/api/auth/logout";
import { LOGOUT } from "../types/apiTypes";
import { ADMIN, INDEX, PERSONAL } from "../types/linkTypes";
import { Body } from "./Typography/Typography";
interface Props {
  children: any;
  roles: number;
}

export const Hamburger: React.FC<Props> = ({ children, roles }) => {
  const [open, setOpen] = useState<boolean>(false);
  const logout = useMutation();
  const router = useRouter();
  const handleClick = () => {
    setOpen(() => !open);
  };
  const onLogout = async () => {
    await logout(LOGOUT, {}, { method: "DELETE" });
    router.push(INDEX);
  };
  return (
    <div className="relative">
      <span
        className="text-2xl text-green-100 cursor-pointer"
        onClick={handleClick}
      >
        {open ? <MdClose /> : <GiHamburgerMenu />}
      </span>
      {open && (
        <ul className="absolute top-12 right-0 bg-green-200 rounded min-w-3xs">
          {roles > 1 && (
            <MenuItem label="admin" link={ADMIN} setOpen={setOpen} />
          )}
          {roles === 0 && (
            <MenuItem
              label="persoonlijke pagina"
              link={PERSONAL}
              setOpen={setOpen}
            />
          )}
          <MenuItem label="logout" setOpen={setOpen} onClick={onLogout} />
        </ul>
      )}
    </div>
  );
};

interface MenuItemProps {
  label: string;
  link?: string;
  onClick?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  link,
  onClick,
  setOpen,
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (link) router.push(link);
    else onClick();
    setOpen(false);
  };
  return (
    <li
      key={nanoid(5)}
      className="text-center bg-green-200 cursor-pointer text-gray-100 hover:text-green-200 hover:bg-gray-100 rounded py-1"
      onClick={handleClick}
    >
      <span className="uppercase text-md font-medium">{label}</span>
    </li>
  );
};
