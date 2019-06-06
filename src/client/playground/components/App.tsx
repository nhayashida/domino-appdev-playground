import React, { MouseEvent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { showErrorNotification } from '../reducers/thunkActions';
import AppBar from './AppBar';
import NavigationDrawer from './NavigationDrawer';
import InputForm from './InputForm';
import Response from './Response';
import { DOMINO_API_PROPERTIES } from '../../../common/utils/constants';

interface Props {
  email?: string;
  errorMessage?: string;
  showErrorNotification: typeof showErrorNotification;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ showErrorNotification }, dispatch);

// tslint:disable-next-line: variable-name
const App = (props: Props): JSX.Element => {
  const { email, errorMessage } = props;

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedApi, setSelectedApi] = useState(DOMINO_API_PROPERTIES[0].api);

  useEffect(() => {
    // Remove elements for server-side rendering
    ['init-state'].forEach(id => {
      const elem = document.getElementById(id);
      if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    });

    // Show error message if an error is thrown when loading page
    if (errorMessage) {
      props.showErrorNotification(errorMessage);
    }
  }, []);

  const onDrawerToggle = () => {
    setDrawerOpened(!drawerOpened);
  };

  const onDrawerMenuItemSelect = (e: MouseEvent<HTMLAnchorElement>) => {
    setDrawerOpened(false);
    setSelectedApi(e.currentTarget.textContent || selectedApi);
  };

  return (
    <div className="playground-component">
      <AppBar
        email={email}
        drawerOpened={drawerOpened}
        selectedApi={selectedApi}
        onDrawerToggle={onDrawerToggle}
      />
      <NavigationDrawer
        open={drawerOpened}
        selectedApi={selectedApi}
        onMenuItemSelect={onDrawerMenuItemSelect}
      />
      <main className="content">
        <InputForm selectedApi={selectedApi} />
        <Response selectedApi={selectedApi} />
      </main>
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
