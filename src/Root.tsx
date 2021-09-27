import React, { useState } from 'react';
import { Button, Classes } from '@blueprintjs/core';
import { ThList } from '@blueprintjs/icons';

import NavBar from './components/NavBar';
import SQLEditor from './components/SQLEditor';
import Tables from './components/Tables';
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
          icon={<ThList />}
          text="Tables"
        />
      </NavBar>
      <SQLEditor />
      <Tables />
      <TablesDrawer
        isOpen={showTablesDrawer}
        onClose={() => setShowTablesDrawer(false)}
      />
    </>
  );
};

export default Root;
