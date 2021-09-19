import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import initSqlJs, { Database, QueryExecResult } from 'sql.js';
import sqlWasm from '../assets/sql-wasm.wasm';

interface DBContextInterface {
  db?: Database;
  executeQuery?: (sql: string) => void;
  queryError?: string;
  queryResult?: QueryExecResult[];
  saveTable?: (name: string, values: string[][]) => void;
  tables?: string[];
}

const DBContext = createContext<DBContextInterface>({});

const useDB = () => useContext(DBContext);

export default useDB;

export const DBContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [db, setDb] = useState<Database>();
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const SqlJs = await initSqlJs({
          locateFile: () => sqlWasm,
        });
        setDb(new SqlJs.Database());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, []);

  const [queryError, setQueryError] = useState<any>();
  const [queryResult, setQueryResult] = useState<QueryExecResult[]>([]);

  const executeQuery = useCallback(
    (sql: string) => {
      try {
        setQueryResult(db?.exec(sql) ?? []);
        setQueryError(undefined);
      } catch (err) {
        setQueryError(err);
        setQueryResult([]);
      }
    },
    [db]
  );

  const saveTable = useCallback(
    (name: string, values: string[][]) => {
      const [header, ...rest] = values;
      const columnList = `(${header
        .map((col) => `${col.toLowerCase()} TEXT`)
        .join(', ')})`;
      const createTableStatement = `CREATE TABLE ${name} ${columnList};`;

      const insertValuesStatements = rest
        .filter((row) => row.length === header.length)
        .map(
          (row) =>
            `INSERT INTO ${name} VALUES (${row
              .map((value) => JSON.stringify(value))
              .join(', ')});`
        );

      let index = 0;
      try {
        db?.exec?.(createTableStatement);
        setTables([...tables, name].sort());
        for (index; index < insertValuesStatements.length; index += 1) {
          db?.exec?.(insertValuesStatements[index]);
        }
      } catch (err) {
        setQueryError(
          `${err.message}, row: ${index + 2}, statement: ${
            insertValuesStatements[index]
          }`
        );
        setQueryResult([]);
      }
    },
    [db, tables]
  );

  const dbContextValue = useMemo(
    () => ({
      db,
      executeQuery,
      queryError,
      queryResult,
      tables,
      saveTable,
    }),
    [db, executeQuery, queryError, queryResult, saveTable, tables]
  );

  return (
    <DBContext.Provider value={dbContextValue}>{children}</DBContext.Provider>
  );
};
