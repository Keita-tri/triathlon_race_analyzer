import { ArrowUp, ArrowDown, GripVertical, Trash2 } from 'lucide-react';
import { useRef } from 'react';

export const TableHead = ({ columns, sortConfig, onSort, onMoveColumn, onMetricFocus, onToggle }) => {
    return (
        <thead className="bg-slate-800 text-white sticky top-0 z-20 shadow-md">
            <tr>
                {/* Row Number / Rank Column */}
                <th className="sticky left-0 z-30 bg-slate-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] p-0 border-r border-slate-700" style={{ minWidth: '50px', width: '50px' }}>
                    <div className="flex flex-col h-full px-1.5 py-2">
                        <span className="text-xs font-bold text-center">#</span>
                        <span className="text-[10px] font-normal text-slate-400 text-center">順位</span>
                    </div>
                </th>

                {columns.map((col, index) => (
                    <DraggableHeader
                        key={col.id}
                        col={col}
                        index={index}
                        sortConfig={sortConfig}
                        onSort={onSort}
                        onMoveColumn={onMoveColumn}
                        onMetricFocus={onMetricFocus}
                        onToggle={onToggle}
                        isFirst={index === 0}
                        isDraggable={col.id !== 'event_title'}
                    />
                ))}
            </tr>
        </thead>
    );
};

const DraggableHeader = ({ col, index, sortConfig, onSort, onMoveColumn, onMetricFocus, onToggle, isDraggable }) => {
    const isSticky = col.id === 'event_title';
    const ref = useRef(null);

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (dragIndex !== index) {
            onMoveColumn(dragIndex, index);
        }
    };

    return (
        <th
            ref={ref}
            draggable={isDraggable}
            onDragStart={isDraggable ? handleDragStart : undefined}
            onDragOver={isDraggable ? handleDragOver : undefined}
            onDrop={isDraggable ? handleDrop : undefined}
            className={`
        p-0 border-r border-slate-700 select-none group
        ${isSticky ? 'sticky left-[50px] z-30 bg-slate-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]' : 'bg-slate-800'}
      `}
            style={{ minWidth: isSticky ? '220px' : '140px' }}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-1 p-2 h-full relative">
                    {isDraggable && (
                        <span className="cursor-grab text-slate-600 hover:text-slate-400" title="Drag to reorder">
                            <GripVertical size={12} />
                        </span>
                    )}

                    <div
                        className="flex-1 flex flex-col justify-center cursor-pointer hover:text-cyan-400"
                        onClick={() => {
                            onSort(col.id);
                            if (onMetricFocus) onMetricFocus(col.id);
                        }}
                    >
                        <span className="text-xs font-bold truncate leading-tight">{col.label}</span>
                        <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[10px] font-normal text-slate-400 truncate">{col.category}</span>
                            {sortConfig.key === col.id && (
                                sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-cyan-400" /> : <ArrowDown size={12} className="text-cyan-400" />
                            )}
                        </div>
                    </div>

                    {/* Trash Icon (Hidden by default, visible on hover) */}
                    {!isSticky && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle(col.id);
                            }}
                            className="absolute top-1 right-1 p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove column"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
                {/* Border bottom accent */}
                <div className={`h-0.5 w-full ${sortConfig.key === col.id ? 'bg-cyan-500' : 'bg-transparent'}`} />
            </div>
        </th>
    );
};
