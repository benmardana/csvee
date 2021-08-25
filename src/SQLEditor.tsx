import React, { useState } from 'react';

import useDB from './DBContext';

const SQLEditor = () => {
  const { queryError, queryResult, executeQuery } = useDB();
  const [query, setQuery] = useState('');

  return (
    <>
      <textarea onChange={(e) => setQuery(e.target.value)} />
      <button type="button" onClick={() => executeQuery?.(query)}>
        Execute
      </button>
      <pre>{JSON.stringify(queryError)}</pre>
      <pre>
        {queryResult?.map(({ columns, values }) => (
          <table>
            <thead>
              <tr>
                {columns.map((columnName, i) => (
                  <td key={i}>{columnName}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((row, i) => (
                <tr key={i}>
                  {row.map((value, ri) => (
                    <td key={ri}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </pre>
    </>
  );
};

export default SQLEditor;
