export const calculateHeatmapColor = (value, min, max, rule) => {
  if (rule === 'Depends' || typeof value !== 'number' || isNaN(value)) {
    return null;
  }

  if (min === max) return null;

  let pct = (value - min) / (max - min);
  
  // Clamp pct between 0 and 1
  pct = Math.max(0, Math.min(1, pct));

  if (rule === 'Negative') {
    pct = 1 - pct;
  }

  // Base opacity 0.05, scale up to 0.4
  const base = 0.05;
  const scale = 0.4;
  const alpha = base + (pct * scale);

  return `rgba(6, 182, 212, ${alpha})`; // Cyan color
};

export const getMinMaxValues = (data, key) => {
  let min = Infinity;
  let max = -Infinity;
  
  data.forEach(row => {
    const val = row[key];
    if (typeof val === 'number' && !isNaN(val)) {
      if (val < min) min = val;
      if (val > max) max = val;
    }
  });

  return { min, max };
};

export const sortData = (data, key, order) => {
  return [...data].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    if (order === 'asc') {
      return valA < valB ? -1 : 1;
    } else {
      return valA > valB ? -1 : 1;
    }
  });
};

export const filterData = (data, filters, definitions = []) => {
  return data.filter(row => {
    // Search filter (special case)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const title = (row.event_title || '').toLowerCase();
      const venue = (row.event_venue || '').toLowerCase();
      if (!title.includes(searchLower) && !venue.includes(searchLower)) {
        return false;
      }
    }

    // Dynamic filters based on definitions
    for (const def of definitions) {
      if (!def.filterable || !def.id) continue;
      
      const filterValue = filters[def.id];
      if (!filterValue) continue;

      const rowValue = row[def.id];
      
      switch (def.filterType) {
        case 'multiselect':
          // Filter expects a Set of values
          if (filterValue.size > 0) {
            const rowValueStr = String(rowValue);
            if (!filterValue.has(rowValueStr)) {
              return false;
            }
          }
          break;
          
        case 'range':
          // Filter expects { min, max }
          if (filterValue.min !== undefined && filterValue.min !== null) {
            if (rowValue < filterValue.min) {
              return false;
            }
          }
          if (filterValue.max !== undefined && filterValue.max !== null) {
            if (rowValue > filterValue.max) {
              return false;
            }
          }
          break;
          
        case 'date':
          // Filter expects { start, end } as Date objects or strings
          if (filterValue.start || filterValue.end) {
            const rowDate = new Date(rowValue);
            if (isNaN(rowDate.getTime())) {
              return false; // Invalid date in data
            }
            
            if (filterValue.start) {
              const startDate = new Date(filterValue.start);
              if (rowDate < startDate) {
                return false;
              }
            }
            
            if (filterValue.end) {
              const endDate = new Date(filterValue.end);
              if (rowDate > endDate) {
                return false;
              }
            }
          }
          break;
          
        default:
          // Unknown filter type, skip
          break;
      }
    }

    return true;
  });
};
