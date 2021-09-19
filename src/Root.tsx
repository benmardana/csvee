import React, { useState } from 'react';
import { Button, Classes } from '@blueprintjs/core';

import NavBar from './components/NavBar';
import TablesDrawer from './components/TablesDrawer';

import './assets/root.css';

const Root = () => {
  const [showTablesDrawer, setShowTablesDrawer] = useState(false);

  return (
    <>
      <NavBar>
        <Button
          onClick={() => setShowTablesDrawer(true)}
          className={Classes.MINIMAL}
          icon="th-list"
          text="Tables"
        />
      </NavBar>
      <TablesDrawer
        isOpen={showTablesDrawer}
        onClose={() => setShowTablesDrawer(false)}
      />
    </>
  );
};

export default Root;
