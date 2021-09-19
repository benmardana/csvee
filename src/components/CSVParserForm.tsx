import React, { useCallback, useRef, useState } from 'react';
import { ParseResult, parse } from 'papaparse';

const reader = new FileReader();

const CSVParserForm = ({
  onParse,
}: {
  onParse?: (name: string, values: string[][]) => void;
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ParseResult<string[]>>();
  const [csvName, setCsvName] = useState<string>('');

  const handleOnFileChange = useCallback(() => {
    const file = fileInput.current?.files?.[0];

    // TODO: handle file not uploaded
    if (!file) return;

    reader.onload = ({ target }) =>
      typeof target?.result === 'string' &&
      parse<string[]>(file, {
        complete: (results) => setResult(results),
      });

    reader.readAsText(file);
  }, []);

  const handleOnSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // TODO: handle invalid form with errors
      if (!csvName || !result) return;

      onParse?.(csvName, result.data);
    },
    [csvName, result, onParse]
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

export default CSVParserForm;
