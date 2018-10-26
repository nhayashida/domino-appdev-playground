import React, { PureComponent } from 'react';

interface Props {
  children: JSX.Element;
}

export default class Html extends PureComponent<Props> {
  render() {
    return (
      <html>
        <body>
          <div id="app">{this.props.children}</div>
          <script src="/vendor.bundle.js" />
          <script src="/dql.bundle.js" />
        </body>
      </html>
    );
  }
}
