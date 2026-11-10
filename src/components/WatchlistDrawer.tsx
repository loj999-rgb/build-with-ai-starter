import React, { useState } from 'react';
import { X, Trash2, ArrowUpRight, ArrowDownRight, Bell, Plus, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { TickerItem } from '../types/market';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistIds: string[];
  allTickers: TickerItem[];
  onRemoveFromWatchlist: (tickerId: string) => void;
  onSelectTicker: (ticker: TickerItem) => void;
  onOpenSearch: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistIds,
  allTickers,
  onRemoveFromWatchlist,
  onSelectTicker,
  onOpenSearch,
}) => {
  const [alertSymbol, setAlertSymbol] = useState<string | null>(null);
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const watchedTickers = allTickers.filter((t) => watchlistIds.includes(t.id));

  // Compute average delta of watchlist
  const avgDelta = watchedTickers.length > 0
    ? watchedTickers.reduce((acc, curr) => acc + curr.changePercent, 0) / watchedTickers.length
    : 0;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertSymbol || !alertPrice) return;
    setAlertSuccess(`Alert set for ${alertSymbol} at $${alertPrice}`);
    setTimeout(() => {
      setAlertSuccess(null);
      setAlertSymbol(null);
      setAlertPrice('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E0E3EB]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#131722]">Personal Watchlist</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2962FF]/10 text-[#2962FF]">
              {watchedTickers.length} {watchedTickers.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#787B86] hover:bg-[#F0F3FA] hover:text-[#131722] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watchlist Summary Bar */}
        <div className="bg-[#FAF8FF] px-4 py-3 border-b border-[#E0E3EB] flex items-center justify-between text-xs">
          <span className="text-[#787B86]">Basket 24h Average:</span>
          <span
            className={`font-bold tabular-nums px-2 py-0.5 rounded ${
              avgDelta >= 0
                ? 'text-[#089981] bg-[#E8F5F1]'
                : 'text-[#F23645] bg-[#FDECEE]'
            }`}
          >
            {avgDelta >= 0 ? '+' : ''}
            {avgDelta.toFixed(2)}%
          </span>
        </div>

        {/* Alert Notification Toast */}
        {alertSuccess && (
          <div className="mx-4 mt-3 p-3 bg-[#E8F5F1] border border-[#089981]/30 rounded-xl flex items-center gap-2 text-xs text-[#089981] font-semibold">
            <Check className="w-4 h-4 shrink-0" />
            <span>{alertSuccess}</span>
          </div>
        )}

        {/* Price Alert Form Popup */}
        {alertSymbol && !alertSuccess && (
          <div className="mx-4 mt-3 p-3.5 bg-[#F0F3FA] rounded-xl border border-[#E0E3EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#131722]">Set Price Alert for {alertSymbol}</span>
              <button
                onClick={() => setAlertSymbol(null)}
                className="text-[11px] text-[#787B86] hover:text-[#131722]"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleCreateAlert} className="flex gap-2">
              <input
                type="number"
                step="any"
                placeholder="Target Price..."
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                className="flex-1 bg-white border border-[#E0E3EB] rounded-lg px-2.5 py-1 text-xs focus:outline-[#2962FF]"
                required
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#2962FF] text-white text-xs font-bold rounded-lg hover:bg-[#1E53E5]"
              >
                Set
              </button>
            </form>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto tv-scrollbar p-3 space-y-2">
          {watchedTickers.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#787B86]">
              <div className="w-12 h-12 rounded-full bg-[#F0F3FA] flex items-center justify-center text-[#787B86] mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#131722]">Your watchlist is empty</p>
              <p className="text-xs text-[#787B86] mt-1 mb-4">
                Star any asset on the overview board or click below to search.
              </p>
              <button
                onClick={onOpenSearch}
                className="px-4 py-2 bg-[#131722] text-white text-xs font-bold rounded-full hover:bg-[#2c303c] transition-colors"
              >
                Browse Markets
              </button>
            </div>
          ) : (
            watchedTickers.map((ticker) => {
              const isBullish = ticker.change >= 0;

              return (
                <div
                  key={ticker.id}
                  onClick={() => {
                    onSelectTicker(ticker);
                    onClose();
                  }}
                  className="p-3 bg-white hover:bg-[#F0F3FA] rounded-xl border border-[#E0E3EB] transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      style={{
                        backgroundColor: ticker.badgeBg || '#131722',
                        color: ticker.badgeTextColor || '#FFFFFF',
                      }}
                      className="w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0"
                    >
                      {ticker.badgeText || ticker.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors">
                        {ticker.symbol}
                      </div>
                      <div className="text-[11px] text-[#787B86] truncate max-w-[120px]">
                        {ticker.name}
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#131722] tabular-nums">
                        ${ticker.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-[10px] font-bold tabular-nums flex items-center justify-end ${
                          isBullish ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isBullish ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {isBullish ? '+' : ''}
                        {ticker.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* Alert trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlertSymbol(ticker.symbol);
                        setAlertPrice(ticker.price.toFixed(2));
                      }}
                      className="p-1.5 rounded hover:bg-[#E0E3EB] text-[#787B86] hover:text-[#2962FF] transition-colors"
                      title="Set Alert"
                    >
                      <Bell className="w-4 h-4" />
                    </button>

                    {/* Remove trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(ticker.id);
                      }}
                      className="p-1.5 rounded hover:bg-[#FDECEE] text-[#787B86] hover:text-[#F23645] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E0E3EB] bg-[#FAF8FF]">
          <button
            onClick={onOpenSearch}
            className="w-full py-2.5 bg-white border border-[#E0E3EB] hover:border-[#2962FF] text-[#131722] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#2962FF]" />
            <span>Add More Symbols</span>
          </button>
        </div>
      </div>
    </div>
  );
};
