import Papa from 'papaparse';

export const exportToCsv = (data, definitions, visibleColumns, columnOrder) => {
    // 1. Determine columns to export based on visibleColumns and columnOrder
    // Filter columnOrder to only include visible ones
    const exportColumns = columnOrder
        .filter(id => visibleColumns.has(id))
        .map(id => definitions.find(d => d.id === id))
        .filter(Boolean);

    // 2. Prepare data for export
    // Map data to an array of objects with label keys
    const exportData = data.map(row => {
        const rowData = {};
        exportColumns.forEach(col => {
            // Use label as key, or id if label is missing
            const key = col.label || col.id;
            rowData[key] = row[col.id];
        });
        return rowData;
    });

    // 3. Generate CSV string
    const csv = Papa.unparse(exportData);

    // 4. Trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `race_analysis_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
