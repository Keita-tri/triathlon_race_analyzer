import { Waves, Bike, Footprints, Trophy, LayoutDashboard, Activity } from 'lucide-react';

export const iconMapping = {
    'スイム': Waves,
    'バイク': Bike,
    'ラン': Footprints,
    'ランク': Trophy,
    '基本': LayoutDashboard,
    '全体': Activity,
    // Fallbacks for English keys if needed
    'Swim': Waves,
    'Bike': Bike,
    'Run': Footprints,
    'Rank': Trophy
};

export const getCategoryIcon = (category) => {
    const Icon = iconMapping[category] || Activity;
    return Icon;
};

export const categoryOrder = [
    '基本',
    '全体',
    'Swim', 'スイム',
    'Bike', 'バイク',
    'Run', 'ラン',
    'Rank', 'ランク',
    'その他'
];
