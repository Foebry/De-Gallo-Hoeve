import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Title3 } from "../../Typography/Typography";

interface HondProps {
  naam: string;
  index: number;
  control: Control<FieldValues, any>;
  id: number;
  avatar: string;
  errors: any;
  setErrors: any;
  values: any;
}

const Hond: React.FC<HondProps> = ({
  naam,
  control,
  id,
  avatar = "https://loremflickr.com/100/100/hond",
  setErrors,
  values,
}) => {
  return (
    <Controller
      name="hond_id"
      control={control}
      render={({ field: { onChange } }) => (
        <div
          className="border-solid border-2 border-black-100 rounded px-2 py-4 my-2 cursor-pointer"
          onClick={() => onChange(id)}
        >
          <div className="flex gap-5 justify-between items-center">
            <div className="w-25 aspect-square">
              <img
                src={avatar}
                alt=""
                className="w-full object-cover aspect-square"
              />
            </div>
            <div>
              <Title3>{naam}</Title3>
            </div>
            <div>
              <input
                className="w-10"
                name="hond_id"
                type="radio"
                onChange={onChange}
                value={id}
                checked={values().hond_id == id}
              />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default Hond;
