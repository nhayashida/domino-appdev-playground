import { Code16, User20 } from '@carbon/icons-react';
import { Button, CodeSnippet, TextInput, InlineNotification } from 'carbon-components-react';
import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react/lib/components/UIShell';
import classnames from 'classnames';
import { isEmpty, fromPairs } from 'lodash';
import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';
import { DAS, DOMINO_API_PROPERTIES } from '../../../common/utils/constants';

type Props = {
  initErrorMessage?: string;
  userId?: string;
  errorMessage: string;
  dominoResponse: DominoResponse;
  execute: (method: string, options: object) => void;
  clearResponse: () => void;
  showErrorMessage(message: string): void;
};

type State = {
  sideNavOpened: boolean;
  selectedApi: string;
};

const mapStateToProps = (state: Props) => ({
  errorMessage: state.errorMessage,
  dominoResponse: state.dominoResponse,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

class App extends Component<Props, State> {
  private inputFields = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      sideNavOpened: false,
      selectedApi: DOMINO_API_PROPERTIES[0].api,
    };
  }

  componentDidMount() {
    // Remove elements for server-side rendering
    ['init-state'].forEach(id => {
      const elem = document.getElementById(id);
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    });

    // Show error message if error is thrown on loading page
    const { initErrorMessage } = this.props;
    if (initErrorMessage) {
      this.props.showErrorMessage(initErrorMessage);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.selectedApi !== this.state.selectedApi) {
      // Clear input and response fields
      this.getInputFields().forEach(input => {
        input.value = '';
      });
      this.props.clearResponse();
    }
  }

  onSideNavToggle = () => {
    this.setState({ sideNavOpened: !this.state.sideNavOpened });
  };

  onSignIn = async () => {
    const res = await fetch('/iam/auth/url');

    const data = await res.json();
    if (!res.ok) {
      this.props.showErrorMessage(data.error.message);
    } else {
      // Redirect to authorization page
      location.href = data.authUrl;
    }
  };

  generateHeader(): JSX.Element {
    const { userId } = this.props;
    const { sideNavOpened, selectedApi } = this.state;

    const userAction = !userId ? (
      <HeaderGlobalAction aria-label="Sign in" onClick={this.onSignIn}>
        <User20 />
      </HeaderGlobalAction>
    ) : (
      <HeaderNavigation aria-label="User">
        <HeaderMenu aria-label={userId} />
      </HeaderNavigation>
    );

    return (
      <Header className="header" aria-label={selectedApi}>
        <HeaderMenuButton
          aria-label={sideNavOpened ? 'Close' : 'Open'}
          isActive={sideNavOpened}
          onClick={this.onSideNavToggle}
        />
        <HeaderName prefix="">{selectedApi}</HeaderName>
        <HeaderGlobalBar>{userAction}</HeaderGlobalBar>
      </Header>
    );
  }

  onSideNavMenuItemSelect = (e: MouseEvent<HTMLAnchorElement>) => {
    const api = e.currentTarget.textContent || this.state.selectedApi;
    this.setState({ sideNavOpened: false, selectedApi: api });
  };

  generateSideNav(): JSX.Element {
    const { sideNavOpened, selectedApi } = this.state;

    const dominoDbMenuItems = DOMINO_API_PROPERTIES.filter(
      props => props.group === 'domino-db',
    ).map((props, i) => {
      const ariaCurrent = props.api === selectedApi ? 'page' : '';
      return (
        <SideNavMenuItem key={i} aria-current={ariaCurrent} onClick={this.onSideNavMenuItemSelect}>
          {props.api}
        </SideNavMenuItem>
      );
    });
    const dominoDbMenu = (
      <SideNavMenu icon={<Code16 />} defaultExpanded={true} title="domino-db">
        {dominoDbMenuItems}
      </SideNavMenu>
    );

    const dasMenu = (
      <SideNavLink
        aria-current={DAS === selectedApi ? 'page' : ''}
        icon={<Code16 />}
        onClick={this.onSideNavMenuItemSelect}
      >
        {DAS}
      </SideNavLink>
    );

    const sideNavClasses = classnames('side-nav', {
      closed: !sideNavOpened,
    });
    return (
      <SideNav className={sideNavClasses} aria-label="Side navigation">
        <SideNavItems>
          {dominoDbMenu}
          {dasMenu}
        </SideNavItems>
      </SideNav>
    );
  }

  getInputFields = (): HTMLInputElement[] => {
    const elem = this.inputFields.current;
    if (!elem) {
      return [];
    }
    return Array.from(elem.querySelectorAll('input'));
  };

  generateInputFields(): JSX.Element[] | null {
    const { selectedApi } = this.state;

    const apiProps = DOMINO_API_PROPERTIES.find(props => props.api === selectedApi);
    if (!apiProps) {
      return null;
    }
    return Object.keys(apiProps.options).map((key, i) => (
      <TextInput
        key={i}
        id={key}
        className="input-field"
        labelText={key}
        placeholder={apiProps.options[key].placeholder}
        ref={React.createRef<HTMLInputElement>()}
      />
    ));
  }

  onExecute = () => {
    const options = fromPairs(
      this.getInputFields().map(input => {
        const { id, value } = input;
        try {
          return [id, JSON.parse(value)];
        } catch (err) {
          // An error is thrown if the type of the value is string.
          // Then, use the value as is.
          return [id, value];
        }
      }),
    );
    this.props.execute(this.state.selectedApi, options);
  };

  onResponseCopy = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.selectAllChildren(document.querySelectorAll('code')[0]);
      document.execCommand('copy');

      selection.removeAllRanges();
    }
  };

  render(): JSX.Element {
    const { errorMessage, dominoResponse } = this.props;

    const { response, explain } = dominoResponse;
    const responseStr = !isEmpty(response) ? JSON.stringify(response, null, 2) : '';

    const responseClasses = classnames('domino-response', {
      'has-response': responseStr,
    });
    const explainClasses = classnames('explain', '.bx--body');
    const notificationClasses = classnames('error-notification', {
      'has-message': errorMessage,
    });

    return (
      <div className="root">
        {this.generateHeader()}
        {this.generateSideNav()}
        <main className="content">
          <div className="input-field-container" ref={this.inputFields}>
            {this.generateInputFields()}
          </div>
          <Button onClick={this.onExecute}>Execute</Button>
          <div className={responseClasses}>
            <div className="response">
              <label className="bx--label">response</label>
              <CodeSnippet type="multi" onClick={this.onResponseCopy}>
                {responseStr}
              </CodeSnippet>
            </div>
            <div className={explainClasses}>
              <pre>{explain ? explain.trim() : ''}</pre>
            </div>
          </div>
          <InlineNotification
            className={notificationClasses}
            hideCloseButton={true}
            kind="error"
            title="Error"
            subtitle={errorMessage}
          />
        </main>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
