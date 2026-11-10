import React from 'react';
import { Search, Flame, Bookmark, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { MarketCategory } from '../types/market';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  activeView: 'markets' | 'heatmap';
  setActiveView: (view: 'markets' | 'heatmap') => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  onOpenTradeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  activeView,
  setActiveView,
  isLiveStreaming,
  setIsLiveStreaming,
  selectedCategory,
  onSelectCategory,
  onOpenTradeModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E0E3EB]">
      {/* Top Banner Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveView('markets')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            {/* TradingView Icon: 2 vertical bars and 1 diagonal/slanted wave bar */}
            <div className="flex items-end gap-1 h-7">
              <span className="w-2 h-7 bg-[#2962FF] rounded-sm group-hover:bg-[#1E53E5] transition-colors" />
              <span className="w-2 h-5 bg-[#131722] rounded-sm" />
              <span className="w-2 h-3.5 bg-[#089981] rounded-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-[19px] font-extrabold tracking-tight text-[#131722] leading-none">
                TradingView
              </span>
              <span className="text-[10px] font-bold text-[#787B86] uppercase tracking-wider mt-0.5">
                Markets Hub
              </span>
            </div>
          </div>

          {/* View Mode Switcher: Markets vs Heatmap */}
          <nav className="hidden md:flex items-center bg-[#F0F3FA] p-1 rounded-full border border-[#E0E3EB]">
            <button
              onClick={() => setActiveView('markets')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'markets'
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'text-[#131722] hover:text-[#2962FF]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Markets Overview
            </button>
            <button
              onClick={() => setActiveView('heatmap')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'heatmap'
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'text-[#131722] hover:text-[#2962FF]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#F23645]" />
              S&P 500 Heatmap
            </button>
          </nav>
        </div>

        {/* Global Search Bar (⌘K trigger) */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-[#F0F3FA] hover:bg-[#E5E7F7] border border-transparent hover:border-[#2962FF]/30 rounded-full text-xs text-[#787B86] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#131722] group-hover:text-[#2962FF] transition-colors" />
              <span className="text-[#131722] font-medium">Search markets, stocks, crypto...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-white px-2 py-0.5 rounded border border-[#E0E3EB] text-[#787B86]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Actions & Live Streaming Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-full text-[#131722] hover:bg-[#F0F3FA] transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Real-time live status & simulation toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              isLiveStreaming
                ? 'bg-[#E8F5F1] text-[#089981] border-[#089981]/40 shadow-xs'
                : 'bg-white text-[#787B86] border-[#E0E3EB] hover:bg-[#F0F3FA]'
            }`}
            title={isLiveStreaming ? 'Live price ticks active' : 'Click to enable real-time price streaming'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveStreaming ? 'bg-[#089981] animate-ping' : 'bg-[#787B86]'
              }`}
            />
            <span className="hidden sm:inline">
              {isLiveStreaming ? 'Live Streaming' : 'Stream Paused'}
            </span>
            <Activity className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {/* Watchlist Trigger */}
          <button
            onClick={onOpenWatchlist}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-[#E0E3EB] bg-white hover:bg-[#F0F3FA] text-[#131722] transition-colors relative"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#2962FF]" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-[#2962FF] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Primary CTA "Get started" or "Quick Order" */}
          <button
            onClick={onOpenTradeModal}
            className="px-4 py-2 bg-[#131722] hover:bg-[#2c303c] active:scale-98 text-white text-xs font-bold rounded-full transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#84f7db]" />
            <span>Get started</span>
          </button>
        </div>
      </div>

      {/* Sub-Header Horizontal Category Tabs */}
      <div className="border-t border-[#F0F3FA] bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center overflow-x-auto no-scrollbar gap-1 py-1.5">
          {[
            { id: 'all', label: 'All Markets' },
            { id: 'indices', label: 'Indices' },
            { id: 'stocks', label: 'US Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'forex', label: 'Forex' },
            { id: 'futures', label: 'Futures & Commodities' },
            { id: 'bonds', label: 'Bonds' },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView('markets');
                  onSelectCategory(tab.id as MarketCategory);
                }}
                className={`px-3.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#131722] text-white'
                    : 'text-[#434656] hover:text-[#131722] hover:bg-[#F0F3FA]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
