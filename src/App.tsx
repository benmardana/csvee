import React, { useCallback, useEffect, useRef, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import initSqlJs, { Database, QueryExecResult } from 'sql.js';

import './App.css';

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ParseResult<string[]>>();

  const onUpload = useCallback((event) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    reader.onload = (event) =>
      typeof event.target?.result === 'string' &&
      Papa.parse<string[]>(file, {
        complete: (results) => setResult(results),
      });
    reader.readAsText(file);
  }, []);

  const [db, setDb] = useState<Database>();
  const [error, setError] = useState(null);
  const [results, setResults] = useState<QueryExecResult[]>([]);

  function exec(sql: string) {
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
        console.log(err);
        setError(err);
      }
    })();
  }, []);

  return (
    <div className="App">
      <input ref={fileInput} type="file" accept=".csv" onChange={onUpload} />
      <div>
        {result?.data.map((row) => (
          <p>{row.join(', ')}</p>
        ))}
      </div>
      <h1>React SQL interpreter</h1>

      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      ></textarea>

      <pre className="error">{(error || '').toString()}</pre>

      <pre>
        {
          // results contains one object per select statement in the query
          results.map(({ columns, values }, i) => (
            <table>
              <thead>
                <tr>
                  {columns.map((columnName, i) => (
                    <td key={i}>{columnName}</td>
                  ))}
                </tr>
              </thead>

              <tbody>
                {
                  // values is an array of arrays representing the results of the query
                  values.map((row, i) => (
                    <tr key={i}>
                      {row.map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))
                }
              </tbody>
            </table>
          ))
        }
      </pre>
    </div>
  );
}

export default App;
