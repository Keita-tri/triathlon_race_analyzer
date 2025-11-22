import { BarChart3, Check } from 'lucide-react';

export const Header = ({ dataCount }) => {
    return (
        <header className="h-[50px] bg-slate-900 flex items-center px-2 sm:px-4 shrink-0 z-20 justify-between text-white shadow-md">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="bg-cyan-500 p-1 rounded shrink-0">
                    <BarChart3 size={18} sm:size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-sm sm:text-lg font-bold leading-none tracking-tight truncate">
                        <span className="hidden sm:inline">Triathlon Race Analyzer</span>
                        <span className="sm:hidden">Race Analyzer</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 leading-none mt-0.5 hidden sm:block">レース選定・傾向分析ツール</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Check size={14} className="text-emerald-400" />
                    <span className="hidden sm:inline">データ読み込み完了: {dataCount}件</span>
                    <span className="sm:hidden">{dataCount}件</span>
                </div>
            </div>
        </header>
    );
};
