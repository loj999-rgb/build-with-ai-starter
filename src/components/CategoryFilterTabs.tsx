import React from 'react';
import { MarketCategory, SubFilter } from '../types/market';
import { Sparkles, TrendingUp, TrendingDown, Flame, BarChart3, Globe } from 'lucide-react';

interface CategoryFilterTabsProps {
  category: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  subFilter: SubFilter;
  onSelectSubFilter: (subFilter: SubFilter) => void;
  totalCount: number;
}

export const CategoryFilterTabs: React.FC<CategoryFilterTabsProps> = ({
  category,
  onSelectCategory,
  subFilter,
  onSelectSubFilter,
  totalCount,
}) => {
  const categories: { id: MarketCategory; label: string }[] = [
    { id: 'all', label: 'All Markets' },
    { id: 'stocks', label: 'US Stocks' },
    { id: 'indices', label: 'World Indices' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
    { id: 'bonds', label: 'Bonds' },
  ];

  const subFilters: { id: SubFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All' },
    { id: 'most-active', label: 'Most Active', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'gainers', label: 'Top Gainers', icon: <TrendingUp className="w-3.5 h-3.5 text-[#089981]" /> },
    { id: 'losers', label: 'Top Losers', icon: <TrendingDown className="w-3.5 h-3.5 text-[#F23645]" /> },
    { id: 'high-volume', label: 'High Volume', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'all-time-high', label: 'Near 52W High', icon: <Sparkles className="w-3.5 h-3.5 text-[#2962FF]" /> },
  ];

  return (
    <div className="w-full space-y-3 mb-6">
      {/* Primary Category Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((c) => {
            const isActive = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#131722] text-white border-[#131722] shadow-xs'
                    : 'bg-white text-[#131722] border-[#E0E3EB] hover:bg-[#F0F3FA]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Global Market Region Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#787B86]">
          <Globe className="w-3.5 h-3.5 text-[#2962FF]" />
          <span>Showing <strong className="text-[#131722]">{totalCount}</strong> assets</span>
        </div>
      </div>

      {/* Sub-Filter Segmented Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {subFilters.map((sf) => {
          const isActive = subFilter === sf.id;
          return (
            <button
              key={sf.id}
              onClick={() => onSelectSubFilter(sf.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2962FF] text-white font-semibold shadow-xs'
                  : 'bg-white text-[#434656] border border-[#E0E3EB] hover:bg-[#F0F3FA]'
              }`}
            >
              {sf.icon}
              <span>{sf.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
