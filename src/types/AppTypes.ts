import { HTMLAttributes } from 'react';

export type ExtendedPropTypes<T> = HTMLAttributes<T> & {
  ['r-if']?: boolean;
};
