import React, { useCallback, useRef, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';

import useDB from './DBContext';

const CsvUploader = () => {
  const { saveTable } = useDB();
  const fileInput = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ParseResult<string[]>>();
  const [csvName, setCsvName] = useState<string>('');

  const handleOnFileChange = useCallback((event) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    reader.onload = (onloadEvent) =>
      typeof onloadEvent.target?.result === 'string' &&
      Papa.parse<string[]>(file, {
        complete: (results) => setResult(results),
      });
    reader.readAsText(file);
  }, []);

  const handleOnSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!csvName || !result) return;
      saveTable?.(csvName, result.data);
    },
    [csvName, saveTable, result]
  );

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        ref={fileInput}
        type="file"
        accept=".csv"
        onChange={handleOnFileChange}
      />
      <input
        type="text"
        value={csvName}
        onChange={(event) => setCsvName(event.target.value)}
      />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default CsvUploader;
