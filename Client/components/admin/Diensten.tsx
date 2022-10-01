import { nanoid } from "nanoid";
import React, { useState } from "react";
import { ContentStates } from "../../pages/admin/edit";
import { CONTENTDIENSTEN } from "../../types/apiTypes";
import Button from "../buttons/Button";
import { Body, Title1 } from "../Typography/Typography";
import { Edit, EditStates } from "./Intro";

interface Props {
  handleSave: (endpoint: string, key: string) => Promise<void>;
  content: { subtitle: string; content: string[]; image: string };
  setContent: React.Dispatch<React.SetStateAction<ContentStates>>;
  handleChange: (e: any) => void;
  allContent: ContentStates;
}

const Diensten: React.FC<Props> = ({
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
    <div className="mb-24">
      <div className="flex flex-row-reverse pr-52">
        <Button
          label="save"
          onClick={() => handleSave(CONTENTDIENSTEN, "diensten")}
        />
      </div>
      <div
        className="relative max-w-7xl mx-auto"
        onMouseEnter={() => handleHover(true, "title")}
        onMouseLeave={() => handleHover(false, "title")}
      >
        {edit.title.edit ? (
          <div className="flex justify-center">
            <input
              data-name="diensten"
              data-subName="subtitle"
              value={content.subtitle}
              className="text-green-200 text-6xl text-center my-18"
              onChange={handleChange}
            />
          </div>
        ) : (
          <Title1
            className={`${edit.title.edit ? "text-red-200" : "text-green-200"}`}
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
            data-name="diensten"
            data-subName="content"
            value={content.content.map((paragraph) => paragraph).join("\n\n")}
            className="w-full px-2 min-h-s text-base  max-w-7xl px-2 md:mx-auto"
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
  );
};

export default Diensten;
