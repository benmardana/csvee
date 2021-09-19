import { Button, Intent, TextArea } from '@blueprintjs/core';
import React, { useState } from 'react';

import useDB from './DBContext';

const SQLEditor = () => {
  const { executeQuery } = useDB();
  const [query, setQuery] = useState('');

  return (
    <div style={{ position: 'relative', minWidth: '100%', height: '30%' }}>
      <TextArea
        style={{ minWidth: '100%', height: '100%' }}
        intent={Intent.PRIMARY}
        onChange={(event) => setQuery(event.target.value)}
        value={query}
        className="code"
        large
      />
      <Button
        onClick={() => executeQuery?.(query)}
        style={{ position: 'absolute', bottom: 0, right: 0 }}
        outlined
      >
        Execute
      </Button>
    </div>
  );
};

export default SQLEditor;
