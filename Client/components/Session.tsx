import React, { useState } from "react";
import Button from "./buttons/Button";
import { Title3 } from "./Typography/Typography";

interface SessionProps {
  onChange: () => void;
  date: string;
  spots: number;
  subscriptions: number;
}

const Session: React.FC<SessionProps> = ({
  onChange,
  date,
  spots,
  subscriptions,
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  return (
    <div
      className="max-w-4xl border-black-900 border-2 rounded py-5 mx-auto flex justify-between items-center px-1 sm:px-10 mt-5 cursor-pointer"
      onClick={() => setSelected((selected) => !selected)}
    >
      <div>
        <Title3>Zondag {date}</Title3>
      </div>
      <div>
        {selected ? (
          <span>Geslecteerd</span>
        ) : (
          <Button label="Selecteer" onClick={() => setSelected(true)} />
        )}
      </div>
    </div>
  );
};

export default Session;
