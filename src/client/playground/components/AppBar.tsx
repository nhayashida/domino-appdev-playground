import { User20 } from '@carbon/icons-react';
import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
} from 'carbon-components-react/lib/components/UIShell';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';

type Props = {
  email?: string;
  drawerOpened: boolean;
  selectedApi: string;
  onDrawerToggle: () => void;
  authorize: () => void;
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

// tslint:disable-next-line: variable-name
const AppBar = (props: Props): JSX.Element => {
  const { email, drawerOpened, selectedApi, onDrawerToggle, authorize } = props;

  const userAction = !email ? (
    <HeaderGlobalAction aria-label="Sign in" onClick={authorize}>
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
        onClick={onDrawerToggle}
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
