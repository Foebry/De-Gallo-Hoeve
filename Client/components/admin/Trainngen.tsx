import React, { useState } from "react";
import { ContentStates } from "../../pages/admin/edit";
import { EditStates } from "./Intro";

interface Props {
  handleSave: (endpoint: string, key: string) => Promise<void>;
  content: { subtitle: string; content: string[]; image: string };
  setContent: React.Dispatch<React.SetStateAction<ContentStates>>;
  handleChange: (e: any) => void;
  allContent: ContentStates;
}

const Trainngen: React.FC<Props> = ({
  content,
  handleChange,
  handleSave,
  setContent,
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
  console.log({ "content trainingen": content });
  return (
    <>
      <div
        className="relative max-w-md mx-auto"
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
          <div className="bg-green-200 text-center text-2xl py-8 text-gray-50 rounded-t-lg">
            test
          </div>
        )}
      </div>
    </>
  );
};

export default Trainngen;
