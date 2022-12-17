import { nanoid } from "nanoid";
import { ContentStates } from "src/pages/admin/edit/index.page";
import React from "react";
import { Body, Title1 } from "../Typography/Typography";

interface Props {
  content: { subtitle: string; content: string[]; image: string };
  setContent: React.Dispatch<React.SetStateAction<ContentStates>>;
  handleChange: (e: any) => void;
  allContent: ContentStates;
  edit: boolean;
}

const Diensten: React.FC<Props> = ({
  content,
  setContent,
  handleChange,
  allContent,
  edit,
}) => {
  return (
    <div className="mb-24">
      <div className="relative max-w-7xl mx-auto">
        {edit ? (
          <div className="flex justify-center my-18">
            <input
              data-name="diensten"
              data-subName="subtitle"
              value={content.subtitle}
              className="text-green-200 text-6xl text-center border-2 border-green-200 rounded outline-none"
              onChange={handleChange}
              autoFocus
            />
          </div>
        ) : (
          <Title1 className={`${edit ? "text-red-200" : "text-green-200"}`}>
            {content.subtitle}
          </Title1>
        )}
      </div>
      <div className="relative">
        {edit ? (
          <div className="flex justify-center">
            <textarea
              data-name="diensten"
              data-subName="content"
              value={content.content.map((paragraph) => paragraph).join("\n\n")}
              className="w-full px-2 min-h-s text-base px-2 max-w-7xl mx-auto border-2 border-green-200 rounded outline-none"
              autoFocus
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
          </div>
        ) : (
          <>
            {content.content.map((paragraph) => (
              <Body key={nanoid(5)} className="max-w-7xl px-2 md:mx-auto">
                {paragraph}
              </Body>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Diensten;
