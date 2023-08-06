import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

type BannerContext = {
  bannerContent: string;
  setBannerContent: Dispatch<SetStateAction<string>>;
  isBannerActive: boolean;
  activateBanner: () => void;
  disableBanner: () => void;
};

const BannerContextContextDefaultValues: BannerContext = {
  bannerContent: '',
  setBannerContent: () => {},
  isBannerActive: false,
  activateBanner: () => {},
  disableBanner: () => {},
};

export const BannerContext = createContext<BannerContext>(
  BannerContextContextDefaultValues
);

const BannerProvider: React.FC<{ children: any }> = ({ children }) => {
  const [bannerContent, setBannerContent] = useState<string>('');
  const [isBannerActive, setIsBannerActive] = useState<boolean>(false);

  const activateBanner = () => setIsBannerActive(true);
  const disableBanner = () => setIsBannerActive(false);

  return (
    <BannerContext.Provider
      value={{
        bannerContent,
        setBannerContent,
        isBannerActive,
        activateBanner,
        disableBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

export default BannerProvider;

export const useBannerContext = () => useContext(BannerContext);
