import React, { PureComponent } from 'react';

interface Props {
  children: JSX.Element;
}

export default class Html extends PureComponent<Props> {
  render() {
    return (
      <html>
        <header>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
        </header>
        <body>
          <div id="app">{this.props.children}</div>
          <script src="/vendor.bundle.js" />
          <script src="/dql.bundle.js" />
        </body>
      </html>
    );
  }
}
