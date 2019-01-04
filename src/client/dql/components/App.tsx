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
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';
import { DQL_PROPERTIES } from '../../../common/utils/constants';

type Props = {
  dqlResponse: object;
  dqlExplain: string;
  errorMessage: string;
  executeDql: (method: string, options: object) => void;
};

const mapStateToProps = (state: Props) => ({
  dqlResponse: state.dqlResponse,
  dqlExplain: state.dqlExplain,
  errorMessage: state.errorMessage,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

class App extends PureComponent<Props> {
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
      const inputFields = Object.keys(props.options).map((key, optionIdx) => {
        const option = props.options[key];
        return (
          <TextInput
            key={optionIdx}
            id={`${props.method}-${key}`}
            className="input-field"
            labelText={key}
            placeholder={option.placeholder}
            data-key={key}
            data-type={option.type}
          />
        );
      });

      const onExecuteClick = () => {
        const options = inputFields
          .map(inputField => {
            const { props } = inputField;
            const elem: any = document.getElementById(props.id);
            if (elem) {
              const key = props['data-key'];
              let value = elem.value;
              try {
                const type = props['data-type'];
                if (value && (type === 'object' || type === 'array')) {
                  value = JSON.parse(elem.value);
                }
              } catch (err) {
                // do nothing
              }
              return { [key]: value };
            }
            return {};
          })
          .reduce((acc, curr) => Object.assign(acc, curr));

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
