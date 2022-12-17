import React, { ReactNode } from "react";

export type StyleOptions = Partial<{
  borderColor: string;
  padding: string;
  margin: string;
  rounding: string;
}>;

interface Props {
  label: string;
  children: ReactNode;
  style?: StyleOptions;
}

const setStyling = (style?: StyleOptions) => {
  const borderColor = style?.borderColor ?? "border-gray-500";
  const padding = style?.padding ?? "pt-20 px-10";
  const margin = style?.margin ?? "mb-10";
  const rounding = style?.rounding ?? "rounded-lg";
  return [borderColor, padding, margin, rounding].join(" ");
};

const FormSection: React.FC<Props> = ({ label, children, style }) => {
  const styling = setStyling(style);
  return (
    <div className={`relative border ${styling}`}>
      <span className="absolute bg-white-900 left-8 -top-3.5 px-2">
        {label}
      </span>
      {children}
    </div>
  );
};

export default FormSection;
