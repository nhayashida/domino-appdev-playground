import {
  Button,
  CodeSnippet,
  Tab,
  Tabs,
  TextArea,
  TextInput,
  InlineNotification,
} from 'carbon-components-react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';
import { DQL_PROPERTIES } from '../../../common/utils/constants';

type Props = {
  errorMessage: string;
  dqlResponse: DqlResponse;
  dqlExplain: string;
  executeDql: (method: string, options: DqlQuery) => void;
};

const mapStateToProps = (state: Props) => ({
  errorMessage: state.errorMessage,
  dqlResponse: state.dqlResponse,
  dqlExplain: state.dqlExplain,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

class App extends Component<Props> {
  onResponseCopy() {
    const selection = window.getSelection();
    if (selection) {
      selection.selectAllChildren(document.querySelectorAll('code')[0]);
      document.execCommand('copy');

      selection.removeAllRanges();
    }
  }

  generateTabs(): JSX.Element[] {
    return DQL_PROPERTIES.map((props, tabIdx) => {
      const inputFields = Object.keys(props.options).map((key, i) => (
        <TextInput
          key={i}
          id={`${props.method}-${key}`}
          className="input-field"
          labelText={key}
          placeholder={props.options[key].placeholder}
          data-key={key}
          ref={React.createRef<HTMLInputElement>()}
        />
      ));

      const onExecuteClick = () => {
        const options = inputFields
          .map(inputField => {
            const { props, ref } = inputField as any; // TODO
            const elem = ref.current || { value: '' };
            const key = props['data-key'];
            try {
              return { [key]: JSON.parse(elem.value) };
            } catch (err) {
              // An error is thrown if the type of the value is string.
              // Then, use the value as is.
              return { [key]: elem.value };
            }
          })
          .reduce((acc, curr) => Object.assign(acc, curr)) as DqlQuery;

        this.props.executeDql(props.method, options);
      };

      return (
        <Tab key={tabIdx} label={props.method}>
          <div className="input-container">{inputFields}</div>
          <Button className="execute-button" onClick={onExecuteClick}>
            execute
          </Button>
        </Tab>
      );
    });
  }

  render(): JSX.Element {
    const { dqlResponse, dqlExplain, errorMessage } = this.props;

    const response = !isEmpty(dqlResponse)
      ? JSON.stringify(this.props.dqlResponse, null, '  ')
      : '';
    const explain = dqlExplain ? dqlExplain.trim() : '';

    const resultClasses = classnames('result', {
      'has-result': response || explain,
    });
    const notificationClasses = classnames('error', {
      'has-message': errorMessage,
    });

    return (
      <div className="container">
        <Tabs className="tabs">{this.generateTabs()}</Tabs>
        <div className={resultClasses}>
          <div className="response">
            <label className="bx--label">bulkResponse</label>
            <CodeSnippet type="multi" onClick={this.onResponseCopy}>
              {response}
            </CodeSnippet>
          </div>
          <div className="explain">
            <TextArea labelText="" rows={11} value={explain} />
          </div>
        </div>
        <InlineNotification
          className={notificationClasses}
          hideCloseButton={true}
          kind="error"
          title="Error"
          subtitle={errorMessage}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
