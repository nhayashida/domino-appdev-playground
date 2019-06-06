import CodeSnippet from 'carbon-components-react/lib/components/CodeSnippet';
import { InlineNotification } from 'carbon-components-react/lib/components/Notification';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { clearResponse } from '../reducers/thunkActions';
import { State } from '../reducers/store';
import { Notification } from '../reducers/types';

interface Props {
  selectedApi: string;
  dominoResponse: DominoResponse;
  notification: Notification;
  clearResponse: typeof clearResponse;
}

const mapStateToProps = (state: State) => ({
  notification: state.notification,
  dominoResponse: state.dominoResponse,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ clearResponse }, dispatch);

// tslint:disable-next-line: variable-name
const Response = (props: Props): JSX.Element => {
  const { selectedApi, dominoResponse, notification } = props;

  useEffect(() => {
    // Clear response if selected api is changed
    props.clearResponse();
  }, [selectedApi]);

  const onCopy = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.selectAllChildren(document.querySelectorAll('code')[0]);
      document.execCommand('copy');

      selection.removeAllRanges();
    }
  };

  const { response, explain } = dominoResponse;
  const responseStr = !isEmpty(response) ? JSON.stringify(response, null, 2) : '';
  const explainStr = explain ? explain.trim() : '';

  const dominoResponseClasses = classnames('domino-response', {
    'has-response': responseStr && !notification.message,
  });
  const explainClasses = classnames('.bx--body', 'explain', {
    'has-explain': explainStr,
  });
  const notificationClasses = classnames('notification', {
    'has-message': notification.message,
  });

  return (
    <React.Fragment>
      <div className={dominoResponseClasses}>
        <div className="response">
          <label className="bx--label">response</label>
          <CodeSnippet type="multi" onClick={onCopy}>
            {responseStr}
          </CodeSnippet>
        </div>
        <div className={explainClasses}>
          <pre>{explainStr}</pre>
        </div>
      </div>
      <InlineNotification
        className={notificationClasses}
        hideCloseButton={true}
        kind={notification.type}
        title={notification.title}
        subtitle={notification.message}
      />
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Response);
