import React, { CSSProperties } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner: React.FC<{}> = () => {
  const override: CSSProperties = {
    border: '10px solid',
  };
  return (
    <div className="w-full mx-auto flex justify-center mt-48">
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
