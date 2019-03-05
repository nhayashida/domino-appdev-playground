import { CodeSnippet, InlineNotification } from 'carbon-components-react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import React from 'react';
import { Notification } from '../actions/actions';

type Props = {
  dominoResponse: DominoResponse;
  notification: Notification;
};

const onCopy = () => {
  const selection = window.getSelection();
  if (selection) {
    selection.selectAllChildren(document.querySelectorAll('code')[0]);
    document.execCommand('copy');

    selection.removeAllRanges();
  }
};

// tslint:disable-next-line: variable-name
const Response = (props: Props): JSX.Element => {
  const { dominoResponse, notification } = props;
  const { response, explain } = dominoResponse;
  const responseStr = !isEmpty(response) ? JSON.stringify(response, null, 2) : '';

  const dominoResponseClasses = classnames('domino-response', {
    'has-response': responseStr && !notification.message,
  });
  const notificationClasses = classnames('notification', {
    'has-message': notification.message,
  });

  return (
    <div>
      <div className={dominoResponseClasses}>
        <div className="response">
          <label className="bx--label">response</label>
          <CodeSnippet type="multi" onClick={onCopy}>
            {responseStr}
          </CodeSnippet>
        </div>
        <div className={classnames('explain', '.bx--body')}>
          <pre>{explain ? explain.trim() : ''}</pre>
        </div>
      </div>
      <InlineNotification
        className={notificationClasses}
        hideCloseButton={true}
        kind={notification.type}
        title={notification.title}
        subtitle={notification.message}
      />
    </div>
  );
};

export default Response;
