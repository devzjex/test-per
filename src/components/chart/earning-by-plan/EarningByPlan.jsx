'use client';

import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tooltip as AntTooltip, Empty } from 'antd';
import './EarningByPlan.scss';
import { ExclamationCircleOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useSort } from './hooks/useSort';

const cleanLabel = (label) => {
    if (!label) return '';
    let filtered = label.replace(/^Charge - /, '').trim();
    return filtered;
};

const formatPercent = (percent) => {
    const val = percent * 100;
    if (Number.isInteger(val)) {
        return `${val}%`;
    } else if (val > 100) {
        return `${Math.floor(val)}%`;
    } else {
        return `${val.toFixed(2)}%`;
    }
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
            {formatPercent(percent)}
        </text>
    );
};

function formatMoneyShort(amount) {
    if (amount >= 1_000_000) {
        const millions = Math.floor(amount / 100_000) / 10;
        return `$${millions}M`;
    } else if (amount >= 1_000) {
        const thousands = Math.floor(amount / 100) / 10;
        return `$${thousands}k`;
    } else {
        return `$${amount.toFixed(2)}`;
    }
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const color = payload[0].payload.fill;
        const { price_name, value, price } = payload[0].payload;

        return (
            <div className="custom-tooltip_style">
                <div
                    className="content"
                    style={{
                        backgroundColor: color,
                    }}
                />
                <p className="title-tooltip">{`${cleanLabel(price_name)}: $${price}`}</p>
            </div>
        );
    }

    return null;
};

const CustomTooltipSub = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const color = payload[0].payload.fill;
        const { price_name, value, percent } = payload[0].payload;

        const percentFormatted = formatPercent(percent);

        return (
            <div className="custom-tooltip_style">
                <div
                    className="content"
                    style={{
                        backgroundColor: color,
                    }}
                />
                <p className="title-tooltip">
                    {`${price_name}: ${formatMoneyShort(value)}`}
                    {percentFormatted ? ` (${percentFormatted})` : ''}
                </p>
            </div>
        );
    }

    return null;
};

