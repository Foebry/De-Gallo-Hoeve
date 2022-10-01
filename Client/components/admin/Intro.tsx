import React, { useEffect, useState } from "react";
import { Body, Title1 } from "../Typography/Typography";
import Image from "next/image";
import { nanoid } from "nanoid";
import { BiEdit } from "react-icons/bi";
import { useGetContent } from "../../hooks/useGetContent";
import useMutation from "../../hooks/useMutation";
import Button from "../buttons/Button";
import { CONTENTINTRO } from "../../types/apiTypes";
import { toast } from "react-toastify";
import { ContentStates } from "../../pages/admin/edit";

export interface EditStates {
  title: { shown: boolean; edit: boolean };
  content: { shown: boolean; edit: boolean };
}

interface Props {
  handleSave: (endpoint: string, key: string) => Promise<void>;
  content: { subtitle: string; content: string[]; image: string };
  setContent: React.Dispatch<React.SetStateAction<ContentStates>>;
  handleChange: (e: any) => void;
  allContent: ContentStates;
}
const Intro: React.FC<Props> = ({
  handleSave,
  content,
  setContent,
  handleChange,
  allContent,
}) => {
  const [edit, setEdit] = useState<EditStates>({
    title: { shown: false, edit: false },
    content: { shown: false, edit: false },
  });

  const handleHover = (state: boolean, item: string) => {
    setEdit({
      ...edit,
      [item]: { ...edit[item as keyof typeof edit], shown: state },
    });
  };

  const handleToggle = (item: string) => {
    setEdit({
      ...edit,
      [item]: {
        ...edit[item as keyof typeof edit],
        edit: !edit[item as keyof typeof edit].edit,
      },
    });
  };
  return (
    <section className="mb-40 block flex-wrap mt-10 items-center max-w-7xl justify-between mx-auto md:flex md:px-5">
      <div className="mx-auto w-1/2 relative flex flex-wrap rotate-135 gap-5 self-center md:w-4/12 md:mx-0 md:self-end">
        <div className="w-5/12 max-w-sm aspect-square border-4 border-green-200 overflow-hidden relative images">
          <div className="aspect-square -rotate-135 absolute image">
            <Image
              src={
                "https://res.cloudinary.com/dv7gjzlsa/image/upload/v1659626902/De-Gallo-Hoeve/content/image1_swsxl6.png"
              }
              width={800}
              height={800}
              objectFit="cover"
            />
          </div>
        </div>
        <div className="w-5/12 aspect-square border-4 border-green-200 overflow-hidden relative images -order-1">
          <div className="aspect-square -rotate-135 absolute image">
            <Image
              src={
                "https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656188518/De-Gallo-Hoeve/content/intro_gfgoo0.jpg"
              }
              width={800}
              height={800}
              objectFit="cover"
            />
          </div>
        </div>
        <div className="w-5/12 max-w-sm aspect-square border-4 border-green-200 overflow-hidden relative images">
          <div className="aspect-square -rotate-135 absolute image">
            <Image
              src={
                "https://res.cloudinary.com/dv7gjzlsa/image/upload/v1656174227/De-Gallo-Hoeve/images/pexels-helena-lopes-1959052_eosst4.jpg"
              }
              width={800}
              height={800}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
      <div className="px-5 mx-auto md:mx-0 md:w-7/12 md:px-0">
        <div className="flex flex-row-reverse">
          <Button
            label="save"
            onClick={() => handleSave(CONTENTINTRO, "intro")}
          />
        </div>

        <div
          className={`relative`}
          onMouseEnter={() => handleHover(true, "title")}
          onMouseLeave={() => handleHover(false, "title")}
        >
          {edit.title.edit ? (
            <div>
              <input
                data-name="intro"
                data-subName="subtitle"
                value={content.subtitle}
                className="text-green-200 text-6xl text-center my-18"
                onChange={handleChange}
              />
            </div>
          ) : (
            <Title1
              className={`${
                edit.title.edit ? "text-red-200" : "text-green-200"
              }`}
            >
              {content.subtitle}
            </Title1>
          )}

          <Edit items={edit} item="title" toggle={handleToggle} />
        </div>
        <div
          className="relative"
          onMouseEnter={() => handleHover(true, "content")}
          onMouseLeave={() => handleHover(false, "content")}
        >
          {edit.content.edit ? (
            <textarea
              data-name="intro"
              data-subName="content"
              value={content.content.map((paragraph) => paragraph).join("\n\n")}
              className="w-full px-2 min-h-s text-base"
              onChange={(e: any) => {
                const name = e.target.dataset.name;
                const subName = e.target.dataset.subname;
                const value = e.target.value;
                setContent({
                  ...allContent,
                  [name]: {
                    ...allContent[name as keyof typeof allContent],
                    [subName]: value.split("\n\n"),
                  },
                });
              }}
            />
          ) : (
            <>
              {content.content.map((paragraph) => (
                <Body key={nanoid(5)} className="max-w-7xl px-2 md:mx-auto">
                  {paragraph}
                </Body>
              ))}
            </>
          )}

          <Edit item="content" items={edit} toggle={handleToggle} />
        </div>
      </div>
    </section>
  );
};

export default Intro;

interface EditProps {
  items: any;
  item: string;
  toggle: (item: string) => void;
}

export const Edit: React.FC<EditProps> = ({
  items,
  item,
  toggle: handleToggle,
}) => {
  return (
    <div
      className={`${
        items[item as keyof typeof items].shown ? "block" : "hidden"
      } absolute -right-3 -top-3 cursor-pointer text-green-200`}
    >
      <BiEdit onClick={() => handleToggle(item)} />
    </div>
  );
};
