import Papa from 'papaparse';
import metricsRegistry from '../config/metricsRegistry.json';

export const loadData = async () => {
  try {
    const response = await fetch('/data.csv');
    const dataText = await response.text();

    const dataResult = Papa.parse(dataText, { header: true, dynamicTyping: true, skipEmptyLines: true });

    return {
      data: dataResult.data,
      definitions: processDefinitions(metricsRegistry, dataResult.meta.fields)
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return { data: [], definitions: [] };
  }
};

const processDefinitions = (registry, dataFields) => {
  // Create a map of defined columns
  const definedColumns = new Set(registry.map(d => d.id));
  
  // Start with registry definitions
  const processedDefs = [...registry];

  // Add undefined columns from data as "Others"
  if (dataFields) {
    dataFields.forEach(field => {
      if (!definedColumns.has(field)) {
        processedDefs.push({
          id: field,
          label: field,
          category: 'その他',
          description: '自動検出されたカラム',
          rule: 'Depends',
          judgment: '',
          calculation: '',
          unit: '',
          presets: []
        });
      }
    });
  }

  return processedDefs;
};
