import { Check, X } from 'lucide-react';

/**
 * Format a flag value (1 -> checkmark, 0/null -> dash)
 */
export const formatFlag = (value) => {
  if (value === 1) {
    return { type: 'icon', icon: Check, className: 'text-cyan-600', size: 14 };
  }
  return { type: 'text', value: '-', className: 'text-slate-400' };
};

/**
 * Format a number value
 */
export const formatNumber = (value, decimals = null) => {
  if (value === null || value === undefined) return '-';
  if (typeof value !== 'number') return value;
  
  if (decimals !== null) {
    return value.toFixed(decimals);
  }
  
  // Auto-detect: integers stay integers, floats get 2 decimals
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(2);
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  if (typeof value !== 'number') return value;
  
  return `${value.toFixed(decimals)}`;
};

/**
 * Format a date value
 */
export const formatDate = (value) => {
  if (!value) return '-';
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    return value;
  }
};

/**
 * Format a text value
 */
export const formatText = (value) => {
  if (value === null || value === undefined) return '-';
  return value.toString();
};

/**
 * Main formatter function that routes to specific formatters based on displayType
 */
export const formatValue = (value, displayType = 'text', options = {}) => {
  switch (displayType) {
    case 'flag':
      return formatFlag(value);
    case 'number':
      return { type: 'text', value: formatNumber(value, options.decimals) };
    case 'percentage':
      return { type: 'text', value: formatPercentage(value, options.decimals) };
    case 'date':
      return { type: 'text', value: formatDate(value) };
    case 'text':
    default:
      return { type: 'text', value: formatText(value) };
  }
};
