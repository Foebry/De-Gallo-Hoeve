import React, { CSSProperties } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { classNames } from 'src/shared/functions';

type Props = {
  ['r-if']?: boolean;
  label?: string;
};

const Spinner: React.FC<Props> = ({ ['r-if']: rIf = true, label }) => {
  const override: CSSProperties = {
    border: '10px solid',
  };
  return !rIf ? (
    <></>
  ) : (
    <div className={`w-full mx-auto flex justify-center mt-48`}>
      <p>{label}</p>
      <div className="sweet-loading">
        <ClipLoader
          color={'#00918B'}
          cssOverride={override}
          loading={true}
          aria-label="Loading Spinner"
          size={300}
          speedMultiplier={0.6}
        />
      </div>
    </div>
  );
};

export default Spinner;
