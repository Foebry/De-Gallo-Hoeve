import React, { useState } from "react";

interface DayCardProps {
  onChange: () => void;
  date: any;
  spots: any;
  subscriptions: any;
  month: any;
}

const DayCard: React.FC<DayCardProps> = ({
  onChange,
  date,
  spots,
  subscriptions,
  month,
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const handleClick = () => {
    setSelected(!selected);
  };
  return (
    <div
      className={`border-2 rounded py-5 px-2 mb-5 flex justify-between cursor-pointer ${
        selected ? "bg-green-200 text-gray-200" : undefined
      }`}
      onClick={handleClick}
    >
      <p>date: {date}</p>
      <p>spots: {spots}</p>
      <p>subscriptions: {subscriptions}</p>
      <p>month: {month}</p>
    </div>
  );
};

export default DayCard;
