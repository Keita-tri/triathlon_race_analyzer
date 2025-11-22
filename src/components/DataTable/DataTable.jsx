import { useMemo } from 'react';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { sortData, filterData } from '../../utils/analytics';

export const DataTable = ({
    data, definitions,
    visibleColumns,
    columnOrder, setColumnOrder,
    sortConfig, setSortConfig,
    onMoveColumn, // Added onMoveColumn prop
    onMetricFocus,
    onToggle, // Added onToggle prop
    filters // Added filters prop
}) => {

    // 1. Filter
    const filteredData = useMemo(() => {
        return filterData(data, filters || {}, definitions);
    }, [data, filters, definitions]);

    // 2. Sort
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return sortData(filteredData, sortConfig.key, sortConfig.direction);
    }, [filteredData, sortConfig]);

    // 3. Columns to display
    const displayColumns = useMemo(() => {
        // Filter columnOrder to only include visible ones
        // But we also need to handle if columnOrder doesn't have new columns
        // For now, just map columnOrder and filter by visibleColumns
        return columnOrder
            .filter(id => visibleColumns.has(id))
            .map(id => definitions.find(d => d.id === id))
            .filter(Boolean);
    }, [columnOrder, visibleColumns, definitions]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <table className="w-full border-collapse text-sm">
            <TableHead
                columns={displayColumns}
                sortConfig={sortConfig}
                onSort={handleSort}
                onMoveColumn={onMoveColumn}
                onMetricFocus={onMetricFocus}
                onToggle={onToggle}
            />
            <TableBody
                data={sortedData}
                columns={displayColumns}
                definitions={definitions}
                onMetricFocus={onMetricFocus}
            />
        </table>
    );
};
