import React, { useCallback, useRef, useState } from 'react';
import {
  Alignment,
  Button,
  Classes,
  Dialog,
  Drawer,
  FileInput,
  InputGroup,
  Navbar,
  NavbarDivider,
  NonIdealState,
  UL,
} from '@blueprintjs/core';
import { parse, ParseResult } from 'papaparse';

import './assets/root.css';

// import CsvUploader from './components/CSVParserForm';
// import SQLEditor from './components/SQLEditor';
import useDB from './components/DBContext';

const Root = () => {
  const { tables, saveTable } = useDB();
  const [result, setResult] = useState<ParseResult<string[]>>();
  const [csvName, setCsvName] = useState<string>('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAddNewTable, setShowAddNewTable] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleOnFileChange = useCallback(() => {
    const file = fileInput.current?.files?.[0];
    console.log(file?.name);

    // TODO: handle file not uploaded
    if (!file) return;

    parse<string[]>(file, {
      complete: (results) => setResult(results),
    });
  }, []);

  const handleOnSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // TODO: handle invalid form with errors
      if (csvName.length < 1 || !result) return;

      saveTable?.(csvName, result.data);
    },
    [csvName, result, saveTable]
  );

  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>CSVee</Navbar.Heading>
          <NavbarDivider />
          <Button
            onClick={() => setShowDrawer(true)}
            className={Classes.MINIMAL}
            icon="th-list"
            text="My tables"
          />
        </Navbar.Group>
      </Navbar>
      <Drawer
        isOpen={showDrawer}
        size={Drawer.SIZE_SMALL}
        title="Tables"
        onClose={() => setShowDrawer(false)}
      >
        {tables?.length ? (
          <>
            <UL>
              {tables.map((table) => (
                <li>{table}</li>
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

        <Dialog
          title="Add new table"
          isOpen={showAddNewTable}
          onClose={() => setShowAddNewTable(false)}
        >
          <form onSubmit={handleOnSubmit}>
            <FileInput
              text={
                fileInput.current?.files?.[0]
                  ? fileInput.current?.files?.[0].name
                  : 'Choose file...'
              }
              onInputChange={handleOnFileChange}
              inputProps={{ ref: fileInput, accept: '.csv' }}
              hasSelection={!!fileInput.current?.files?.[0]}
              fill
            />
            <InputGroup
              onChange={(event) => setCsvName(event.target.value)}
              placeholder="Table name..."
              value={csvName}
            />
            <Button
              disabled={!csvName || !result}
              type="submit"
              text="Import"
            />
          </form>
        </Dialog>
      </Drawer>
    </>
  );
};

export default Root;
