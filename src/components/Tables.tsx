import React from 'react';
import useDB from './DBContext';

const Tables = () => {
  const { queryResult, queryError } = useDB();

  return (
    <>
      <div>{JSON.stringify(queryResult)}</div>
      <div>{JSON.stringify(queryError)}</div>
    </>
  );
};

export default Tables;
