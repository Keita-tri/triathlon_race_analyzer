import { calculateHeatmapColor, getMinMaxValues } from '../../utils/analytics';
import { formatValue as formatDisplayValue } from '../../utils/displayFormatters';
import { useMemo } from 'react';
import { LayoutDashboard } from 'lucide-react';

export const TableBody = ({ data, columns, onMetricFocus }) => {
    // Pre-calculate min/max for each column for heatmap
    const columnStats = useMemo(() => {
        const stats = {};
        columns.forEach(col => {
            if (col.rule !== 'Depends') {
                stats[col.id] = getMinMaxValues(data, col.id);
            }
        });
        return stats;
    }, [data, columns]);

    // Helper to create event slug
    const createEventSlug = (eventTitle) => {
        return eventTitle.toLowerCase().replace(/\s+/g, '-');
    };

    return (
        <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-cyan-50/50 transition-colors odd:bg-white even:bg-slate-50/50">
                    {/* Row Number / Rank Column */}
                    <td className="sticky left-0 z-10 bg-white border-b border-r border-slate-200 px-1.5 py-2 text-xs font-mono text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]" style={{ minWidth: '50px', width: '50px' }}>
                        <div className="flex flex-col">
                            <span className="text-slate-400">{rowIndex + 1}</span>
                            {row.rank && <span className="text-cyan-600 font-bold text-[10px]">#{row.rank}</span>}
                        </div>
                    </td>

                    {columns.map((col, colIndex) => {
                        const value = row[col.id];
                        const stats = columnStats[col.id];
                        const bgColor = stats ? calculateHeatmapColor(value, stats.min, stats.max, col.rule) : null;

                        const isSticky = col.id === 'event_title';

                        // For event_title, render with links
                        if (isSticky && value) {
                            const eventSlug = createEventSlug(value);
                            const worldTriathlonUrl = `https://triathlon.org/events/${eventSlug}/results/${row.prog_id}`;
                            const dashboardUrl = `https://trianalytics.grafana.net/d/fe7aqju2lm1vke/race-explore?orgId=1&from=now-6h&to=now&timezone=browser&var-event_id=${row.event_id}&var-program_id=${row.prog_id}`;

                            return (
                                <td
                                    key={col.id}
                                    className="sticky left-[50px] z-10 bg-white font-bold text-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] px-3 py-2 border-b border-r border-slate-100 text-xs"
                                    style={{
                                        minWidth: '220px',
                                        whiteSpace: 'normal',
                                        lineHeight: '1.3'
                                    }}
                                    onClick={() => onMetricFocus(col.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={worldTriathlonUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-cyan-600 hover:text-cyan-800 hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {value}
                                        </a>
                                        <a
                                            href={dashboardUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-cyan-600 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                            title="Open Dashboard"
                                        >
                                            <LayoutDashboard size={14} />
                                        </a>
                                    </div>
                                </td>
                            );
                        }

                        // Use displayType if available, otherwise fallback to legacy 'format' or 'unit'
                        const displayType = col.displayType || (col.unit === 'Flag' ? 'flag' : 'text');
                        const formatted = formatDisplayValue(value, displayType);

                        return (
                            <td
                                key={col.id}
                                className={`
                  px-3 py-2 border-b border-r border-slate-100 text-xs
                  ${isSticky ? 'sticky left-[50px] z-10 bg-white font-bold text-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]' : 'text-slate-600'}
                `}
                                style={{
                                    backgroundColor: isSticky ? undefined : (bgColor || undefined),
                                    color: bgColor ? '#0e7490' : undefined,
                                    minWidth: isSticky ? '220px' : undefined,
                                    whiteSpace: isSticky ? 'normal' : 'nowrap',
                                    lineHeight: isSticky ? '1.3' : undefined
                                }}
                                onClick={() => onMetricFocus(col.id)}
                            >
                                {formatted.type === 'icon' ? (
                                    <div className="flex justify-center">
                                        <formatted.icon size={formatted.size} className={formatted.className} />
                                    </div>
                                ) : (
                                    <>
                                        {formatted.value}
                                        {!isSticky && col.unit && value !== null && value !== undefined && displayType !== 'flag' && (
                                            <span className="ml-1 text-[10px] text-slate-400 font-normal">{col.unit}</span>
                                        )}
                                    </>
                                )}
                            </td>
                        );
                    })}
                </tr>
            ))}
        </tbody>
    );
};
