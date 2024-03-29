import { useRouter } from "next/router";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import useMutation from "../hooks/useMutation";
import { LOGOUT } from "../types/apiTypes";
import { INDEX } from "../types/linkTypes";
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
        <ul
          className="absolute top-12 right-0 bg-green-200 rounded min-w-3xs text-center"
          onClick={handleClick}
          onBlur={() => setOpen(false)}
        >
          {children}
        </ul>
      )}
    </div>
  );
};
