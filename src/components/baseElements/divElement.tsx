import React, { HTMLAttributes, HtmlHTMLAttributes } from 'react';

type BaseElementProps<T> = HTMLAttributes<T> & {
  ['r-if']: boolean;
};

type Props = BaseElementProps<HTMLDivElement>;

const DivElement: React.FC<Props> = ({ children, className, ['r-if']: rIf }) => {
  return <>{rIf && <div className={className}>{children}</div>}</>;
};

export default DivElement;
