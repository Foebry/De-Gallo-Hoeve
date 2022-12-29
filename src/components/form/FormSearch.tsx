import React, { FormEvent, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Button from "../buttons/Button";
import { ImCross } from "react-icons/im";

interface Props {
  api: string;
  onSearch: (searchValue: string) => void;
}

const FormSearch: React.FC<Props> = ({ api, onSearch }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [filterSearch, setFilterSearch] = useState<string>("");

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const onClick = () => {
    setFilterSearch(searchValue);
    onSearch(searchValue);
    setSearchActive(searchValue === "" ? false : true);
    setSearchValue("");
  };

  const onSubmit = (
    e: FormEvent<HTMLFormElement>,
    onSearch: (searchValue: string) => void
  ) => {
    e.preventDefault();
    setFilterSearch(searchValue);
    onSearch(searchValue);
    setSearchActive(searchValue === "" ? false : true);
    setSearchValue("");
  };

  const onResetSearch = () => {
    setSearchValue("");
    setFilterSearch(searchValue);
    setSearchActive(false);
    onSearch(searchValue);
  };

  return (
    <>
      <form
        className="border-none rounded flex mb-2 items-center relative"
        onSubmit={(e) => {
          onSubmit(e, onSearch);
          setSearchValue("");
        }}
      >
        {searchActive && (
          <Button
            label={<ImCross />}
            onClick={onResetSearch}
            className="mr-2"
          />
        )}
        <input
          onChange={onChange}
          className="border border-green-200 h-full rounded outline-none px-2 py-1"
          placeholder="search..."
          value={searchValue}
        />
        <div
          className="px-3 bg-green-200 h-full rounded-r flex items-center text-gray-100 cursor-pointer absolute right-0"
          onClick={onClick}
        >
          <BsSearch />
        </div>
      </form>
      {searchActive && (
        <p className="text-lg pl-10">
          Zoek resultaten voor &quot;
          <span className="text-green-200">{filterSearch}</span>&quot;
        </p>
      )}
    </>
  );
};

export default FormSearch;
