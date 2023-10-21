import React from 'react';
import { AvailabilityDto } from 'src/common/api/dtos/Subscription';

type props = React.HTMLAttributes<HTMLDivElement> & {
  subscriptionCheck: AvailabilityDto;
};

const TableSummary: React.FC<props> = ({ className, subscriptionCheck }) => {
  return (
    <div className={className}>
      <ul>
        <li className="flex justify-between">
          <p>Totaal excl.</p>
          <p className="pl-2">€ {subscriptionCheck.totalExcl.toFixed(2)}</p>
        </li>
        <li className="flex justify-between">
          <p>BTW (21%)</p>
          <p className="pl-2">€ {subscriptionCheck.btw.toFixed(2)}</p>
        </li>
        <li className="flex justify-between">
          <p>Totaal incl.</p>
          <p className="pl-2">€ {subscriptionCheck.totalIncl.toFixed(2)}</p>
        </li>
        <li className="flex justify-between">
          <p>
            <span>Verplaatsingskost</span>{' '}
            <span>
              (€ {subscriptionCheck.travelCost} x {subscriptionCheck.travelTimes})
            </span>
          </p>
          <p className="pl-2">€ {(subscriptionCheck.travelCost * subscriptionCheck.travelTimes).toFixed(2)}</p>
        </li>
        <hr className="my-2" />
        <li className="flex justify-between font-semibold">
          <p>Te betalen:</p>
          <p className="pl-2"> € {subscriptionCheck.toBePayed.toFixed(2)}</p>
        </li>
      </ul>
    </div>
  );
};

export default TableSummary;
