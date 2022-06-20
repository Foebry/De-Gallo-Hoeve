import { nanoid } from "nanoid";
import React, { Dispatch, SetStateAction } from "react";
import { Control, FieldValues } from "react-hook-form";

interface FormTabsProps {
  activeTab?: number;
  setActiveTab?: Dispatch<SetStateAction<number>>;
  tabCount: number;
}

export interface FormStepProps {
  control: Control<FieldValues, any>;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  errors?: any;
  setErrors?: any;
  disabledDays?: string[];
}

const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  setActiveTab,
  tabCount,
}) => {
  return (
    <div className="absolute -top-10 left-7">
      {Array(tabCount)
        .fill(0)
        .map((_, index) => (
          <span
            key={nanoid(5)}
            className={`bg-grey-100 py-5 px-10 rounded-md border border-solid border-grey-700 border-b-0 hover:cursor-pointer ${
              activeTab === index + 1
                ? "color-gray-500 bg-grey-700 border-grey-800"
                : ""
            }`}
            onClick={() => setActiveTab?.(index + 1)}
          >
            {`Stap${index + 1}`}
          </span>
        ))}
    </div>
  );
};

export default FormTabs;
