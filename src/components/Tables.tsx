import React, { useMemo } from 'react';
import { Cell, Column, Table } from '@blueprintjs/table';
import useDB from './DBContext';

const Tables = () => {
  const { queryResult, queryError } = useDB();

  const { values, columns } = useMemo(
    () => ({
      values: queryResult?.[0]?.values ?? [],
      columns: queryResult?.[0]?.columns ?? [],
    }),
    [queryResult]
  );

  return (
    <div>
      <Table numRows={values.length}>
        {columns.map((column) => (
          <Column
            key={column}
            name={column}
            cellRenderer={(rowIndex: number, columnIndex: number) => (
              <Cell>{values[rowIndex]?.[columnIndex]}</Cell>
            )}
          />
        ))}
      </Table>
      <div>{JSON.stringify(queryError)}</div>
    </div>
  );
};

export default Tables;
