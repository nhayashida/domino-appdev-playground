import React, { Component, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import AppBar from './AppBar';
import Drawer from './Drawer';
import InputForm from './InputForm';
import Response from './Response';
import actions from '../actions/actions';
import { DOMINO_API_PROPERTIES } from '../../../common/utils/constants';

type Props = {
  errorMessage?: string;
  email?: string;
  showErrorNotification(message: string): void;
};

type State = {
  drawerOpened: boolean;
  selectedApi: string;
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      drawerOpened: false,
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

    // Show error message if an error is thrown when loading page
    const { errorMessage } = this.props;
    if (errorMessage) {
      this.props.showErrorNotification(errorMessage);
    }
  }

  onDrawerToggle = () => {
    this.setState({ drawerOpened: !this.state.drawerOpened });
  };

  onDrawerMenuItemSelect = (e: MouseEvent<HTMLAnchorElement>) => {
    const api = e.currentTarget.textContent || this.state.selectedApi;
    this.setState({ drawerOpened: false, selectedApi: api });
  };

  render(): JSX.Element {
    const { email } = this.props;
    const { drawerOpened, selectedApi } = this.state;

    return (
      <div className="root">
        <AppBar
          email={email}
          drawerOpened={drawerOpened}
          selectedApi={selectedApi}
          onDrawerToggle={this.onDrawerToggle}
        />
        <Drawer
          open={drawerOpened}
          selectedApi={selectedApi}
          onMenuItemSelect={this.onDrawerMenuItemSelect}
        />
        <main className="content">
          <InputForm selectedApi={selectedApi} />
          <Response selectedApi={selectedApi} />
        </main>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(App);
