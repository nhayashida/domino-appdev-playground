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
import React, { PureComponent } from 'react';

interface State {
  selectedTab: number;
  response: string;
  explain: string;
  notification: string;
}

class App extends PureComponent<{}, State> {
  private tabContents: JSX.Element[] = [];

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 0,
      response: '',
      explain: '',
      notification: '',
    };

    this.onExecuteClick = this.onExecuteClick.bind(this);
  }

  onTabClick(index) {
    this.setState({ selectedTab: index });
  }

  async onExecuteClick() {
    const tabContent = this.tabContents[this.state.selectedTab];
    const containerNode: Element = (tabContent as any).ref.current;
    const inputNodes = containerNode && containerNode.querySelectorAll('input');

    const method = containerNode.getAttribute('data-method');
    const options = (inputNodes ? [...inputNodes] : []).reduce((accumulator, node) => {
      const key = node.getAttribute('data-key') || '';
      const type = node.getAttribute('data-type') || '';
      const value =
        node.value && (type === 'object' || type === 'array') ? JSON.parse(node.value) : node.value;
      return Object.assign(accumulator, { [key]: value });
    }, {});
    const res = await fetch(`/dql?method=${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(Object.assign(options)),
    });

    const data = await res.json();
    if (!res.ok) {
      this.setState({ response: '', explain: '', notification: data.message });
    } else {
      this.setState({
        response: JSON.stringify(data.bulkResponse, null, '  '),
        explain: data.explain.trim(),
        notification: '',
      });
    }
  }

  onResponseCopy() {
    const selection = window.getSelection();
    if (selection) {
      selection.selectAllChildren(document.querySelectorAll('code')[0]);
      document.execCommand('copy');

      selection.removeAllRanges();
    }
  }

  generateTabs(): JSX.Element[] {
    const inputProps = [
      {
        method: 'bulkReadDocuments',
        options: [
          {
            key: 'query',
            type: 'string',
            placeholder: "Form = 'Contact' and LastName = 'Parsons'",
          },
          {
            key: 'itemNames',
            type: 'array',
            placeholder: '["FirstName", "LastName"]',
          },
        ],
      },
      {
        method: 'bulkDeleteDocuments',
        options: [
          {
            key: 'query',
            type: 'string',
            placeholder: "Form = 'Contact' and LastName = 'Parsons'",
          },
        ],
      },
      {
        method: 'bulkReplaceItems',
        options: [
          {
            key: 'query',
            type: 'string',
            placeholder: "Form = 'Contact' and LastName = 'Parsons'",
          },
          {
            key: 'replaceItems',
            type: 'object',
            placeholder: '{ "City": "Chelmsford", "State": "MA" }',
          },
        ],
      },
      {
        method: 'bulkDeleteItems',
        options: [
          {
            key: 'query',
            type: 'string',
            placeholder: "Form = 'Contact' and LastName = 'Parsons'",
          },
          {
            key: 'itemNames',
            type: 'object',
            placeholder: '["EMail", "Phone"]',
          },
        ],
      },
    ];
    return inputProps.map((props, tabIdx) => {
      const inputFields = props.options.map((option, optionIdx) => {
        return (
          <TextInput
            key={optionIdx}
            id={`${props.method}-${option.key}`}
            className="input-field"
            labelText={option.key}
            placeholder={option.placeholder}
            data-key={option.key}
            data-type={option.type}
          />
        );
      });
      this.tabContents[tabIdx] = (
        <div
          className="input-container"
          ref={React.createRef<HTMLDivElement>()}
          data-method={props.method}
        >
          {inputFields}
        </div>
      );
      return (
        <Tab key={tabIdx} label={props.method} onClick={this.onTabClick.bind(this, tabIdx)}>
          {this.tabContents[tabIdx]}
        </Tab>
      );
    });
  }

  render(): JSX.Element {
    const responseClasses = classnames('response', {
      'has-message': this.state.response,
    });
    const explainClasses = classnames('explain', {
      'has-message': this.state.explain,
    });
    const notificationClasses = classnames('error-notification', {
      'has-message': this.state.notification,
    });

    return (
      <div className="container">
        <Tabs className="tabs">{this.generateTabs()}</Tabs>
        <Button className="execute-button" onClick={this.onExecuteClick}>
          execute
        </Button>
        <div className={responseClasses}>
          <label className="bx--label">bulkResponse</label>
          <CodeSnippet type="multi" onClick={this.onResponseCopy}>
            {this.state.response}
          </CodeSnippet>
        </div>
        <div className={explainClasses}>
          <TextArea labelText="" rows={11} value={this.state.explain} />
        </div>
        <InlineNotification
          className={notificationClasses}
          hideCloseButton={true}
          kind="error"
          title="Error"
          subtitle={this.state.notification}
        />
      </div>
    );
  }
}

export default App;
