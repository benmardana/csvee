import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { entries, set } from 'idb-keyval';
import initSqlJs, { Database, QueryExecResult } from 'sql.js';

interface DBContextInterface {
  db?: Database;
  executeQuery?: (sql: string) => void;
  queryError?: string;
  queryResult?: QueryExecResult[];
  saveTable?: (name: string, values: string[][]) => void;
  tableNames?: string[];
}

const DBContext = createContext<DBContextInterface>({});

const useDB = () => useContext(DBContext);

export default useDB;

const saveTableToDB = async (db: any, name: string, values: string[][]) => {
  const [header, ...rest] = values;
  const columnList = `(${header
    .map((col) => `${col.toLowerCase().replaceAll(' ', '_')} TEXT`)
    .join(', ')})`;

  const createTableStatement = `CREATE TABLE ${name} ${columnList};`;

  const insertValuesStatements = rest
    .filter((row) => row.length === header.length)
    .map(
      (row) =>
        `INSERT INTO ${name} VALUES (${row
          .map((value) => JSON.stringify(value))
          .join(',')})`
    );

  let index = 0;
  try {
    db?.exec?.(createTableStatement);
    for (index; index < insertValuesStatements.length; index += 1) {
      db?.exec?.(insertValuesStatements[index]);
    }
  } catch (error) {
    throw new Error(
      `${error.message}, row: ${index + 1}, statement: ${
        insertValuesStatements[index]
      } ${error.stack}`
    );
  }
};

export const DBContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [db, setDb] = useState<Database>();
  const [tableNames, setTableNames] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const SqlJs = await initSqlJs({
          locateFile: (fileName) => `/${fileName}`,
        });
        const newDB = new SqlJs.Database();
        setDb(newDB);
        const maybeEntries = await entries<string, string[][]>();
        maybeEntries.forEach(([name, values]) => {
          saveTableToDB(newDB, name, values);
          setTableNames((prev) => [...prev, name].sort());
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    })();
  }, []);

  const [queryError, setQueryError] = useState<any>();
  const [queryResult, setQueryResult] = useState<QueryExecResult[]>();

  const executeQuery = useCallback(
    (sql: string) => {
      try {
        const result = db?.exec(sql);
        setQueryResult(result);
        setQueryError(undefined);
      } catch (err) {
        setQueryError(err);
        setQueryResult([]);
      }
    },
    [db]
  );

  const saveTable = useCallback(
    async (name: string, values: string[][]) => {
      try {
        saveTableToDB(db, name, values);
      } catch (err) {
        console.log(err.message);
        setQueryError(err.message);
        setQueryResult([]);
      }

      setTableNames((prev) => [...prev, name].sort());
      await set(name, values);
    },
    [db]
  );

  const dbContextValue = useMemo(
    () => ({
      db,
      executeQuery,
      queryError,
      queryResult,
      tableNames,
      saveTable,
    }),
    [db, executeQuery, queryError, queryResult, saveTable, tableNames]
  );

  return (
    <DBContext.Provider value={dbContextValue}>{children}</DBContext.Provider>
  );
};
