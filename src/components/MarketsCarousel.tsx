import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TickerItem } from '../types/market';

interface MarketsCarouselProps {
  tickers: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
  selectedTickerId?: string;
  flashingTickerIds: Record<string, 'up' | 'down'>;
}

export const MarketsCarousel: React.FC<MarketsCarouselProps> = ({
  tickers,
  onSelectTicker,
  selectedTickerId,
  flashingTickerIds,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Indices and key benchmark cards for the top rail
  const highlightCards = tickers.filter(
    (t) =>
      t.category === 'indices' ||
      t.symbol === 'BTCUSD' ||
      t.symbol === 'GOLD' ||
      t.symbol === 'CL1!' ||
      t.symbol === 'EURUSD'
  );

  return (
    <div className="w-full mb-8">
      {/* Section Header with Chevron */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 cursor-pointer group">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#131722] group-hover:text-[#2962FF] transition-colors">
            Markets, everywhere
          </h2>
          <ChevronDown className="w-5 h-5 text-[#787B86] group-hover:text-[#2962FF] transition-colors" />
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-[#E0E3EB] bg-white hover:bg-[#F0F3FA] flex items-center justify-center text-[#131722] transition-colors shadow-2xs"
            aria-label="Previous markets"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-[#E0E3EB] bg-white hover:bg-[#F0F3FA] flex items-center justify-center text-[#131722] transition-colors shadow-2xs"
            aria-label="Next markets"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Rail */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
      >
        {highlightCards.map((ticker) => {
          const isSelected = selectedTickerId === ticker.id;
          const isBullish = ticker.change >= 0;
          const flash = flashingTickerIds[ticker.id];

          // Compute SVG sparkline coordinates
          const sparklineData = ticker.sparkline.length > 0 ? ticker.sparkline : [ticker.price];
          const min = Math.min(...sparklineData);
          const max = Math.max(...sparklineData);
          const range = max - min || 1;
          const width = 160;
          const height = 44;

          const points = sparklineData.map((val, idx) => {
            const x = (idx / (sparklineData.length - 1 || 1)) * width;
            const y = height - ((val - min) / range) * (height - 8) - 4;
            return `${x},${y}`;
          });

          const pathD = `M ${points.join(' L ')}`;
          const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

          return (
            <div
              key={ticker.id}
              onClick={() => onSelectTicker(ticker)}
              className={`shrink-0 w-[190px] sm:w-[210px] bg-white rounded-2xl border p-3.5 cursor-pointer transition-all hover:border-[#2962FF] hover:shadow-sm select-none ${
                isSelected ? 'ring-2 ring-[#2962FF] border-[#2962FF]' : 'border-[#E0E3EB]'
              } ${flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''}`}
            >
              {/* Top row: Badge + Ticker + Flag */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {ticker.badgeText && (
                    <span
                      style={{
                        backgroundColor: ticker.badgeBg || '#131722',
                        color: ticker.badgeTextColor || '#FFFFFF',
                      }}
                      className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      {ticker.badgeText}
                    </span>
                  )}
                  <div>
                    <div className="text-sm font-bold text-[#131722] leading-none flex items-center gap-1">
                      {ticker.symbol}
                      {ticker.flag && <span className="text-xs">{ticker.flag}</span>}
                    </div>
                    <div className="text-[11px] text-[#787B86] truncate max-w-[100px] mt-0.5">
                      {ticker.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Delta Block */}
              <div className="flex items-baseline justify-between mt-1 mb-2">
                <div className="text-base sm:text-lg font-bold text-[#131722] tabular-nums tracking-tight">
                  {ticker.price >= 1000
                    ? ticker.price.toLocaleString(undefined, {
                        minimumFractionDigits: ticker.category === 'crypto' || ticker.category === 'indices' ? 2 : 2,
                        maximumFractionDigits: 2,
                      })
                    : ticker.price >= 1
                    ? ticker.price.toFixed(2)
                    : ticker.price.toFixed(4)}
                </div>
                <div
                  className={`flex items-center text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-sm ${
                    isBullish
                      ? 'text-[#089981] bg-[#E8F5F1]'
                      : 'text-[#F23645] bg-[#FDECEE]'
                  }`}
                >
                  {isBullish ? (
                    <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5" />
                  )}
                  <span>
                    {isBullish ? '+' : ''}
                    {ticker.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Vector Sparkline with 10% gradient area fill */}
              <div className="w-full h-11 overflow-hidden mt-1">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={`grad-${ticker.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isBullish ? '#089981' : '#F23645'}
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={isBullish ? '#089981' : '#F23645'}
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>
                  <path d={areaD} fill={`url(#grad-${ticker.id})`} />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isBullish ? '#089981' : '#F23645'}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
