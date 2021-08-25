import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import initSqlJs, { Database, QueryExecResult } from 'sql.js';

interface DBContextInterface {
  db?: Database;
  executeQuery?: (sql: string) => void;
  queryError?: string;
  queryResult?: QueryExecResult[];
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

  useEffect(() => {
    (async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });
        setDb(new SQL.Database());
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

  const dbContextValue = useMemo(
    () => ({
      db,
      executeQuery,
      queryError,
      queryResult,
    }),
    [db, executeQuery, queryError, queryResult]
  );

  return (
    <DBContext.Provider value={dbContextValue}>{children}</DBContext.Provider>
  );
};
