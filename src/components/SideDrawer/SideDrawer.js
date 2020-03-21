import React from 'react';

import './SideDrawer.css';
import { usersList } from '../../containers/pages/Coding';

const sideDrawer = props => {

  let drawerClasses = 'side-drawer';

  if (props.show) {
    drawerClasses = 'side-drawer open';
  }
  
  return (
    <nav className={drawerClasses}>
      <span className="heading">
          Connected Users:
      </span>
      <div className="divider" />
      <ul>
        { usersList }
      </ul>
    </nav>
  );
};

export default sideDrawer;