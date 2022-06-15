const Header = () => {
  return (
    <header className="relative">
      <h1 className="absolute right-13p top-25p text-5vmax text-gray-100">
        De Gallo-hoeve
      </h1>
      <div>
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
