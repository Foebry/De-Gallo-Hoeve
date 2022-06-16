import React, { Dispatch, SetStateAction } from "react";
import { Control, FieldValues } from "react-hook-form";

export type FormTabType = 1 | 2 | 3 | 4;

interface FormTabsProps {
  activeTab?: FormTabType;
  setActiveTab?: Dispatch<SetStateAction<FormTabType>>;
}

export interface RegisterStepProps {
  control: Control<FieldValues, any>;
  setActiveTab: React.Dispatch<React.SetStateAction<FormTabType>>;
}

const FormTabs: React.FC<FormTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="absolute -top-10 left-7">
      <span
        className={`bg-grey-100 py-5 px-10 rounded-md border border-solid border-grey-700 border-b-0 hover:cursor-pointer ${
          activeTab === 1 ? "color-gray-500 bg-grey-700 border-grey-800" : ""
        }`}
        onClick={() => setActiveTab?.(1)}
      >
        Stap1
      </span>
      <span
        className={`bg-grey-100 py-5 px-10 rounded-md border border-solid border-grey-700 border-b-0 hover:cursor-pointer ${
          activeTab === 2 ? "color-gray-500 bg-grey-700 border-grey-800" : ""
        }`}
        onClick={() => setActiveTab?.(2)}
      >
        Stap2
      </span>
      <span
        className={`bg-grey-100 py-5 px-10 rounded-md border border-solid border-grey-700 border-b-0 hover:cursor-pointer ${
          activeTab === 3 ? "color-gray-500 bg-grey-700 border-grey-800" : ""
        }`}
        onClick={() => setActiveTab?.(3)}
      >
        Stap3
      </span>
      <span
        className={`bg-grey-100 py-5 px-10 rounded-md border border-solid border-grey-700 border-b-0 hover:cursor-pointer ${
          activeTab === 4 ? "color-gray-500 bg-grey-700 border-grey-800" : ""
        }`}
        onClick={() => setActiveTab?.(4)}
      >
        Bevestiging
      </span>
    </div>
  );
};

export default FormTabs;
