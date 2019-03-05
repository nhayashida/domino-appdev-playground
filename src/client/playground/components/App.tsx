import { User20 } from '@carbon/icons-react';
import { Button, TextArea } from 'carbon-components-react';
import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
} from 'carbon-components-react/lib/components/UIShell';
import { fromPairs } from 'lodash';
import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Response from './Response';
import SideNavigation from './SideNavigation';
import actions, { Notification } from '../actions/actions';
import { DOMINO_API_PROPERTIES } from '../../../common/utils/constants';

type Props = {
  errorMessage?: string;
  email?: string;
  notification: Notification;
  dominoResponse: DominoResponse;
  showErrorNotification(message: string): void;
  execute: (method: string, options: object) => void;
  clearResponse: () => void;
};

type State = {
  sideNavOpened: boolean;
  selectedApi: string;
};

const mapStateToProps = (state: Props) => ({
  notification: state.notification,
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
    const { errorMessage } = this.props;
    if (errorMessage) {
      this.props.showErrorNotification(errorMessage);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.selectedApi !== this.state.selectedApi) {
      // Clear inputs and response
      this.getInputFields().forEach(input => {
        input.value = '';
        input.style.height = 'auto';
      });
      this.props.clearResponse();
    }
  }

  onSideNavMenuItemSelect = (e: MouseEvent<HTMLAnchorElement>) => {
    const api = e.currentTarget.textContent || this.state.selectedApi;
    this.setState({ sideNavOpened: false, selectedApi: api });
  };

  onSideNavToggle = () => {
    this.setState({ sideNavOpened: !this.state.sideNavOpened });
  };

  onSignIn = async () => {
    const res = await fetch('/iam/auth/url');

    const data = await res.json();
    if (!res.ok) {
      this.props.showErrorNotification(data.error.message);
    } else {
      // Redirect to authorization page
      location.href = data.authUrl;
    }
  };

  generateHeader(): JSX.Element {
    const { email } = this.props;
    const { sideNavOpened, selectedApi } = this.state;

    const userAction = !email ? (
      <HeaderGlobalAction aria-label="Sign in" onClick={this.onSignIn}>
        <User20 />
      </HeaderGlobalAction>
    ) : (
      <HeaderNavigation aria-label="User">
        <HeaderMenu aria-label={email} />
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

  onInputFieldChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Resize textarea
    const { currentTarget: elem } = e;
    elem.style.height = `auto`;
    elem.style.height = `${elem.scrollHeight + 1}px`;
  };

  getInputFields = (): HTMLTextAreaElement[] => {
    const elem = this.inputFields.current;
    if (!elem) {
      return [];
    }
    return Array.from(elem.querySelectorAll('textarea'));
  };

  generateInputFields(): JSX.Element[] | null {
    const { selectedApi } = this.state;

    const apiProps = DOMINO_API_PROPERTIES.find(props => props.api === selectedApi);
    if (!apiProps) {
      return null;
    }
    return Object.keys(apiProps.options).map((key, i) => (
      <TextArea
        key={i}
        id={key}
        className="input-field"
        labelText={key}
        placeholder={apiProps.options[key].placeholder}
        rows={1}
        onChange={this.onInputFieldChange}
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

  render(): JSX.Element {
    const { notification, dominoResponse } = this.props;
    const { sideNavOpened, selectedApi } = this.state;

    return (
      <div className="root">
        {this.generateHeader()}
        <SideNavigation
          opened={sideNavOpened}
          selectedApi={selectedApi}
          onMenuItemSelect={this.onSideNavMenuItemSelect}
        />
        <main className="content">
          <div className="input-field-container" ref={this.inputFields}>
            {this.generateInputFields()}
          </div>
          <Button onClick={this.onExecute}>Execute</Button>
          <Response dominoResponse={dominoResponse} notification={notification} />
        </main>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
