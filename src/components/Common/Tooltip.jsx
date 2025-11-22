import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

export const Tooltip = ({ title, description, rule, judgment, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position tooltip to the right of the trigger, centered vertically
            setCoords({
                top: rect.top + rect.height / 2,
                left: rect.right + 10 // 10px offset
            });
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    const RuleIcon = () => {
        if (rule === 'Positive') return <TrendingUp size={14} className="text-emerald-400" />;
        if (rule === 'Negative') return <TrendingDown size={14} className="text-red-400" />;
        return <Info size={14} className="text-slate-400" />;
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-flex items-center"
            >
                {children}
            </div>
            {isVisible && createPortal(
                <div
                    className="fixed z-50 bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 w-72 pointer-events-none"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-700 pb-2">
                        <div className="flex items-center gap-2">
                            <HelpCircle size={16} className="text-cyan-400" />
                            <h4 className="font-bold text-sm text-cyan-400">{title}</h4>
                        </div>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${rule === 'Positive' ? 'bg-emerald-900/30 border border-emerald-800' :
                                rule === 'Negative' ? 'bg-red-900/30 border border-red-800' :
                                    'bg-slate-800 border border-slate-700'
                            }`}>
                            <RuleIcon />
                        </div>
                    </div>
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                        {description || 'No description available.'}
                    </p>
                    {judgment && (
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">
                            <p className="text-xs text-slate-300 leading-relaxed">
                                {judgment}
                            </p>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};
