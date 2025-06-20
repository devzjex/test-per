import React from 'react';
import LoginGoogle from './_components/LoginGoogle';

export default function page({ searchParams }) {
    const state = searchParams.state;
    const code = searchParams.code;
    return <LoginGoogle state={state} code={code} />;
}
