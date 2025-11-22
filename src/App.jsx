import { useState, useEffect, useMemo } from 'react';
import { loadData } from './utils/csvParser';
import { MainLayout } from './components/Layout/MainLayout';
import { Header } from './components/Layout/Header';
import { Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // View State
  const [visibleColumns, setVisibleColumns] = useState(new Set());
  const [columnOrder, setColumnOrder] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({ search: '' });
  const [focusedMetric, setFocusedMetric] = useState(null);

  const handleSolo = (metricId) => {
    setVisibleColumns(new Set(['event_title', metricId]));
  };

  const handleMoveColumn = (dragIndex, hoverIndex) => {
    const newOrder = [...columnOrder];
    const draggedItem = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedItem);
    setColumnOrder(newOrder);
  };

  const handlePreset = (preset) => {
    let newCols = new Set(['event_title']);

    // Clear all filters
    const newFilters = { search: '' };

    // Initialize filter states for filterable fields
    definitions.filter(d => d.filterable).forEach(d => {
      switch (d.filterType) {
        case 'multiselect':
          newFilters[d.id] = new Set();
          break;
        case 'range':
          newFilters[d.id] = {};
          break;
        case 'date':
          newFilters[d.id] = {};
          break;
        default:
          break;
      }
    });

    if (preset === 'beginner') {
      definitions.filter(d => d.presets && d.presets.includes('beginner')).forEach(d => newCols.add(d.id));
    } else if (preset === 'swim') {
      definitions.filter(d => d.presets && d.presets.includes('swim')).forEach(d => newCols.add(d.id));
    } else if (preset === 'bike') {
      definitions.filter(d => d.presets && d.presets.includes('bike')).forEach(d => newCols.add(d.id));
    } else if (preset === 'run') {
      definitions.filter(d => d.presets && d.presets.includes('run')).forEach(d => newCols.add(d.id));
    } else if (preset === 'points') {
      definitions.filter(d => d.presets && d.presets.includes('points')).forEach(d => newCols.add(d.id));
    }

    setVisibleColumns(newCols);
    setFilters(newFilters);
  };

  const handleShowAll = () => {
    const initialVisible = new Set(definitions.filter(d => d.category === '基本' || d.category === 'Rank').map(d => d.id));
    initialVisible.add('event_title');
    setVisibleColumns(initialVisible);
  };

  const handleToggleColumn = (id) => {
    const newSet = new Set(visibleColumns);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisibleColumns(newSet);
  };

  useEffect(() => {
    const init = async () => {
      const { data: loadedData, definitions: loadedDefs } = await loadData();
      setData(loadedData);
      setDefinitions(loadedDefs);

      // Initial visible columns (Beginner preset)
      const initialVisible = new Set(['event_title']);
      loadedDefs.filter(d => d.presets && d.presets.includes('beginner')).forEach(d => initialVisible.add(d.id));
      setVisibleColumns(initialVisible);

      // Initial column order - Ensure event_title is first
      const defaultOrder = loadedDefs.map(d => d.id);
      const titleIndex = defaultOrder.indexOf('event_title');
      if (titleIndex > -1) {
        defaultOrder.splice(titleIndex, 1);
        defaultOrder.unshift('event_title');
      }
      setColumnOrder(defaultOrder);

      // Initialize filters dynamically based on filterable fields
      const initialFilters = { search: '' };
      loadedDefs.filter(d => d.filterable).forEach(d => {
        switch (d.filterType) {
          case 'multiselect':
            initialFilters[d.id] = new Set();
            break;
          case 'range':
            initialFilters[d.id] = {};
            break;
          case 'date':
            initialFilters[d.id] = {};
            break;
          default:
            break;
        }
      });
      setFilters(initialFilters);

      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-cyan-600" size={48} />
        <span className="ml-4 text-slate-600">Loading Data...</span>
      </div>
    );
  }

  return (
    <>
      <Header dataCount={data.length} />
      <MainLayout
        data={data}
        definitions={definitions}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        filters={filters}
        setFilters={setFilters}
        focusedMetric={focusedMetric}
        setFocusedMetric={setFocusedMetric}
        onSolo={handleSolo}
        onPreset={handlePreset}
        onShowAll={handleShowAll}
        onToggle={handleToggleColumn}
        onMoveColumn={handleMoveColumn}
      />
    </>
  );
}

export default App;
