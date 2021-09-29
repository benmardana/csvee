import { Button } from '@blueprintjs/core';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

import useDB from './DBContext';

const SQLEditor = () => {
  const { executeQuery } = useDB();
  const [query, setQuery] = useState<string>();

  const handleExecuteQuery = () => query && executeQuery?.(query);
  return (
    <div
      style={{
        minWidth: '100%',
        height: '30%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={query}
        onChange={setQuery}
        options={{ minimap: { enabled: false } }}
      />
      <div style={{ boxShadow: '0 0 0 1px rgb(16 22 26 / 15%)', zIndex: 0 }}>
        <Button
          onClick={handleExecuteQuery}
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            margin: 16,
            float: 'right',
          }}
          outlined
          small
        >
          Execute
        </Button>
      </div>
    </div>
  );
};

export default SQLEditor;
