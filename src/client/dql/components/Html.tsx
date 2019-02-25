import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// tslint:disable-next-line:variable-name
const Html = (props: Props): JSX.Element => {
  const { children } = props;

  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </head>
      <body>
        <div id="app">{children}</div>
        <script src="/vendor.bundle.js" />
        <script src="/playground.bundle.js" />
      </body>
    </html>
  );
};

export default Html;
