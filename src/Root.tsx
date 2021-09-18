import React from 'react';
import Split from 'react-split';

import './assets/root.css';

import CsvUploader from './components/CsvUploader';
import SQLEditor from './components/SQLEditor';
import useDB from './components/DBContext';

const Root = () => {
  const { tables, queryResult } = useDB();

  return (
    <div className="root">
      <Split
        sizes={[25, 75]}
        cursor="col-resize"
        // @ts-ignore
        className="split root"
      >
        {/* main container */}
        <div>
          {tables?.length ? tables.join(', ') : 'no tables'}
          <CsvUploader />
        </div>

        <Split
          sizes={[25, 75]}
          direction="vertical"
          cursor="col-resize"
          // @ts-ignore
          // className="split root"
        >
          {/* sql/results pane */}
          <div>
            <SQLEditor />
          </div>

          <div style={{ overflow: 'scroll' }}>
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
          </div>
        </Split>
      </Split>
    </div>
  );
};

export default Root;
