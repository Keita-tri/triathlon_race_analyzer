import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Filter, X, Trophy, Calendar, Trash2, Sprout, Waves, Bike, Footprints, Target, ChevronDown, Download, Menu } from 'lucide-react';
import clsx from 'clsx';
import { filterData, sortData } from '../../utils/analytics';
import { exportToCsv } from '../../utils/csvExporter';

export const Toolbar = ({ data, filters, setFilters, setVisibleColumns, definitions, onPreset, sortConfig, columnOrder, visibleColumns, onMobileMenuToggle }) => {
    // Extract filterable fields from definitions
    const filterableFields = useMemo(() => {
        return definitions.filter(def => def.filterable === true);
    }, [definitions]);

    // Get unique values for each multiselect filter
    const getFilterOptions = (fieldId) => {
        const uniqueValues = Array.from(new Set(data.map(d => d[fieldId]))).filter(v => v !== null && v !== undefined);
        return uniqueValues.sort();
    };

    // Get icon for filter field
    const getFilterIcon = (fieldId) => {
        const iconMap = {
            'race_year': Calendar,
            'event_class': Trophy,
        };
        return iconMap[fieldId] || Filter;
    };

    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const toggleMultiselectFilter = (fieldId, value) => {
        setFilters(prev => {
            const currentSet = prev[fieldId] || new Set();
            const newSet = new Set(currentSet);
            if (newSet.has(String(value))) {
                newSet.delete(String(value));
            } else {
                newSet.add(String(value));
            }
            return { ...prev, [fieldId]: newSet };
        });
    };

    const setRangeFilter = (fieldId, rangeValue) => {
        setFilters(prev => ({ ...prev, [fieldId]: rangeValue }));
    };

    const setDateFilter = (fieldId, dateValue) => {
        setFilters(prev => ({ ...prev, [fieldId]: dateValue }));
    };

    const clearFilters = () => {
        setFilters({ search: '' });
        setVisibleColumns(new Set(['event_title']));
    };

    // Check if any filter is active
    const hasActiveFilters = () => {
        return filterableFields.some(field => {
            const filterValue = filters[field.id];
            if (!filterValue) return false;

            switch (field.filterType) {
                case 'multiselect':
                    return filterValue.size > 0;
                case 'range':
                    return filterValue.min !== undefined || filterValue.max !== undefined;
                case 'date':
                    return filterValue.start || filterValue.end;
                default:
                    return false;
            }
        });
    };

    // Handle CSV export
    const handleExport = () => {
        // 1. Filter data
        const filtered = filterData(data, filters, definitions);
        // 2. Sort data
        const sorted = sortConfig.key ? sortData(filtered, sortConfig.key, sortConfig.direction) : filtered;
        // 3. Export
        exportToCsv(sorted, definitions, visibleColumns, columnOrder);
    };

    return (
        <div className="flex flex-col border-b bg-white shrink-0 relative z-30">
            {/* Top Row: Search & Filters */}
            <div className="min-h-12 flex flex-col md:flex-row items-stretch md:items-center px-2 sm:px-4 gap-2 sm:gap-3 border-b border-slate-100 py-2 md:py-0">
                {/* Mobile Menu Button & Search - Same Row on Mobile */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 hover:bg-slate-100 rounded text-slate-600 shrink-0"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="relative flex-1 md:w-80">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" />
                        <input
                            type="text"
                            placeholder="大会名、開催地..."
                            className="w-full pl-9 pr-3 py-1.5 border border-cyan-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-cyan-50/30"
                            value={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Dynamic Filters - Horizontal scroll on mobile */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    {filterableFields.map(field => {
                        const filterValue = filters[field.id];
                        const FilterIcon = getFilterIcon(field.id);

                        switch (field.filterType) {
                            case 'multiselect':
                                const options = getFilterOptions(field.id);
                                return (
                                    <MultiselectFilterDropdown
                                        key={field.id}
                                        icon={<FilterIcon size={14} className="text-orange-500" />}
                                        label={field.label}
                                        options={options}
                                        selected={filterValue || new Set()}
                                        onToggle={(value) => toggleMultiselectFilter(field.id, value)}
                                    />
                                );

                            case 'range':
                                return (
                                    <RangeFilter
                                        key={field.id}
                                        icon={<FilterIcon size={14} className="text-orange-500" />}
                                        label={field.label}
                                        value={filterValue || {}}
                                        onChange={(value) => setRangeFilter(field.id, value)}
                                    />
                                );

                            case 'date':
                                return (
                                    <DateFilter
                                        key={field.id}
                                        icon={<FilterIcon size={14} className="text-orange-500" />}
                                        label={field.label}
                                        value={filterValue || {}}
                                        onChange={(value) => setDateFilter(field.id, value)}
                                    />
                                );

                            default:
                                return null;
                        }
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
                    <button
                        onClick={handleExport}
                        title="CSVエクスポート"
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded transition-colors"
                    >
                        <Download size={14} />
                        <span className="sm:inline">エクスポート</span>
                    </button>
                    <button
                        onClick={clearFilters}
                        title="全クリア"
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors"
                    >
                        <Trash2 size={14} />
                        <span className="sm:inline">全クリア</span>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Active Filters & Presets */}
            <div className="min-h-10 flex flex-col md:flex-row items-start md:items-center px-2 sm:px-4 gap-2 bg-slate-50/50 py-2 md:py-0">
                {/* Active Filters Display */}
                {hasActiveFilters() && (
                    <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                        <span className="text-xs text-slate-500 font-medium shrink-0">フィルター:</span>
                        <div className="flex gap-1 flex-wrap">
                            {filterableFields.map(field => {
                                const filterValue = filters[field.id];
                                if (!filterValue) return null;

                                switch (field.filterType) {
                                    case 'multiselect':
                                        if (filterValue.size === 0) return null;
                                        const FilterIcon = getFilterIcon(field.id);
                                        return (
                                            <div key={field.id} className="flex items-center gap-1">
                                                <FilterIcon size={12} className="text-blue-500" />
                                                <div className="flex gap-1">
                                                    {Array.from(filterValue).sort().map(val => (
                                                        <span key={val} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                            {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    case 'range':
                                        if (!filterValue.min && !filterValue.max) return null;
                                        return (
                                            <div key={field.id} className="flex items-center gap-1">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                    {field.label}: {filterValue.min || '∞'} - {filterValue.max || '∞'}
                                                </span>
                                            </div>
                                        );
                                    case 'date':
                                        if (!filterValue.start && !filterValue.end) return null;
                                        return (
                                            <div key={field.id} className="flex items-center gap-1">
                                                <Calendar size={12} className="text-purple-500" />
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                                    {filterValue.start || '∞'} - {filterValue.end || '∞'}
                                                </span>
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>
                )}

                <div className="flex-1 hidden md:block" />

                {/* Presets - Horizontal scroll on mobile */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Target size={12} />
                        <span className="hidden sm:inline">分析セット:</span>
                    </span>
                    <div className="flex gap-2 shrink-0">
                        <PresetButton icon={<Sprout size={14} />} label="初心者" color="emerald" onClick={() => onPreset('beginner')} />
                        <PresetButton icon={<Waves size={14} />} label="Swim" color="blue" onClick={() => onPreset('swim')} />
                        <PresetButton icon={<Bike size={14} />} label="Bike" color="orange" onClick={() => onPreset('bike')} />
                        <PresetButton icon={<Footprints size={14} />} label="Run" color="emerald" onClick={() => onPreset('run')} />
                        <PresetButton icon={<Target size={14} />} label="P獲得" color="violet" onClick={() => onPreset('points')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const MultiselectFilterDropdown = ({ icon, label, options, selected, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "px-3 py-1.5 text-sm border rounded flex items-center gap-2 hover:bg-slate-50 transition-colors bg-white",
                    selected.size > 0 ? "border-cyan-500 text-cyan-700 bg-cyan-50" : "border-slate-200 text-slate-600"
                )}
            >
                {icon}
                <span className="font-medium">{selected.size > 0 ? `${selected.size} selected` : label}</span>
                <ChevronDown size={12} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-20 p-2 max-h-64 overflow-y-auto">
                    {options.map(opt => (
                        <label key={opt} className="flex items-center p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selected.has(String(opt))}
                                onChange={() => onToggle(opt)}
                                className="rounded text-cyan-600 focus:ring-cyan-500 mr-2"
                            />
                            <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const RangeFilter = ({ label, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasValue = value.min !== undefined || value.max !== undefined;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "px-3 py-1.5 text-sm border rounded flex items-center gap-2 hover:bg-slate-50 transition-colors bg-white",
                    hasValue ? "border-cyan-500 text-cyan-700 bg-cyan-50" : "border-slate-200 text-slate-600"
                )}
            >
                <Filter size={14} />
                <span className="font-medium">{hasValue ? `${label} *` : label}</span>
                <ChevronDown size={12} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border rounded-md shadow-lg z-20 p-3">
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-slate-600 block mb-1">最小値</label>
                            <input
                                type="number"
                                value={value.min || ''}
                                onChange={(e) => onChange({ ...value, min: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full px-2 py-1 border rounded text-sm"
                                placeholder="最小値"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600 block mb-1">最大値</label>
                            <input
                                type="number"
                                value={value.max || ''}
                                onChange={(e) => onChange({ ...value, max: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full px-2 py-1 border rounded text-sm"
                                placeholder="最大値"
                            />
                        </div>
                        <button
                            onClick={() => onChange({})}
                            className="w-full px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-600"
                        >
                            クリア
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DateFilter = ({ label, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasValue = value.start || value.end;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "px-3 py-1.5 text-sm border rounded flex items-center gap-2 hover:bg-slate-50 transition-colors bg-white",
                    hasValue ? "border-cyan-500 text-cyan-700 bg-cyan-50" : "border-slate-200 text-slate-600"
                )}
            >
                <Calendar size={14} />
                <span className="font-medium">{hasValue ? `${label} *` : label}</span>
                <ChevronDown size={12} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border rounded-md shadow-lg z-20 p-3">
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-slate-600 block mb-1">開始日</label>
                            <input
                                type="date"
                                value={value.start || ''}
                                onChange={(e) => onChange({ ...value, start: e.target.value })}
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600 block mb-1">終了日</label>
                            <input
                                type="date"
                                value={value.end || ''}
                                onChange={(e) => onChange({ ...value, end: e.target.value })}
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                        </div>
                        <button
                            onClick={() => onChange({})}
                            className="w-full px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-600"
                        >
                            クリア
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PresetButton = ({ icon, label, color, onClick }) => {
    const colors = {
        emerald: "text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100",
        blue: "text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100",
        orange: "text-orange-700 border-orange-200 bg-orange-50 hover:bg-orange-100",
        violet: "text-violet-700 border-violet-200 bg-violet-50 hover:bg-violet-100",
    };

    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium border rounded-full transition-colors whitespace-nowrap",
                colors[color] || colors.emerald
            )}>
            {icon}
            {label}
        </button>
    );
};
