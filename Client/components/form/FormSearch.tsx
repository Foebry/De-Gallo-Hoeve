import React, { FormEvent, useState } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  api: string;
  onSearch: (searchValue: string) => void;
}

const FormSearch: React.FC<Props> = ({ api, onSearch }) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const onClick = () => {
    onSearch(searchValue);
    setSearchValue("");
  };

  const onSubmit = (
    e: FormEvent<HTMLFormElement>,
    onSearch: (searchValue: string) => void
  ) => {
    e.preventDefault();
    onSearch(searchValue);
    setSearchValue("");
  };

  return (
    <form
      className="border rounded flex mb-2 items-center"
      onSubmit={(e) => {
        onSubmit(e, onSearch);
        setSearchValue("");
      }}
    >
      <input
        onChange={onChange}
        className="border border-green-200 rounded-l outline-none px-2 py-1"
        placeholder="search..."
        value={searchValue}
      />
      <div
        className="px-3 bg-green-200 h-full rounded-r flex items-center text-gray-100 cursor-pointer"
        onClick={onClick}
      >
        <BsSearch />
      </div>
    </form>
  );
};

export default FormSearch;
