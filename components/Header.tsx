import { useRouter } from "next/router";
import Link from "next/link";
import { LOGIN } from "../types/linkTypes";

const Header = () => {
  const router = useRouter();
  return (
    <header className="relative">
      <h1 className="absolute right-13p top-25p text-5vmax text-grey-100">
        De Gallo-hoeve
      </h1>
      <button
        className="absolute right-4p bottom-5p px-2 py-1 border-2 rounded border-green-500 bg-green-400 text-grey-100 text-lg tracking-wider"
        onClick={() => router.push(LOGIN)}
      >
        <Link className="text-grey-500 tracking-wide block" href={LOGIN}>
          Login
        </Link>
      </button>
      <div className="banner__imgholder">
        <img
          className="block w-full aspect-6x object-fill"
          src="https://loremflickr.com/1400/320/dog"
          alt=""
        />
      </div>
    </header>
  );
};

export default Header;
