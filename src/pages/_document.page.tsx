import { Head, Html, Main, NextScript } from 'next/document';

const MyDocument: React.FC<{}> = ({}) => {
  return (
    <Html lang="nl">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
