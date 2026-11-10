import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight, CornerDownLeft } from 'lucide-react';
import { TickerItem, MarketCategory } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickers: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tickers,
  onSelectTicker,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setCategoryFilter('all');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredTickers = tickers.filter((t) => {
    const matchesQuery =
      t.symbol.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.exchange.toLowerCase().includes(query.toLowerCase()) ||
      (t.sector && t.sector.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' || t.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  const popularTickers = tickers.filter((t) =>
    ['NVDA', 'BTCUSD', 'TSLA', 'SPX', 'AAPL', 'GOLD'].includes(t.symbol)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#2962FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company name, or asset (e.g. NVDA, Bitcoin, S&P 500)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#131722] placeholder-[#787B86] focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#787B86] hover:bg-[#F0F3FA] text-xs font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#787B86] hover:bg-[#F0F3FA] hover:text-[#131722]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-[#F0F3FA] flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#FAF8FF]">
          {['all', 'stocks', 'indices', 'crypto', 'forex', 'futures', 'bonds'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#131722] text-white'
                  : 'bg-white text-[#434656] border border-[#E0E3EB] hover:bg-[#F0F3FA]'
              }`}
            >
              {cat === 'all' ? 'All Assets' : cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[380px] overflow-y-auto tv-scrollbar p-2 divide-y divide-[#F0F3FA]">
          {query.trim() === '' && (
            <div className="p-3 text-[11px] font-bold text-[#787B86] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2962FF]" />
              <span>Trending & Popular Assets</span>
            </div>
          )}

          {(query.trim() === '' ? popularTickers : filteredTickers).length === 0 ? (
            <div className="py-12 text-center text-[#787B86]">
              <p className="text-sm font-semibold text-[#131722]">No markets found</p>
              <p className="text-xs mt-1">Try searching for NVDA, BTC, Apple, or S&P 500</p>
            </div>
          ) : (
            (query.trim() === '' ? popularTickers : filteredTickers).map((ticker) => {
              const isBullish = ticker.change >= 0;
              return (
                <div
                  key={ticker.id}
                  onClick={() => {
                    onSelectTicker(ticker);
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-[#F0F3FA] transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      style={{
                        backgroundColor: ticker.badgeBg || '#131722',
                        color: ticker.badgeTextColor || '#FFFFFF',
                      }}
                      className="w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      {ticker.badgeText || ticker.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#131722] group-hover:text-[#2962FF] transition-colors">
                          {ticker.symbol}
                        </span>
                        <span className="text-[10px] font-semibold text-[#787B86] px-1.5 py-0.2 rounded bg-[#E0E3EB]/50">
                          {ticker.exchange}
                        </span>
                        <span className="text-[10px] text-[#787B86] capitalize">
                          {ticker.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate">
                        {ticker.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] tabular-nums">
                        ${ticker.price >= 1000 ? ticker.price.toLocaleString() : ticker.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-bold tabular-nums flex items-center justify-end ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBullish ? (
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                        )}
                        {isBullish ? '+' : ''}
                        {ticker.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-[#C3C5D8] group-hover:text-[#2962FF] transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#FAF8FF] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#787B86]">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E0E3EB] text-[10px]">↑</kbd> <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E0E3EB] text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E0E3EB] text-[10px]">Enter</kbd></span>
          </div>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
