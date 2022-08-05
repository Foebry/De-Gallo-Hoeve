import React from "react";

interface DayCardProps {
  onChange: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ onChange }) => {
  return <div>DayCard</div>;
};

export default DayCard;
