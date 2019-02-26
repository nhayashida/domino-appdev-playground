import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  initState?: string;
};

// tslint:disable-next-line:variable-name
const Html = (props: Props): JSX.Element => {
  const { children, initState } = props;

  return (
    <html>
      <head>
        <link rel="stylesheet" href="/styles.css" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </head>
      <body>
        <div id="app">{children}</div>
        <script id="init-state" type="text/plain" data-state={initState} />
        <script src="/vendor.bundle.js" />
        <script src="/playground.bundle.js" />
      </body>
    </html>
  );
};

export default Html;
