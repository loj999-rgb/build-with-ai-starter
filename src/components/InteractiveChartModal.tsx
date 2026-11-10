import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  SlidersHorizontal,
  Info,
  DollarSign
} from 'lucide-react';
import { TickerItem, Timeframe, ChartType, CandleData } from '../types/market';

interface InteractiveChartModalProps {
  ticker: TickerItem;
  onClose: () => void;
  isStarred: boolean;
  onToggleWatchlist: (tickerId: string) => void;
  onOpenTradeModal: (ticker: TickerItem) => void;
}

export const InteractiveChartModal: React.FC<InteractiveChartModalProps> = ({
  ticker,
  onClose,
  isStarred,
  onToggleWatchlist,
  onOpenTradeModal,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Timeframe candle multiplier/slice
  const candleHistory = useMemo(() => {
    let raw = ticker.history || [];
    if (raw.length === 0) return [];
    switch (timeframe) {
      case '1D':
        return raw.slice(-12);
      case '5D':
        return raw.slice(-20);
      case '1M':
      default:
        return raw;
      case '3M':
      case '6M':
      case '1Y':
      case '5Y':
      case 'ALL':
        return raw;
    }
  }, [ticker.history, timeframe]);

  // Chart dimensions
  const width = 800;
  const height = showRSI ? 320 : 380;
  const paddingBottom = 40;
  const paddingRight = 60;
  const paddingTop = 20;
  const paddingLeft = 10;

  const chartInnerWidth = width - paddingLeft - paddingRight;
  const chartInnerHeight = height - paddingTop - paddingBottom;

  // Min and Max prices for scale
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (candleHistory.length === 0) {
      return { minPrice: ticker.price * 0.95, maxPrice: ticker.price * 1.05, maxVolume: 1000000 };
    }
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;
    candleHistory.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });
    // Add 2% padding
    const margin = (max - min) * 0.05 || 1;
    return { minPrice: min - margin, maxPrice: max + margin, maxVolume: maxVol };
  }, [candleHistory, ticker.price]);

  const priceRange = maxPrice - minPrice || 1;

  // Convert price to Y coordinate
  const getY = (val: number) => {
    return paddingTop + chartInnerHeight - ((val - minPrice) / priceRange) * chartInnerHeight;
  };

  // Convert index to X coordinate
  const getX = (index: number) => {
    const step = chartInnerWidth / (candleHistory.length || 1);
    return paddingLeft + index * step + step / 2;
  };

  // 20 EMA calculation
  const emaPoints = useMemo(() => {
    if (!showEMA || candleHistory.length < 5) return [];
    const k = 2 / (10 + 1);
    let ema = candleHistory[0].close;
    return candleHistory.map((c, i) => {
      ema = c.close * k + ema * (1 - k);
      return { x: getX(i), y: getY(ema) };
    });
  }, [candleHistory, showEMA, minPrice, maxPrice]);

  const isBullish = ticker.change >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl border border-[#E0E3EB] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E0E3EB] flex items-start justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: ticker.badgeBg || '#131722',
                color: ticker.badgeTextColor || '#FFFFFF',
              }}
              className="w-11 h-11 rounded-2xl text-sm font-bold flex items-center justify-center shrink-0 shadow-xs"
            >
              {ticker.badgeText || ticker.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#131722] tracking-tight">
                  {ticker.symbol}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F0F3FA] text-[#434656]">
                  {ticker.exchange}
                </span>
                {ticker.flag && <span className="text-base">{ticker.flag}</span>}
              </div>
              <p className="text-xs sm:text-sm text-[#787B86] font-medium">{ticker.name}</p>
            </div>
          </div>

          {/* Pricing & CTA Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#131722] tabular-nums tracking-tight">
                {ticker.price >= 1000
                  ? ticker.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ticker.price.toFixed(2)}
              </div>
              <div
                className={`inline-flex items-center text-xs font-bold tabular-nums px-2 py-0.5 rounded-full ${
                  isBullish
                    ? 'text-[#089981] bg-[#E8F5F1]'
                    : 'text-[#F23645] bg-[#FDECEE]'
                }`}
              >
                {isBullish ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                <span>
                  {isBullish ? '+' : ''}
                  {ticker.change.toFixed(2)} ({isBullish ? '+' : ''}
                  {ticker.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Quick Star */}
            <button
              onClick={() => onToggleWatchlist(ticker.id)}
              className="p-2.5 rounded-full border border-[#E0E3EB] hover:bg-[#F0F3FA] transition-colors"
              title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star
                className={`w-5 h-5 ${
                  isStarred ? 'text-[#2962FF] fill-[#2962FF]' : 'text-[#787B86]'
                }`}
              />
            </button>

            {/* Quick Order Trade Button */}
            <button
              onClick={() => onOpenTradeModal(ticker)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#2962FF] hover:bg-[#1E53E5] active:scale-98 text-white text-xs font-bold rounded-full transition-all shadow-xs"
            >
              <DollarSign className="w-4 h-4" />
              <span>Trade {ticker.symbol}</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto tv-scrollbar p-4 sm:p-6 space-y-6">
          {/* Chart Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8FF] p-2.5 rounded-2xl border border-[#E0E3EB]">
            {/* Timeframe Buttons */}
            <div className="flex items-center gap-1">
              {(['1D', '5D', '1M', '3M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#131722] text-white shadow-2xs'
                      : 'text-[#434656] hover:bg-white hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Type & Indicator Toggles */}
            <div className="flex items-center gap-2 text-xs">
              {/* Type Switcher */}
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-[#E0E3EB]">
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                    chartType === 'candlestick'
                      ? 'bg-[#2962FF] text-white'
                      : 'text-[#434656] hover:text-[#131722]'
                  }`}
                >
                  Candles
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                    chartType === 'area'
                      ? 'bg-[#2962FF] text-white'
                      : 'text-[#434656] hover:text-[#131722]'
                  }`}
                >
                  Line / Area
                </button>
              </div>

              {/* Indicator Pills */}
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  showEMA
                    ? 'bg-[#2962FF]/10 text-[#2962FF] border-[#2962FF]/30'
                    : 'bg-white text-[#787B86] border-[#E0E3EB]'
                }`}
              >
                EMA (20)
              </button>
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  showVolume
                    ? 'bg-[#2962FF]/10 text-[#2962FF] border-[#2962FF]/30'
                    : 'bg-white text-[#787B86] border-[#E0E3EB]'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setShowRSI(!showRSI)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  showRSI
                    ? 'bg-[#2962FF]/10 text-[#2962FF] border-[#2962FF]/30'
                    : 'bg-white text-[#787B86] border-[#E0E3EB]'
                }`}
              >
                RSI
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart Canvas */}
          <div className="relative bg-white border border-[#E0E3EB] rounded-2xl p-2 select-none overflow-hidden">
            {/* Live Hover OHLC Readout */}
            <div className="flex items-center gap-4 text-xs font-mono text-[#787B86] px-2 py-1 border-b border-[#F0F3FA] flex-wrap">
              <span>Time: <strong className="text-[#131722]">{hoveredCandle ? hoveredCandle.time : 'Latest Session'}</strong></span>
              <span>O: <strong className="text-[#131722]">{hoveredCandle ? hoveredCandle.open.toFixed(2) : ticker.open.toFixed(2)}</strong></span>
              <span>H: <strong className="text-[#089981]">{hoveredCandle ? hoveredCandle.high.toFixed(2) : ticker.high.toFixed(2)}</strong></span>
              <span>L: <strong className="text-[#F23645]">{hoveredCandle ? hoveredCandle.low.toFixed(2) : ticker.low.toFixed(2)}</strong></span>
              <span>C: <strong className="text-[#131722]">{hoveredCandle ? hoveredCandle.close.toFixed(2) : ticker.price.toFixed(2)}</strong></span>
              <span>Vol: <strong className="text-[#131722]">{hoveredCandle ? (hoveredCandle.volume / 1000000).toFixed(2) + 'M' : ticker.volume}</strong></span>
            </div>

            <div
              className="relative w-full h-[380px] cursor-crosshair"
              onMouseLeave={() => {
                setHoveredCandle(null);
                setHoverPos(null);
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Find nearest candle
                const step = chartInnerWidth / (candleHistory.length || 1);
                const relX = mouseX - paddingLeft;
                const idx = Math.min(
                  candleHistory.length - 1,
                  Math.max(0, Math.floor(relX / step))
                );
                if (candleHistory[idx]) {
                  setHoveredCandle(candleHistory[idx]);
                  setHoverPos({ x: mouseX, y: mouseY });
                }
              }}
            >
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                  const y = paddingTop + p * chartInnerHeight;
                  const price = maxPrice - p * priceRange;
                  return (
                    <g key={i}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        stroke="#F0F3FA"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={width - paddingRight + 6}
                        y={y + 3}
                        fill="#787B86"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {price >= 1000 ? price.toFixed(1) : price.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Histogram Bars */}
                {showVolume &&
                  candleHistory.map((c, i) => {
                    const x = getX(i);
                    const volHeight = (c.volume / (maxVolume || 1)) * 60;
                    const y = height - paddingBottom - volHeight;
                    const isUp = c.close >= c.open;
                    return (
                      <rect
                        key={`vol-${i}`}
                        x={x - 4}
                        y={y}
                        width={8}
                        height={volHeight}
                        fill={isUp ? '#089981' : '#F23645'}
                        opacity="0.25"
                      />
                    );
                  })}

                {/* Candlesticks OR Area Line */}
                {chartType === 'candlestick' ? (
                  candleHistory.map((c, i) => {
                    const x = getX(i);
                    const isUp = c.close >= c.open;
                    const color = isUp ? '#089981' : '#F23645';
                    const yOpen = getY(c.open);
                    const yClose = getY(c.close);
                    const yHigh = getY(c.high);
                    const yLow = getY(c.low);
                    const top = Math.min(yOpen, yClose);
                    const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                    return (
                      <g key={`candle-${i}`}>
                        {/* High/Low Wick */}
                        <line
                          x1={x}
                          y1={yHigh}
                          x2={x}
                          y2={yLow}
                          stroke={color}
                          strokeWidth="1.5"
                        />
                        {/* Open/Close Candle Body */}
                        <rect
                          x={x - 5}
                          y={top}
                          width={10}
                          height={bodyHeight}
                          fill={color}
                          rx="1"
                        />
                      </g>
                    );
                  })
                ) : (
                  // Smooth Area Chart
                  (() => {
                    const points = candleHistory.map((c, i) => `${getX(i)},${getY(c.close)}`);
                    const lineD = `M ${points.join(' L ')}`;
                    const areaD = `${lineD} L ${getX(candleHistory.length - 1)},${
                      height - paddingBottom
                    } L ${getX(0)},${height - paddingBottom} Z`;

                    return (
                      <g>
                        <defs>
                          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2962FF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#2962FF" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d={areaD} fill="url(#chartAreaGrad)" />
                        <path
                          d={lineD}
                          fill="none"
                          stroke="#2962FF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  })()
                )}

                {/* EMA 20 Overlay Line */}
                {showEMA && emaPoints.length > 0 && (
                  <path
                    d={`M ${emaPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`}
                    fill="none"
                    stroke="#FF9900"
                    strokeWidth="1.75"
                    strokeDasharray="2 1"
                  />
                )}

                {/* Current Price Reference Line */}
                <line
                  x1={paddingLeft}
                  y1={getY(ticker.price)}
                  x2={width - paddingRight}
                  y2={getY(ticker.price)}
                  stroke={isBullish ? '#089981' : '#F23645'}
                  strokeDasharray="3 3"
                  strokeWidth="1.25"
                />

                {/* Interactive Crosshair and Hover Pin */}
                {hoverPos && (
                  <g>
                    <line
                      x1={hoverPos.x}
                      y1={paddingTop}
                      x2={hoverPos.x}
                      y2={height - paddingBottom}
                      stroke="#787B86"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <line
                      x1={paddingLeft}
                      y1={hoverPos.y}
                      x2={width - paddingRight}
                      y2={hoverPos.y}
                      stroke="#787B86"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Key Fundamentals & Statistics Grid */}
          <div>
            <h3 className="text-sm font-bold text-[#131722] mb-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#2962FF]" />
              Key Statistics & Valuation
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-[#E0E3EB]">
                <div className="text-[11px] font-semibold text-[#787B86] uppercase">52-Wk Range</div>
                <div className="text-sm font-bold text-[#131722] tabular-nums mt-1">
                  ${ticker.week52Low.toLocaleString()} - ${ticker.week52High.toLocaleString()}
                </div>
                {/* 52-week position bar */}
                <div className="w-full h-1.5 bg-[#E0E3EB] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-[#2962FF] rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          5,
                          ((ticker.price - ticker.week52Low) /
                            (ticker.week52High - ticker.week52Low || 1)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-[#E0E3EB]">
                <div className="text-[11px] font-semibold text-[#787B86] uppercase">Market Cap</div>
                <div className="text-sm font-bold text-[#131722] tabular-nums mt-1">
                  {ticker.marketCap || '—'}
                </div>
                <div className="text-[11px] text-[#787B86] mt-1">Large Cap Benchmark</div>
              </div>

              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-[#E0E3EB]">
                <div className="text-[11px] font-semibold text-[#787B86] uppercase">P/E Ratio (TTM)</div>
                <div className="text-sm font-bold text-[#131722] tabular-nums mt-1">
                  {ticker.peRatio ? `${ticker.peRatio}x` : '—'}
                </div>
                <div className="text-[11px] text-[#787B86] mt-1">
                  Yield: {ticker.divYield || 'None'}
                </div>
              </div>

              <div className="bg-[#FAF8FF] p-3.5 rounded-xl border border-[#E0E3EB]">
                <div className="text-[11px] font-semibold text-[#787B86] uppercase">1Y Target Est.</div>
                <div className="text-sm font-bold text-[#089981] tabular-nums mt-1">
                  {ticker.targetPrice ? `$${ticker.targetPrice.toLocaleString()}` : '—'}
                </div>
                <div className="text-[11px] text-[#787B86] mt-1">
                  Beta: {ticker.beta || '1.0'}
                </div>
              </div>
            </div>
          </div>

          {/* Analyst Consensus Gauge */}
          <div className="bg-white p-4 rounded-2xl border border-[#E0E3EB]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#131722]">Wall Street Analyst Consensus</h4>
                <p className="text-xs text-[#787B86]">Aggregated price targets from institutional brokerages</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#089981] bg-[#E8F5F1] px-2.5 py-1 rounded-full">
                  {ticker.technicalRating} ({ticker.analystRatingScore}/5.0)
                </span>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="flex items-center h-3 w-full rounded-full overflow-hidden gap-0.5 bg-[#F0F3FA]">
              <div
                style={{
                  width: `${(ticker.analystConsensus.buy / (ticker.analystConsensus.buy + ticker.analystConsensus.hold + ticker.analystConsensus.sell || 1)) * 100}%`,
                }}
                className="h-full bg-[#089981]"
                title={`Buy: ${ticker.analystConsensus.buy}`}
              />
              <div
                style={{
                  width: `${(ticker.analystConsensus.hold / (ticker.analystConsensus.buy + ticker.analystConsensus.hold + ticker.analystConsensus.sell || 1)) * 100}%`,
                }}
                className="h-full bg-[#FFD700]"
                title={`Hold: ${ticker.analystConsensus.hold}`}
              />
              <div
                style={{
                  width: `${(ticker.analystConsensus.sell / (ticker.analystConsensus.buy + ticker.analystConsensus.hold + ticker.analystConsensus.sell || 1)) * 100}%`,
                }}
                className="h-full bg-[#F23645]"
                title={`Sell: ${ticker.analystConsensus.sell}`}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#787B86] mt-2">
              <span className="text-[#089981]">Buy ({ticker.analystConsensus.buy})</span>
              <span className="text-[#FF9900]">Hold ({ticker.analystConsensus.hold})</span>
              <span className="text-[#F23645]">Sell ({ticker.analystConsensus.sell})</span>
            </div>
          </div>

          {/* Company Profile & Latest News */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="text-sm font-bold text-[#131722] mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#2962FF]" />
                About {ticker.name}
              </h4>
              <p className="text-xs text-[#434656] leading-relaxed">
                {ticker.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#131722] mb-2">Market Headlines & Ideas</h4>
              <div className="space-y-2.5">
                {ticker.news.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl border border-[#E0E3EB] hover:border-[#2962FF] transition-colors cursor-pointer bg-white"
                  >
                    <div className="text-xs font-semibold text-[#131722] line-clamp-2">
                      {n.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#787B86] mt-1">
                      <span>{n.source}</span>
                      <span>·</span>
                      <span>{n.time}</span>
                      <span
                        className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          n.sentiment === 'bullish'
                            ? 'text-[#089981] bg-[#E8F5F1]'
                            : n.sentiment === 'bearish'
                            ? 'text-[#F23645] bg-[#FDECEE]'
                            : 'text-[#787B86] bg-[#F0F3FA]'
                        }`}
                      >
                        {n.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