export default function EarningByPlan(props) {
    const valueEarning = props.value.earning_by_pricing;
    const valueSubscription = props.value.subscription_by_pricing;
    const [hiddenItems, setHiddenItems] = useState([]);

    const aggregatedData = useMemo(() => {
        if (!valueEarning) return [];

        return valueEarning.reduce((acc, item) => {
            const existing = acc.find((el) => el.price_name === item.price_name);
            const revenue = Number((item.count * item.price).toFixed(2));

            if (existing) {
                existing.count += item.count;
                existing.value = Number((existing.value + revenue).toFixed(2));
            } else {
                acc.push({
                    price_name: item.price_name,
                    count: item.count,
                    value: revenue,
                    type: item.type,
                    price: item.price,
                });
            }

            return acc;
        }, []);
    }, [valueEarning]);

    const aggregatedDataSubscription = useMemo(() => {
        if (!valueSubscription) return [];

        return valueSubscription.reduce((acc, item) => {
            const existing = acc.find((el) => el.price_name === item.price_name);
            const revenue = Number(item.total_price_net.toFixed(2));

            if (existing) {
                existing.count += item.count;
                existing.value = Number((existing.value + revenue).toFixed(2));
            } else {
                acc.push({
                    price_name: item.price_name,
                    count: item.count,
                    value: revenue,
                    type: item.type,
                });
            }

            return acc;
        }, []);
    }, [valueSubscription]);

    const COLORS = [
        '#663399',
        '#3CB371',
        '#FFBB28',
        '#FF8042',
        '#4169E1',
        '#A0522D',
        '#FF6347',
        '#20B2AA',
        '#9370DB',
        '#F4A460',
        '#2E8B57',
        '#D2691E',
        '#6495ED',
        '#FF4500',
        '#008080',
        '#B22222',
        '#5F9EA0',
        '#FF69B4',
        '#CD5C5C',
        '#8B0000',
    ];

    const totalValue = aggregatedData.reduce((acc, item) => acc + item.value, 0);
    const totalValueSub = aggregatedDataSubscription.reduce((acc, item) => acc + item.value, 0);

    const dataChartWithColors = aggregatedData.map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
        percent: item.value / totalValue,
    }));

    const dataChartSubWithColors = aggregatedDataSubscription.map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
        percent: item.value / totalValueSub,
    }));

    const visibleData = dataChartWithColors.filter((item) => {
        const cleanedName = cleanLabel(item.price_name);
        return !hiddenItems.includes(cleanedName);
    });

    const visibleDataSubscription = dataChartSubWithColors.filter((item) => !hiddenItems.includes(item.price_name));

    const handleLegendClick = (itemName) => {
        const cleanedName = cleanLabel(itemName);
        setHiddenItems((prev) =>
            prev.includes(cleanedName) ? prev.filter((name) => name !== cleanedName) : [...prev, cleanedName],
        );
    };

    const getTotalMerchants = (value) => {
        return value
            ? value.filter((item) => item.type !== 'other').reduce((accumulator, item) => accumulator + item.count, 0)
            : 0;
    };

    const getTotalRev = (value) => {
        return value
            ? value.filter((item) => item.type !== 'other').reduce((acc, item) => acc + item.count * item.price, 0)
            : 0;
    };

    const data = useMemo(() => {
        const dataMonthly = valueEarning ? valueEarning.filter((item) => item.type === 'monthly') : [];
        const dataYearly = valueEarning ? valueEarning.filter((item) => item.type === 'yearly') : [];

        const sumCount = valueEarning
            ? valueEarning
                  .filter((item) => item.type !== 'other')
                  .reduce((acc, item) => acc + item.price * item.count, 0)
            : 0;

        const getPricePlan = (plans) => {
            const uniquePrices = {};
            return plans
                ? plans
                      .filter((item) => item.type !== 'other')
                      .filter((element) => {
                          const { price_monthly } = element;
                          if (uniquePrices[price_monthly]) return false;
                          uniquePrices[price_monthly] = true;
                          return true;
                      })
                : [];
        };

        return getPricePlan(valueEarning).map((item) => {
            const yearly = dataYearly.find((ele) => ele.price_monthly === item.price_monthly);
            const monthly = dataMonthly.find((ele) => ele.price_monthly === item.price_monthly);

            const percent_monthly_earning = monthly ? ((monthly.count * monthly.price_monthly) / sumCount) * 100 : 0;
            const percent_yearly_earning = yearly ? ((yearly.count * yearly.price) / sumCount) * 100 : 0;

            return {
                price: item ? `$${item.price_monthly}` : ' ',
                merchants_yearly: yearly ? yearly.count : 0,
                merchants_monthly: monthly ? monthly.count : 0,
                rev_yearly: yearly ? Math.round(yearly.count * yearly.price) : 0,
                rev_monthly: monthly ? Math.round(monthly.count * monthly.price_monthly) : 0,
                percent_yearly: yearly ? `${percent_yearly_earning.toFixed(2)}%` : 0,
                percent_monthly: monthly ? `${percent_monthly_earning.toFixed(2)}%` : 0,
            };
        });
    }, [valueEarning]);

    const dataSubscription = useMemo(() => {
        if (!valueSubscription) return [];

        const grouped = valueSubscription.reduce((acc, item) => {
            const existing = acc.find((el) => el.price_monthly === item.price_monthly && el.type === item.type);
            const revenue = item.total_price_net;
            if (existing) {
                existing.count += item.count;
                existing.revenue += revenue;
            } else {
                acc.push({
                    price_monthly: item.price_monthly,
                    price_name: item.price_name,
                    count: item.count,
                    revenue: revenue,
                    type: item.type,
                    price_sub_yearly: item.price,
                });
            }
            return acc;
        }, []);

        const dataMonthlySubscription = grouped.filter((item) => item.type === 'monthly');
        const dataYearlySubscription = grouped.filter((item) => item.type === 'yearly');
        const sumRevenueSubscription = grouped
            .filter((item) => item.type !== 'other')
            .reduce((acc, item) => acc + item.revenue, 0);

        const uniquePriceMonthlySet = new Set(grouped.map((item) => item.price_monthly));
        const uniquePrices = Array.from(uniquePriceMonthlySet);

        return uniquePrices.map((priceMonthly) => {
            const monthlySubscription = dataMonthlySubscription.find((ele) => ele.price_monthly === priceMonthly);
            const yearlySubscription = dataYearlySubscription.find((ele) => ele.price_monthly === priceMonthly);

            const percent_monthly_subscription = monthlySubscription
                ? (monthlySubscription.revenue / sumRevenueSubscription) * 100
                : 0;
            const percent_yearly_subscription = yearlySubscription
                ? (yearlySubscription.revenue / sumRevenueSubscription) * 100
                : 0;

            return {
                price: `$${priceMonthly}`,
                price_sub_yearly: yearlySubscription ? `$${yearlySubscription.price_sub_yearly}` : null,
                merchants_monthly_subscription: monthlySubscription ? monthlySubscription.count : 0,
                merchants_yearly_subscription: yearlySubscription ? yearlySubscription.count : 0,
                rev_monthly_subscription: monthlySubscription ? Math.round(monthlySubscription.revenue) : 0,
                rev_yearly_subscription: yearlySubscription ? Math.round(yearlySubscription.revenue) : 0,
                percent_monthly_subscription: monthlySubscription
                    ? `${percent_monthly_subscription.toFixed(2)}%`
                    : '0%',
                percent_yearly_subscription: yearlySubscription ? `${percent_yearly_subscription.toFixed(2)}%` : '0%',
            };
        });
    }, [valueSubscription]);

    const mergedData = useMemo(() => {
        const pricesFromData = data.map((item) => item.price);
        const pricesFromSubscription = dataSubscription.map((item) => item.price);
        const allPrices = Array.from(new Set([...pricesFromData, ...pricesFromSubscription])).filter((priceStr) => {
            // Loại bỏ các giá có dấu âm hoặc giá <= 0
            const num = Number(priceStr.replace('$', ''));
            return num > 0;
        });

        return allPrices.map((price) => {
            const d = data.find((item) => item.price === price) || {};
            const s = dataSubscription.find((item) => item.price === price) || {};

            return {
                price,
                price_sub_yearly: s.price_sub_yearly || null,
                merchants_monthly: d.merchants_monthly || 0,
                merchants_monthly_subscription: s.merchants_monthly_subscription || 0,
                rev_monthly: d.rev_monthly || 0,
                rev_monthly_subscription: s.rev_monthly_subscription || 0,
                percent_monthly: d.percent_monthly || '0%',
                percent_monthly_subscription: s.percent_monthly_subscription || '0%',
                merchants_yearly: d.merchants_yearly || 0,
                merchants_yearly_subscription: s.merchants_yearly_subscription || 0,
                rev_yearly: d.rev_yearly || 0,
                rev_yearly_subscription: s.rev_yearly_subscription || 0,
                percent_yearly: d.percent_yearly || '0%',
                percent_yearly_subscription: s.percent_yearly_subscription || '0%',
            };
        });
    }, [data, dataSubscription]);

    const truncateLabel = (label, maxLength = 20) => {
        if (label.length > maxLength) {
            return label.substring(0, maxLength) + '...';
        }
        return label;
    };

    const getTooltipContent = (value) => {
        return (
            <AntTooltip title={value} placement="top">
                <ExclamationCircleOutlined />
            </AntTooltip>
        );
    };

    const totalMerchantsMonthlySubscription = dataSubscription.reduce(
        (acc, item) => acc + (item.merchants_monthly_subscription || 0),
        0,
    );

    const totalRevMonthlySubscription = dataSubscription.reduce(
        (acc, item) => acc + (item.rev_monthly_subscription || 0),
        0,
    );

    const totalMerchantsYearlySubscription = dataSubscription.reduce(
        (acc, item) => acc + (item.merchants_yearly_subscription || 0),
        0,
    );
    const totalRevYearlySubscription = dataSubscription.reduce(
        (acc, item) => acc + (item.rev_yearly_subscription || 0),
        0,
    );

    const totalPriceMonthlyEarningNegative = valueEarning
        ? (() => {
              const sum = valueEarning
                  .filter((item) => item.type === 'monthly' && item.price_monthly < 0)
                  .reduce((acc, item) => acc + item.price_monthly, 0);
              return sum === 0 ? 0 : sum.toFixed(2);
          })()
        : 0;

    const totalPriceMonthlySubscriptionNegative = valueSubscription
        ? (() => {
              const sum = valueSubscription
                  .filter((item) => item.type === 'monthly' && item.total_price_net < 0)
                  .reduce((acc, item) => acc + item.total_price_net, 0);
              return sum === 0 ? 0 : sum.toFixed(2);
          })()
        : 0;

    const totalPriceYearlyEarningNegative = valueEarning
        ? (() => {
              const sum = valueEarning
                  .filter((item) => item.type === 'yearly' && item.price_monthly < 0)
                  .reduce((acc, item) => acc + item.price_monthly, 0);
              return sum === 0 ? 0 : sum.toFixed(2);
          })()
        : 0;

    const totalPriceYearlySubscriptionNegative = valueSubscription
        ? (() => {
              const sum = valueSubscription
                  .filter((item) => item.type === 'yearly' && item.total_price_net < 0)
                  .reduce((acc, item) => acc + item.total_price_net, 0);
              return sum === 0 ? 0 : sum.toFixed(2);
          })()
        : 0;

    const {
        sortedData: sortedDataMonthly,
        sortColumn: sortColumnMonthly,
        sortDirection: sortDirectionMonthly,
        handleSort: handleSortMonthly,
    } = useSort(mergedData, null, 'asc', false);

    const {
        sortedData: sortedDataYearly,
        sortColumn: sortColumnYearly,
        sortDirection: sortDirectionYearly,
        handleSort: handleSortYearly,
    } = useSort(mergedData, null, 'asc', true);

    const SortIcon = ({ active, direction }) => {
        if (!active) return null;
        return direction === 'asc' ? (
            <SortAscendingOutlined style={{ float: 'right' }} />
        ) : (
            <SortDescendingOutlined style={{ float: 'right' }} />
        );
    };

    const headersMonthly = [
        {
            key: 'merchants',
            label: 'Merchants',
            tooltip: 'Number of merchants using this plan in the monthly(subscription | earning)',
        },
        {
            key: 'revenue',
            label: 'Revenue',
            tooltip: 'Total revenue from this plan in the monthly(subscription | earning)',
        },
        {
            key: 'percent',
            label: '%',
            tooltip: 'Percentage contribution of this plan in the monthly(subscription | earning)',
        },
    ];

    const headersYearly = [
        {
            key: 'merchants',
            label: 'Merchants',
            tooltip: 'Number of merchants using this plan in the yearly(subscription | earning)',
        },
        {
            key: 'revenue',
            label: 'Revenue',
            tooltip: 'Total revenue from this plan in the yearly(subscription | earning)',
        },
        {
            key: 'percent',
            label: '%',
            tooltip: 'Percentage contribution of this plan in the yearly(subscription | earning)',
        },
    ];

    return (
        <div className="row-earning">
            <div className="title-earning">
                <span> Subscription | Earning by Plans</span>
            </div>

            <div className="content-earning">
                <div className="table-subscription_earning">
                    <div className="table-earning-value">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="thead-parent">
                                        Price Plan
                                    </th>
                                    <th colSpan={3} className="thead-parent text-center">
                                        Monthly
                                    </th>
                                </tr>
                                <tr>
                                    {headersMonthly.map(({ key, label, tooltip }) => (
                                        <th
                                            key={key}
                                            onClick={() => handleSortMonthly(key)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {label} {getTooltipContent(tooltip)}{' '}
                                            <SortIcon
                                                active={sortColumnMonthly === key}
                                                direction={sortDirectionMonthly}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const rows = [];
                                    let hasAnyData = false;

                                    const isZeroPercent = (val) => val === '0%' || val === '0.00%';

                                    sortedDataMonthly.forEach((item, index) => {
                                        const hasData =
                                            item.merchants_monthly_subscription !== 0 ||
                                            item.merchants_monthly !== 0 ||
                                            item.rev_monthly_subscription !== 0 ||
                                            item.rev_monthly !== 0 ||
                                            !isZeroPercent(item.percent_monthly_subscription) ||
                                            !isZeroPercent(item.percent_monthly);

                                        if (hasData) {
                                            hasAnyData = true;
                                            rows.push(
                                                <tr key={index}>
                                                    <td style={{ fontWeight: 'bold' }}>{item.price || ' '}</td>

                                                    {/* Monthly */}
                                                    <td>
                                                        <div className="double-value-cell">
                                                            {item.merchants_monthly_subscription === 0 &&
                                                            item.merchants_monthly === 0 ? (
                                                                <span></span>
                                                            ) : (
                                                                <>
                                                                    <span>{item.merchants_monthly}</span>
                                                                    <div className="divider" />
                                                                    <span>{item.merchants_monthly_subscription}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="double-value-cell">
                                                            {item.rev_monthly_subscription === 0 &&
                                                            item.rev_monthly === 0 ? (
                                                                <span></span>
                                                            ) : (
                                                                <>
                                                                    <span>
                                                                        ${item.rev_monthly.toLocaleString('en-US')}
                                                                    </span>
                                                                    <div className="divider" />
                                                                    <span>
                                                                        $
                                                                        {item.rev_monthly_subscription.toLocaleString(
                                                                            'en-US',
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="double-value-cell">
                                                            {isZeroPercent(item.percent_monthly_subscription) &&
                                                            isZeroPercent(item.percent_monthly) ? (
                                                                <span></span>
                                                            ) : (
                                                                <>
                                                                    <span>{item.percent_monthly}</span>
                                                                    <div className="divider" />
                                                                    <span>{item.percent_monthly_subscription}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>,
                                            );
                                        }
                                    });

                                    if (!hasAnyData) {
                                        rows.push(
                                            <tr key="no-data">
                                                <td
                                                    colSpan={4}
                                                    style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}
                                                >
                                                    No data
                                                </td>
                                            </tr>,
                                        );
                                    }

                                    return (
                                        <>
                                            {rows}
                                            {hasAnyData && (
                                                <tr className="sum-row">
                                                    <td>
                                                        {!(
                                                            totalPriceMonthlyEarningNegative === 0 &&
                                                            totalPriceMonthlySubscriptionNegative === 0
                                                        ) ? (
                                                            <p>Cancel</p>
                                                        ) : (
                                                            <p className="no-data"></p>
                                                        )}
                                                        <p>Sum</p>
                                                        <p>Percent</p>
                                                    </td>
                                                    <td>
                                                        <p className="no-data"></p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                {totalMerchantsMonthlySubscription === 0 &&
                                                                data.reduce(
                                                                    (acc, item) => acc + item.merchants_monthly,
                                                                    0,
                                                                ) === 0 ? (
                                                                    <span></span>
                                                                ) : (
                                                                    <>
                                                                        <span>
                                                                            {data
                                                                                .reduce(
                                                                                    (acc, item) =>
                                                                                        acc + item.merchants_monthly,
                                                                                    0,
                                                                                )
                                                                                .toLocaleString('en-US')}
                                                                        </span>
                                                                        <div className="divider" />
                                                                        <span>
                                                                            {totalMerchantsMonthlySubscription.toLocaleString(
                                                                                'en-US',
                                                                            )}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                <span>
                                                                    {formatPercent(
                                                                        data.reduce(
                                                                            (acc, item) => acc + item.merchants_monthly,
                                                                            0,
                                                                        ) / getTotalMerchants(valueEarning),
                                                                    )}
                                                                </span>
                                                                <div className="divider" />
                                                                <span>
                                                                    {formatPercent(
                                                                        totalMerchantsMonthlySubscription /
                                                                            getTotalMerchants(valueSubscription),
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                {totalPriceMonthlyEarningNegative === 0 &&
                                                                totalPriceMonthlySubscriptionNegative === 0 ? (
                                                                    <span
                                                                        style={{
                                                                            minWidth: 60,
                                                                            textAlign: 'right',
                                                                            marginTop: '15px',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <span>${totalPriceMonthlyEarningNegative}</span>
                                                                        <div className="divider" />
                                                                        <span>
                                                                            ${totalPriceMonthlySubscriptionNegative}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                {totalRevMonthlySubscription === 0 &&
                                                                data.reduce(
                                                                    (acc, item) => acc + item.rev_monthly,
                                                                    0,
                                                                ) === 0 ? (
                                                                    <span></span>
                                                                ) : (
                                                                    <>
                                                                        <span>
                                                                            $
                                                                            {data
                                                                                .reduce(
                                                                                    (acc, item) =>
                                                                                        acc + item.rev_monthly,
                                                                                    0,
                                                                                )
                                                                                .toLocaleString('en-US')}
                                                                        </span>
                                                                        <div className="divider" />
                                                                        <span>
                                                                            $
                                                                            {totalRevMonthlySubscription.toLocaleString(
                                                                                'en-US',
                                                                            )}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                <span>
                                                                    {formatPercent(
                                                                        data.reduce(
                                                                            (acc, item) => acc + item.rev_monthly,
                                                                            0,
                                                                        ) / getTotalRev(valueEarning),
                                                                    )}
                                                                </span>
                                                                <div className="divider" />
                                                                <span>
                                                                    {formatPercent(
                                                                        totalRevMonthlySubscription /
                                                                            getTotalRev(valueSubscription),
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </p>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-earning-value subscription">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="thead-parent">
                                        Price Plan
                                    </th>
                                    <th colSpan={3} className="text-center" style={{ fontSize: '18px' }}>
                                        Yearly
                                    </th>
                                </tr>
                                <tr>
                                    {headersYearly.map(({ key, label, tooltip }) => (
                                        <th
                                            key={key}
                                            onClick={() => handleSortYearly(key)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {label} {getTooltipContent(tooltip)}{' '}
                                            <SortIcon
                                                active={sortColumnYearly === key}
                                                direction={sortDirectionYearly}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const rows = [];
                                    let hasAnyData = false;

                                    const isZeroPercent = (val) => val === '0%' || val === '0.00%';

                                    sortedDataYearly.forEach((item, index) => {
                                        const hasData =
                                            item.merchants_yearly_subscription !== 0 ||
                                            item.merchants_yearly !== 0 ||
                                            item.rev_yearly_subscription !== 0 ||
                                            item.rev_yearly !== 0 ||
                                            !isZeroPercent(item.percent_yearly_subscription) ||
                                            !isZeroPercent(item.percent_yearly);

                                        if (hasData) {
                                            hasAnyData = true;
                                            rows.push(
                                                <tr key={index}>
                                                    <td style={{ fontWeight: 'bold' }}>{item.price || ' '}</td>
                                                    {/* Yearly */}
                                                    <td>
                                                        <div className="double-value-cell">
                                                            {item.merchants_yearly_subscription === 0 &&
                                                            item.merchants_yearly === 0 ? (
                                                                <span></span>
                                                            ) : (
                                                                <>
                                                                    <span>{item.merchants_yearly}</span>
                                                                    <div className="divider" />
                                                                    <span>{item.merchants_yearly_subscription}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="double-value-cell">
                                                            {item.rev_yearly_subscription === 0 &&
                                                            item.rev_yearly === 0 ? (
                                                                <span></span>
                                                            ) : (
                                                                <>
                                                                    <span>
                                                                        ${item.rev_yearly.toLocaleString('en-US')}
                                                                    </span>
                                                                    <div className="divider" />
                                                                    <span>
                                                                        $
                                                                        {item.rev_yearly_subscription.toLocaleString(
                                                                            'en-US',
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="double-value-cell">
                                                            {isZeroPercent(item.percent_yearly_subscription) &&
                                                            isZeroPercent(item.percent_yearly) ? (
                                                                <span></span>
                                                            ) : (
                                                                <>
                                                                    <span>{item.percent_yearly}</span>
                                                                    <div className="divider" />
                                                                    <span>{item.percent_yearly_subscription}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>,
                                            );
                                        }
                                    });

                                    if (!hasAnyData) {
                                        rows.push(
                                            <tr key="no-data" className="no-data-row">
                                                <td colSpan={4}>
                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                </td>
                                            </tr>,
                                        );
                                    }

                                    return (
                                        <>
                                            {rows}
                                            {hasAnyData ? (
                                                <tr className="sum-row">
                                                    <td>
                                                        {!(
                                                            totalPriceYearlyEarningNegative === 0 &&
                                                            totalPriceYearlySubscriptionNegative === 0
                                                        ) ? (
                                                            <p>Cancel</p>
                                                        ) : (
                                                            <p className="no-data"></p>
                                                        )}
                                                        <p>Sum</p>
                                                        <p>Percent</p>
                                                    </td>
                                                    <td>
                                                        <p className="no-data"></p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                {totalMerchantsYearlySubscription === 0 &&
                                                                data.reduce(
                                                                    (acc, item) => acc + item.merchants_yearly,
                                                                    0,
                                                                ) === 0 ? (
                                                                    <span></span>
                                                                ) : (
                                                                    <>
                                                                        <span>
                                                                            {data
                                                                                .reduce(
                                                                                    (acc, item) =>
                                                                                        acc + item.merchants_yearly,
                                                                                    0,
                                                                                )
                                                                                .toLocaleString('en-US')}
                                                                        </span>
                                                                        <div className="divider" />
                                                                        <span>
                                                                            {totalMerchantsYearlySubscription.toLocaleString(
                                                                                'en-US',
                                                                            )}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                <span>
                                                                    {(
                                                                        (data.reduce(
                                                                            (acc, item) => acc + item.merchants_yearly,
                                                                            0,
                                                                        ) /
                                                                            getTotalMerchants(valueEarning)) *
                                                                        100
                                                                    )
                                                                        .toFixed(2)
                                                                        .toLocaleString('en-US')}
                                                                    %
                                                                </span>
                                                                <div className="divider" />
                                                                <span>
                                                                    {(
                                                                        (totalMerchantsYearlySubscription /
                                                                            getTotalMerchants(valueSubscription)) *
                                                                        100
                                                                    )
                                                                        .toFixed(2)
                                                                        .toLocaleString('en-US')}
                                                                    %
                                                                </span>
                                                            </div>
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                {totalPriceYearlyEarningNegative === 0 &&
                                                                totalPriceYearlySubscriptionNegative === 0 ? (
                                                                    <span
                                                                        style={{
                                                                            minWidth: 60,
                                                                            textAlign: 'right',
                                                                            marginTop: '15px',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <span>${totalPriceYearlyEarningNegative}</span>
                                                                        <div className="divider" />
                                                                        <span>
                                                                            ${totalPriceYearlySubscriptionNegative}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                {totalRevYearlySubscription === 0 &&
                                                                data.reduce((acc, item) => acc + item.rev_yearly, 0) ===
                                                                    0 ? (
                                                                    <span></span>
                                                                ) : (
                                                                    <>
                                                                        <span>
                                                                            $
                                                                            {data
                                                                                .reduce(
                                                                                    (acc, item) =>
                                                                                        acc + item.rev_yearly,
                                                                                    0,
                                                                                )
                                                                                .toLocaleString('en-US')}
                                                                        </span>
                                                                        <div className="divider" />
                                                                        <span>
                                                                            $
                                                                            {totalRevYearlySubscription.toLocaleString(
                                                                                'en-US',
                                                                            )}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </p>
                                                        <p>
                                                            <div className="double-value-cell">
                                                                <span>
                                                                    {(
                                                                        (data.reduce(
                                                                            (acc, item) => acc + item.rev_yearly,
                                                                            0,
                                                                        ) /
                                                                            getTotalRev(valueEarning)) *
                                                                        100
                                                                    )
                                                                        .toFixed(2)
                                                                        .toLocaleString('en-US')}
                                                                    %
                                                                </span>
                                                                <div className="divider" />
                                                                <span>
                                                                    {(
                                                                        (totalRevYearlySubscription /
                                                                            getTotalRev(valueSubscription)) *
                                                                        100
                                                                    )
                                                                        .toFixed(2)
                                                                        .toLocaleString('en-US')}
                                                                    %
                                                                </span>
                                                            </div>
                                                        </p>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="container-chart">
                    <div className="percent-chart">
                        <h3>Subscription by Pricing Plans</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={visibleData}
                                    dataKey="value"
                                    nameKey="price_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={130}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {visibleData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            opacity={hiddenItems.includes(cleanLabel(entry.price_name)) ? 0.3 : 1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    onClick={(e) => handleLegendClick(e.value)}
                                    payload={aggregatedData.map((item, index) => {
                                        return {
                                            id: cleanLabel(item.price_name),
                                            value: cleanLabel(item.price_name),
                                            type: 'square',
                                            color: COLORS[index % COLORS.length],
                                            inactive: hiddenItems.includes(item.price_name),
                                        };
                                    })}
                                    formatter={(value, entry) => {
                                        const cleaned = cleanLabel(value);
                                        return (
                                            <span
                                                style={{
                                                    textDecoration: hiddenItems.includes(entry.id)
                                                        ? 'line-through'
                                                        : 'none',
                                                    fontSize: '12px',
                                                    color: '#000000',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {truncateLabel(cleaned)}
                                            </span>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="percent-chart">
                        <h3>Earning by Pricing Plans</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={visibleDataSubscription}
                                    dataKey="value"
                                    nameKey="price_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={130}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {visibleDataSubscription.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            opacity={hiddenItems.includes(entry.value) ? 0.3 : 1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltipSub />} />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    onClick={(e) => handleLegendClick(e.value)}
                                    payload={aggregatedDataSubscription.map((item, index) => ({
                                        id: item.price_name,
                                        value: item.price_name,
                                        type: 'square',
                                        color: COLORS[index % COLORS.length],
                                        inactive: hiddenItems.includes(item.price_name),
                                    }))}
                                    formatter={(value, entry) => {
                                        return (
                                            <span
                                                style={{
                                                    textDecoration: hiddenItems.includes(entry.id)
                                                        ? 'line-through'
                                                        : 'none',
                                                    fontSize: '12px',
                                                    color: '#000000',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {truncateLabel(value)}
                                            </span>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
