import {
  Button,
  Dialog,
  FileInput,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { ParseResult, parse } from 'papaparse';
import React, { useCallback, useRef, useState } from 'react';
import useDB from './DBContext';

const AddNewTableDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { saveTable } = useDB();
  const [result, setResult] = useState<ParseResult<string[]>['data']>();
  const [csvName, setCsvName] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);

  const handleOnFileChange = useCallback(() => {
    const file = fileInput.current?.files?.[0];

    // TODO: handle file not uploaded
    if (!file) return;

    parse<string[]>(file, {
      complete: (results) => setResult(results.data),
    });
  }, []);

  const handleOnSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // TODO: handle invalid form with errors
      if (csvName.length < 1 || !result) return;

      saveTable?.(csvName, result);

      onClose();
    },
    [csvName, onClose, result, saveTable]
  );

  return (
    <Dialog title="Add new table" isOpen={isOpen} onClose={onClose}>
      <form style={{ padding: '28px' }} onSubmit={handleOnSubmit}>
        <FormGroup label="CSV File">
          <FileInput
            text={
              fileInput.current?.files?.[0]
                ? fileInput.current?.files?.[0].name
                : 'Choose file...'
            }
            onInputChange={handleOnFileChange}
            inputProps={{ ref: fileInput, accept: '.csv' }}
            hasSelection={!!fileInput.current?.files?.[0]}
            fill
          />
        </FormGroup>
        <FormGroup label="Table name" style={{ marginBottom: '24px' }}>
          <InputGroup
            onChange={(event) => setCsvName(event.target.value)}
            placeholder="Enter name..."
            value={csvName}
          />
        </FormGroup>
        <Button
          disabled={!csvName || !result}
          type="submit"
          text="Import"
          intent={Intent.PRIMARY}
          large
          fill
        />
      </form>
    </Dialog>
  );
};

export default AddNewTableDialog;
