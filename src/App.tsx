import React, { useEffect, useState } from 'react';
import initSqlJs, { Database, QueryExecResult } from 'sql.js';
import CsvUploader from './CsvUploader';

import './App.css';

function App() {
  const [db, setDb] = useState<Database>();
  const [error, setError] = useState(null);
  const [results, setResults] = useState<QueryExecResult[]>([]);

  function execStatement(sql: string) {
    try {
      setResults(db?.exec(sql) ?? []);
      setError(null);
    } catch (err) {
      setError(err);
      setResults([]);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });
        setDb(new SQL.Database());
      } catch (err) {
        setError(err);
      }
    })();
  }, []);

  const handleOnCsvUpload = (name: string, data: string[][]) => {
    const [header, ...rest] = data;
    const columnList = `(${header
      .map((col) => `${col.toLowerCase()} TEXT`)
      .join(', ')})`;
    const createTableStatement = `CREATE TABLE ${name} ${columnList};`;

    const insertValuesStatement = `INSERT INTO ${name} VALUES ${rest
      .map((row) => `(${row.map((value) => JSON.stringify(value)).join(', ')})`)
      .join(',')};`;

    execStatement(createTableStatement);
    execStatement(insertValuesStatement);
  };

  return (
    <div className="App">
      <CsvUploader onSubmit={handleOnCsvUpload} />
      <h1>React SQL interpreter</h1>

      <textarea
        onChange={(e) => execStatement(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      />

      <pre className="error">{(error || '').toString()}</pre>

      <pre>
        {results.map(({ columns, values }) => (
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
    </div>
  );
}

export default App;
