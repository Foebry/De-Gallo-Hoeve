import {
  CONTENTPRIVETRAINING,
  CONTENTINTRO,
  CONTENTDIENSTEN,
} from "../types/apiTypes";
import getData from "./useApi";

export const useGetContent = () => {
  const getContent = async () => {
    const { data: intro } = await getData(CONTENTINTRO);
    const { data: diensten } = await getData(CONTENTDIENSTEN);
    const { data: trainingen } = await getData(CONTENTPRIVETRAINING);

    return { intro, diensten, trainingen };
  };
  return getContent;
};
