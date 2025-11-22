import { Sidebar } from '../Sidebar/Sidebar';
import { DataTable } from '../DataTable/DataTable';
import { Toolbar } from '../Toolbar/Toolbar';
import { DetailPanel } from '../DetailPanel/DetailPanel';
import { useState } from 'react';

export const MainLayout = ({
    data, definitions,
    visibleColumns, setVisibleColumns,
    columnOrder, setColumnOrder,
    sortConfig, setSortConfig,
    filters, setFilters,
    focusedMetric, setFocusedMetric,
    onSolo, onPreset, onShowAll, onToggle, onMoveColumn
}) => {
    const [isDetailOpen, setIsDetailOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Hidden on mobile, overlay on tablet, always visible on desktop */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-10
                transform transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar
                    definitions={definitions}
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                    onSolo={onSolo}
                    onMetricFocus={setFocusedMetric}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
            </div>

            <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
                <Toolbar
                    data={data}
                    filters={filters}
                    setFilters={setFilters}
                    setVisibleColumns={setVisibleColumns}
                    definitions={definitions}
                    onPreset={onPreset}
                    sortConfig={sortConfig}
                    columnOrder={columnOrder}
                    visibleColumns={visibleColumns}
                    onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                />

                <div className="flex-1 overflow-auto relative">
                    <DataTable
                        data={data}
                        definitions={definitions}
                        visibleColumns={visibleColumns}
                        columnOrder={columnOrder}
                        setColumnOrder={setColumnOrder}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        onMoveColumn={onMoveColumn}
                        onMetricFocus={setFocusedMetric}
                        onToggle={onToggle}
                        filters={filters}
                    />
                </div>

                {focusedMetric && (
                    <DetailPanel
                        focusedMetric={focusedMetric}
                        definitions={definitions}
                        onSolo={onSolo}
                    />
                )}
                {!focusedMetric && (
                    <DetailPanel
                        focusedMetric={null}
                        definitions={definitions}
                        onSolo={onSolo}
                    />
                )}
            </main>
        </div>
    );
};
