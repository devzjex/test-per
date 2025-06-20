import { useMemo, useState } from 'react';

const createGetValue = (sortColumn, isYearly = false) => {
    return (item) => {
        const suffix = isYearly ? '_yearly' : '_monthly';
        const suffixSub = isYearly ? '_yearly_subscription' : '_monthly_subscription';

        switch (sortColumn) {
            case 'merchants':
                return (item[`merchants${suffix}`] || 0) + (item[`merchants${suffixSub}`] || 0);
            case 'revenue':
                return (item[`rev${suffix}`] || 0) + (item[`rev${suffixSub}`] || 0);
            case 'percent':
                const p1 = parseFloat(item[`percent${suffix}`]) || 0;
                const p2 = parseFloat(item[`percent${suffixSub}`]) || 0;
                return p1 + p2;
            default:
                return 0;
        }
    };
};

export const useSort = (data, initialSortColumn = null, initialSortDirection = 'asc', isYearly = false) => {
    const [sortColumn, setSortColumn] = useState(initialSortColumn);
    const [sortDirection, setSortDirection] = useState(initialSortDirection);

    const sortedData = useMemo(() => {
        if (!sortColumn) return data;

        const getValue = createGetValue(sortColumn, isYearly);

        return [...data].sort((a, b) => {
            const valA = getValue(a);
            const valB = getValue(b);
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortColumn, sortDirection, isYearly]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    return { sortedData, sortColumn, sortDirection, handleSort };
};
