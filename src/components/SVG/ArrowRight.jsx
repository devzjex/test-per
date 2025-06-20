'use client';

import { EIconColor } from '@/common/enums';
import React from 'react';

const Svg = ({ color = EIconColor.BLACK }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.478 13.557H2.92432V10.443H15.478L10.6633 5.31595L12.7311 3.11401L21.0757 12L12.7311 20.886L10.6633 18.6841L15.478 13.557V13.557Z"
                fill={color}
            />
        </svg>
    );
};

export default Svg;
