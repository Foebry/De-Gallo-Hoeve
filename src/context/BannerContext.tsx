import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

type BannerContext = {
  bannerContent: string;
  setBannerContent: Dispatch<SetStateAction<string>>;
};

const BannerContextContextDefaultValues: BannerContext = {
  bannerContent: '',
  setBannerContent: () => {},
};

export const BannerContext = createContext<BannerContext>(
  BannerContextContextDefaultValues
);

const BannerProvider: React.FC<{ children: any }> = ({ children }) => {
  const [bannerContent, setBannerContent] = useState<string>('');

  return (
    <BannerContext.Provider
      value={{
        bannerContent,
        setBannerContent,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

export default BannerProvider;

export const useBannerContext = () => useContext(BannerContext);
