import React from 'react';
import LoginGoogle from './_components/LoginGoogle';

export default async function page(props) {
  const searchParams = await props.searchParams;
  const state = searchParams.state;
  const code = searchParams.code;
  return <LoginGoogle state={state} code={code} />;
}
