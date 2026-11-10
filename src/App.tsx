import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarketsCarousel } from './components/MarketsCarousel';
import { CategoryFilterTabs } from './components/CategoryFilterTabs';
import { MarketTable } from './components/MarketTable';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { HeatmapView } from './components/HeatmapView';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchModal } from './components/SearchModal';
import { TradeOrderModal } from './components/TradeOrderModal';
import { INITIAL_TICKERS } from './data/marketData';
import { TickerItem, MarketCategory, SubFilter } from './types/market';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Globe, Shield, RefreshCw } from 'lucide-react';

export default function App() {
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);
  const [watchlist, setWatchlist] = useState<string[]>(['nvda', 'btcusd', 'spx', 'tsla']);
  const [activeView, setActiveView] = useState<'markets' | 'heatmap'>('markets');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('all');
  const [subFilter, setSubFilter] = useState<SubFilter>('all');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [flashingTickerIds, setFlashingTickerIds] = useState<Record<string, 'up' | 'down'>>({});

  // Modals state
  const [selectedTickerForChart, setSelectedTickerForChart] = useState<TickerItem | null>(null);
  const [tradeModalTicker, setTradeModalTicker] = useState<TickerItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);

  // Global Keyboard Shortcut ⌘K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market data streaming simulator
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Pick 1 to 3 random tickers to simulate realistic market ticks
      setTickers((prevTickers) => {
        const updated = [...prevTickers];
        const numToUpdate = Math.floor(Math.random() * 2) + 1;
        const newFlashes: Record<string, 'up' | 'down'> = {};

        for (let i = 0; i < numToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const current = updated[randomIndex];

          const volatility = current.category === 'crypto' ? 0.003 : 0.001;
          const direction = Math.random() > 0.47 ? 1 : -1;
          const deltaPrice = direction * current.price * (Math.random() * volatility);
          const newPrice = Number((current.price + deltaPrice).toFixed(current.price < 2 ? 4 : 2));
          const newChange = Number((current.change + deltaPrice).toFixed(current.price < 2 ? 4 : 2));
          const newChangePercent = Number(((newChange / (current.prevClose || 1)) * 100).toFixed(2));
          const newHigh = Math.max(current.high, newPrice);
          const newLow = Math.min(current.low, newPrice);

          const newSparkline = [...current.sparkline.slice(1), newPrice];

          // Update candle close for latest candle
          const updatedHistory = [...current.history];
          if (updatedHistory.length > 0) {
            const lastCandle = { ...updatedHistory[updatedHistory.length - 1] };
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            updatedHistory[updatedHistory.length - 1] = lastCandle;
          }

          updated[randomIndex] = {
            ...current,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high: newHigh,
            low: newLow,
            sparkline: newSparkline,
            history: updatedHistory,
          };

          newFlashes[current.id] = direction > 0 ? 'up' : 'down';
        }

        setFlashingTickerIds((prev) => ({ ...prev, ...newFlashes }));

        // Clear flashes after 900ms
        setTimeout(() => {
          setFlashingTickerIds((prev) => {
            const cleared = { ...prev };
            Object.keys(newFlashes).forEach((id) => delete cleared[id]);
            return cleared;
          });
        }, 900);

        return updated;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Sync selectedTickerForChart when underlying ticker data updates
  useEffect(() => {
    if (selectedTickerForChart) {
      const refreshed = tickers.find((t) => t.id === selectedTickerForChart.id);
      if (refreshed) {
        setSelectedTickerForChart(refreshed);
      }
    }
  }, [tickers]);

  const toggleWatchlist = (tickerId: string) => {
    setWatchlist((prev) =>
      prev.includes(tickerId) ? prev.filter((id) => id !== tickerId) : [...prev, tickerId]
    );
  };

  // Filtered tickers
  const filteredTickers = tickers.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) {
      return false;
    }
    if (subFilter === 'gainers' && t.changePercent <= 0) return false;
    if (subFilter === 'losers' && t.changePercent >= 0) return false;
    if (subFilter === 'all-time-high' && t.price < t.week52High * 0.96) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F0F3FA] flex flex-col text-[#131722] selection:bg-[#2962FF] selection:text-white">
      {/* Top Navigation */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        activeView={activeView}
        setActiveView={setActiveView}
        isLiveStreaming={isLiveStreaming}
        setIsLiveStreaming={setIsLiveStreaming}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenTradeModal={() => setTradeModalTicker(tickers[0])}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeView === 'markets' ? (
          <>
            {/* World Indices and Benchmarks Carousel */}
            <MarketsCarousel
              tickers={tickers}
              onSelectTicker={(t) => setSelectedTickerForChart(t)}
              selectedTickerId={selectedTickerForChart?.id}
              flashingTickerIds={flashingTickerIds}
            />

            {/* Category Filter Pills & Sub-Filters */}
            <CategoryFilterTabs
              category={selectedCategory}
              onSelectCategory={setSelectedCategory}
              subFilter={subFilter}
              onSelectSubFilter={setSubFilter}
              totalCount={filteredTickers.length}
            />

            {/* High-Density Market Data Table */}
            <MarketTable
              tickers={filteredTickers}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              onSelectTicker={(t) => setSelectedTickerForChart(t)}
              flashingTickerIds={flashingTickerIds}
            />
          </>
        ) : (
          /* S&P 500 Market Cap Treemap Heatmap */
          <HeatmapView
            onSelectTickerBySymbol={(symbol) => {
              const matched = tickers.find((t) => t.symbol === symbol);
              if (matched) {
                setSelectedTickerForChart(matched);
              }
            }}
          />
        )}
      </main>

      {/* Bottom Sticky Marquee Ticker Tape */}
      <div className="sticky bottom-0 z-30 bg-[#131722] text-white py-2 px-4 border-t border-[#2c303c] overflow-hidden select-none">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-[#B2B5BE]">
              Live Markets
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {tickers.slice(0, 9).map((t) => {
              const isUp = t.change >= 0;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTickerForChart(t)}
                  className="flex items-center gap-1.5 shrink-0 hover:text-[#2962FF] cursor-pointer transition-colors"
                >
                  <span className="font-bold text-[11px]">{t.symbol}</span>
                  <span className="tabular-nums font-semibold text-[11px]">
                    ${t.price >= 1000 ? t.price.toLocaleString() : t.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-[10px] font-bold tabular-nums flex items-center ${
                      isUp ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {t.changePercent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 ml-4 text-[11px] text-[#B2B5BE]">
            <span>Press <kbd className="bg-[#2c303c] px-1 py-0.5 rounded text-[10px] font-mono text-white">⌘K</kbd> to search</span>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      {selectedTickerForChart && (
        <InteractiveChartModal
          ticker={selectedTickerForChart}
          onClose={() => setSelectedTickerForChart(null)}
          isStarred={watchlist.includes(selectedTickerForChart.id)}
          onToggleWatchlist={toggleWatchlist}
          onOpenTradeModal={(t) => setTradeModalTicker(t)}
        />
      )}

      {tradeModalTicker && (
        <TradeOrderModal
          isOpen={true}
          onClose={() => setTradeModalTicker(null)}
          ticker={tradeModalTicker}
          allTickers={tickers}
          onSelectTicker={(t) => setTradeModalTicker(t)}
        />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tickers={tickers}
        onSelectTicker={(t) => setSelectedTickerForChart(t)}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistIds={watchlist}
        allTickers={tickers}
        onRemoveFromWatchlist={(id) => toggleWatchlist(id)}
        onSelectTicker={(t) => setSelectedTickerForChart(t)}
        onOpenSearch={() => {
          setIsWatchlistOpen(false);
          setIsSearchOpen(true);
        }}
      />
    </div>
  );
}
