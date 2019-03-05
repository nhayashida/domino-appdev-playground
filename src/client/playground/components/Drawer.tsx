import { Code16 } from '@carbon/icons-react';
import {
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react/lib/components/UIShell';
import classnames from 'classnames';
import React, { MouseEvent } from 'react';
import { DOMINO_API_PROPERTIES } from '../../../common/utils/constants';

type Props = {
  open: boolean;
  selectedApi: string;
  onMenuItemSelect: (e: MouseEvent<HTMLAnchorElement>) => void;
};

// tslint:disable-next-line: variable-name
const Drawer = (props: Props) => {
  const { open, selectedApi, onMenuItemSelect } = props;

  const dominoDbMenuItems: JSX.Element[] = [];
  const dasMenuItems: JSX.Element[] = [];
  DOMINO_API_PROPERTIES.forEach((props, i) => {
    const ariaCurrent = props.api === selectedApi ? 'page' : '';
    const menuItem = (
      <SideNavMenuItem key={i} aria-current={ariaCurrent} onClick={onMenuItemSelect}>
        {props.api}
      </SideNavMenuItem>
    );
    if (props.group === 'domino-db') {
      dominoDbMenuItems.push(menuItem);
    } else if (props.group === 'das') {
      dasMenuItems.push(menuItem);
    }
  });

  const sideNavClasses = classnames('side-nav', {
    closed: !open,
  });
  return (
    <SideNav className={sideNavClasses} aria-label="Side navigation">
      <SideNavItems>
        <SideNavMenu icon={<Code16 />} defaultExpanded={true} title="domino-db">
          {dominoDbMenuItems}
        </SideNavMenu>
        <SideNavMenu icon={<Code16 />} defaultExpanded={true} title="domino access services">
          {dasMenuItems}
        </SideNavMenu>
      </SideNavItems>
    </SideNav>
  );
};

export default Drawer;
