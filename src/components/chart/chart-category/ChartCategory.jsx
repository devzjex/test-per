'use client';

import React from 'react';
import { ChartWeeklyCategory } from './chart-weekly-category/ChartWeeklyCategory';

export default function ChartCategory(props) {
    return (
        <>
            <div className="chart-weekly-categories-best-match">
                <ChartWeeklyCategory loading={props.loading} value={props.dataBestMatch} />
            </div>
            <div className="chart-weekly-categories-popular">
                <ChartWeeklyCategory
                    loading={props.loading}
                    value={props.dataPopular}
                    title={'Category Popular Positional Changes'}
                />
            </div>
            {props.token && (
                <>
                    <div className="chart-weekly-categories-best-match change-kw">
                        <ChartWeeklyCategory
                            title={'Positional Keyword Changes'}
                            value={props.dataWeeklyChangeBestMatch}
                            loading={props.loading}
                        />
                    </div>
                    <div className="chart-weekly-categories-popular change-kw">
                        <ChartWeeklyCategory
                            title={'Positional Popular Keyword Changes'}
                            value={props.dataWeeklyChangePopular}
                            loading={props.loading}
                        />
                    </div>
                </>
            )}
        </>
    );
}
