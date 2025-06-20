'use client';

import { EIconColor } from '@/common/enums';
import React from 'react';

const Svg = ({ color = EIconColor.BLACK }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.1213 10.5H21V13.5H8.1213L13.0606 18.4393L10.9393 20.5606L2.37866 12L10.9393 3.43933L13.0606 5.56065L8.1213 10.5Z"
                fill={color}
            />
        </svg>
    );
};

export default Svg;
