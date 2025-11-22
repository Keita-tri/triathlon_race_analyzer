import { ChevronDown, ChevronUp, Info, Lightbulb, Calculator, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export const DetailPanel = ({ focusedMetric, definitions, onSolo }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const metric = definitions.find(d => d.id === focusedMetric);

    // If no metric is selected, show a placeholder
    if (!metric) {
        if (isCollapsed) {
            return (
                <div className="h-10 border-t bg-slate-50 flex items-center px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsCollapsed(false)}>
                    <div className="w-1 h-4 bg-slate-400 rounded-full" />
                    <span className="text-xs font-bold text-slate-500 ml-2">指標解説パネル</span>
                    <span className="text-xs text-slate-400 ml-2 hidden sm:inline">（カラムをクリックして詳細を表示）</span>
                    <button className="ml-auto text-slate-400 hover:text-slate-600">
                        <ChevronUp size={16} />
                    </button>
                </div>
            );
        }

        return (
            <div className="h-32 sm:h-40 md:h-[180px] border-t bg-white flex flex-col shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative">
                {/* Header Bar */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b">
                    <div className="w-1 h-4 bg-slate-400 rounded-full" />
                    <span className="text-xs font-bold text-slate-500">指標解説パネル</span>
                    <button onClick={() => setIsCollapsed(true)} className="ml-auto text-slate-400 hover:text-slate-600">
                        <ChevronDown size={16} />
                    </button>
                </div>

                {/* Placeholder Content */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <Info size={24} sm:size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs sm:text-sm text-slate-400">テーブルのカラムをクリックすると、</p>
                        <p className="text-xs sm:text-sm text-slate-400">その指標の詳細情報がここに表示されます。</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isCollapsed) {
        return (
            <div className="h-10 border-t bg-slate-50 flex items-center px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsCollapsed(false)}>
                <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                <span className="text-xs font-bold text-slate-500 ml-2">選択中の指標解説</span>
                <h3 className="text-sm font-bold text-slate-800 ml-2">{metric.label}</h3>
                <button className="ml-auto text-slate-400 hover:text-slate-600">
                    <ChevronUp size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="h-auto sm:h-40 md:h-[180px] border-t bg-white flex flex-col shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative">
            {/* Header Bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b">
                <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                <span className="text-xs font-bold text-slate-500 hidden sm:inline">選択中の指標解説</span>
                <h3 className="text-sm font-bold text-slate-800 sm:ml-2">{metric.label}</h3>
                <div className="ml-4 hidden md:flex items-center gap-2">
                    <button
                        onClick={() => onSolo(metric.id)}
                        className="px-2 py-0.5 bg-white border border-cyan-200 text-cyan-600 text-[10px] rounded hover:bg-cyan-50 transition-colors"
                    >
                        この指標だけ表示 (Solo)
                    </button>
                </div>
                <button onClick={() => setIsCollapsed(true)} className="ml-auto text-slate-400 hover:text-slate-600">
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* Content Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 overflow-y-auto">
                {/* Column 1: Description */}
                <div className="md:border-r border-slate-100 md:pr-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <MessageSquare size={12} /> 指標の説明
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        {metric.description || '説明がありません。'}
                    </p>
                </div>

                {/* Column 2: Judgment */}
                <div className="md:border-r border-slate-100 md:pr-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Lightbulb size={12} /> 判断基準
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        {metric.judgment || '判断基準がありません。'}
                    </p>
                </div>

                {/* Column 3: Rule & Calculation */}
                <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Calculator size={12} /> 算出ルール
                    </h4>
                    <div className="space-y-2">
                        <div>
                            <span className="text-[10px] text-slate-400">評価:</span>
                            <span className={`ml-2 text-xs font-bold ${metric.rule === 'Positive' ? 'text-emerald-600' :
                                metric.rule === 'Negative' ? 'text-red-600' : 'text-slate-600'
                                }`}>
                                {metric.rule === 'Positive' ? '高い方が良い' :
                                    metric.rule === 'Negative' ? '低い方が良い' : '場合による'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400">計算:</span>
                            <span className="ml-2 text-xs text-slate-600">{metric.calculation || 'N/A'}</span>
                        </div>
                        {metric.unit && (
                            <div>
                                <span className="text-[10px] text-slate-400">単位:</span>
                                <span className="ml-2 text-xs text-slate-600">{metric.unit}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
