import React, { useState } from 'react';

import useDB from './DBContext';

const SQLEditor = () => {
  const { queryError, executeQuery } = useDB();
  const [query, setQuery] = useState('');

  return (
    <>
      <textarea onChange={(e) => setQuery(e.target.value)} />
      <button type="button" onClick={() => executeQuery?.(query)}>
        Execute
      </button>
      <pre>{queryError}</pre>
    </>
  );
};

export default SQLEditor;
