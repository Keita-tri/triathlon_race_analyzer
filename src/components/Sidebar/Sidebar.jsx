import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, HelpCircle, ChevronLeft, Activity, Eye, X } from 'lucide-react';
import clsx from 'clsx';
import { Tooltip } from '../Common/Tooltip';
import { getCategoryIcon, categoryOrder } from '../../config/iconMapping';

const CategoryIcon = ({ category }) => {
    const Icon = getCategoryIcon(category);
    return <Icon size={14} className={clsx(
        category === 'スイム' || category === 'Swim' ? "text-blue-500" :
            category === 'バイク' || category === 'Bike' ? "text-orange-500" :
                category === 'ラン' || category === 'Run' ? "text-emerald-500" :
                    category === 'ランク' || category === 'Rank' ? "text-violet-500" :
                        category === '基本' ? "text-slate-500" :
                            "text-slate-400"
    )} />;
};

export const Sidebar = ({ definitions, visibleColumns, setVisibleColumns, onSolo, onMetricFocus, onMobileClose }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const categories = useMemo(() => {
        const cats = {};
        definitions.forEach(def => {
            if (!cats[def.category]) cats[def.category] = [];
            cats[def.category].push(def);
        });

        const sortedEntries = Object.entries(cats).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a[0]);
            const indexB = categoryOrder.indexOf(b[0]);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a[0].localeCompare(b[0]);
        });
        return sortedEntries;
    }, [definitions]);

    const toggleColumn = (id) => {
        const newSet = new Set(visibleColumns);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setVisibleColumns(newSet);
    };

    return (
        <aside className={clsx(
            "bg-white border-r flex flex-col h-full overflow-hidden shrink-0 z-10 transition-all duration-300",
            isCollapsed ? "w-[50px]" : "w-[260px]"
        )}>
            <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
                {!isCollapsed && (
                    <>
                        <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2 truncate">
                            <Activity size={16} className="text-cyan-600" />
                            表示項目の選択
                        </h2>
                        {/* Mobile close button */}
                        <button
                            onClick={() => {
                                onMobileClose();
                                setIsCollapsed(false); // Reset collapse state when closing mobile menu
                            }}
                            className="lg:hidden p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                            <X size={16} />
                        </button>
                    </>
                )}
                {/* Desktop collapse button - hidden on mobile */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block p-1 hover:bg-slate-200 rounded text-slate-500 ml-auto"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {!isCollapsed && (
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] text-slate-500 leading-tight">
                        チェックで追加。<span className="inline-block border border-slate-300 rounded px-1">DnD</span> で並替。<br />
                        <Eye size={10} className="inline mx-0.5" />でその列だけ表示。<HelpCircle size={10} className="inline mx-0.5" />でヒント。
                    </p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {categories.map(([catName, items]) => (
                    <CategoryGroup
                        key={catName}
                        name={catName}
                        items={items}
                        visibleColumns={visibleColumns}
                        onToggle={toggleColumn}
                        isCollapsed={isCollapsed}
                        onExpand={() => setIsCollapsed(false)}
                        onSolo={onSolo}
                        onMetricFocus={onMetricFocus}
                    />
                ))}
            </div>
        </aside>
    );
};

const CategoryGroup = ({ name, items, visibleColumns, onToggle, isCollapsed, onExpand, onSolo, onMetricFocus }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (isCollapsed) {
        return (
            <div
                className="flex justify-center py-2 border-b border-slate-100 group relative cursor-pointer hover:bg-slate-50"
                onClick={() => {
                    onExpand();
                    setIsOpen(true);
                }}
            >
                <CategoryIcon category={name} />
                {/* Tooltip for collapsed category */}
                <div className="absolute left-full top-2 ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {name}
                </div>
            </div>
        );
    }

    return (
        <div className="border-b border-slate-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 p-2 hover:bg-slate-50 transition-colors text-left"
            >
                {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                <CategoryIcon category={name} />
                <span className="text-xs font-bold text-slate-700">{name}</span>
            </button>

            {isOpen && (
                <div className="p-1 space-y-0.5">
                    {items.filter(item => item.id !== 'event_title').map(item => (
                        <div
                            key={item.id}
                            className="flex items-center w-full px-2 py-1.5 rounded hover:bg-slate-50 group transition-colors"
                        >
                            <label
                                className="flex items-center flex-1 cursor-pointer min-w-0"
                                onClick={(e) => {
                                    // Always focus on the metric when clicking anywhere on the label
                                    if (onMetricFocus) {
                                        onMetricFocus(item.id);
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.has(item.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        onToggle(item.id);
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-0 focus:ring-2 cursor-pointer"
                                />
                                <span className={clsx(
                                    "text-xs ml-2.5 truncate transition-colors",
                                    visibleColumns.has(item.id) ? "text-slate-700 font-medium" : "text-slate-600"
                                )}>{item.label}</span>
                            </label>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSolo(item.id);
                                    }}
                                    className="p-1 text-slate-400 hover:text-cyan-600 transition-colors"
                                    title="Solo View"
                                >
                                    <Eye size={13} />
                                </button>
                                <Tooltip
                                    title={item.label}
                                    description={item.description}
                                    rule={item.rule}
                                    judgment={item.judgment}
                                >
                                    <HelpCircle size={15} className="text-slate-400 hover:text-cyan-600 cursor-help transition-colors" />
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
