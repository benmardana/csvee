import { Button, Drawer, NonIdealState, UL } from '@blueprintjs/core';
import React, { useState } from 'react';
import AddNewTableDialog from './AddNewTableDialog';
import useDB from './DBContext';

const TablesDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { tableNames } = useDB();
  const [showAddNewTable, setShowAddNewTable] = useState(false);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        size={Drawer.SIZE_SMALL}
        title="Tables"
        onClose={onClose}
      >
        {tableNames?.length ? (
          <>
            <UL>
              {tableNames.map((table, index) => (
                <li key={index}>{table}</li>
              ))}
            </UL>
            <Button
              icon="add"
              text="add new"
              onClick={() => setShowAddNewTable(true)}
            />
          </>
        ) : (
          <NonIdealState
            icon="search"
            title="No tables found"
            action={
              <Button
                icon="add"
                text="add new"
                onClick={() => setShowAddNewTable(true)}
              />
            }
          />
        )}
      </Drawer>
      <AddNewTableDialog
        isOpen={showAddNewTable}
        onClose={() => setShowAddNewTable(false)}
      />
    </>
  );
};

export default TablesDrawer;
