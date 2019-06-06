import User20 from '@carbon/icons-react/lib/user/20';
import Header from 'carbon-components-react/lib/components/UIShell/Header';
import HeaderGlobalAction from 'carbon-components-react/lib/components/UIShell/HeaderGlobalAction';
import HeaderGlobalBar from 'carbon-components-react/lib/components/UIShell/HeaderGlobalBar';
import HeaderMenu from 'carbon-components-react/lib/components/UIShell/HeaderMenu';
import HeaderMenuButton from 'carbon-components-react/lib/components/UIShell/HeaderMenuButton';
import HeaderName from 'carbon-components-react/lib/components/UIShell/HeaderName';
import HeaderNavigation from 'carbon-components-react/lib/components/UIShell/HeaderNavigation';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { doAuthorization } from '../reducers/thunkActions';

interface Props {
  email?: string;
  drawerOpened: boolean;
  selectedApi: string;
  onDrawerToggle: () => void;
  doAuthorization: typeof doAuthorization;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ doAuthorization }, dispatch);

// tslint:disable-next-line: variable-name
const AppBar = (props: Props): JSX.Element => {
  const { email, drawerOpened, selectedApi } = props;

  const userAction = !email ? (
    <HeaderGlobalAction aria-label="Sign in" onClick={props.doAuthorization}>
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
        aria-label={drawerOpened ? 'Close' : 'Open'}
        isActive={drawerOpened}
        onClick={props.onDrawerToggle}
      />
      <HeaderName prefix="">{selectedApi}</HeaderName>
      <HeaderGlobalBar>{userAction}</HeaderGlobalBar>
    </Header>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(AppBar);
