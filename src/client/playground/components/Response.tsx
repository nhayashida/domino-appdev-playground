import { CodeSnippet, InlineNotification } from 'carbon-components-react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions, { Notification } from '../actions/actions';

type Props = {
  selectedApi: string;
  dominoResponse: DominoResponse;
  notification: Notification;
  clearResponse: () => void;
};

const mapStateToProps = (state: Props) => ({
  notification: state.notification,
  dominoResponse: state.dominoResponse,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

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
  const { selectedApi, dominoResponse, notification, clearResponse } = props;

  useEffect(() => {
    // Clear response if selected api is changed
    clearResponse();
  }, [selectedApi]);

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Response);
