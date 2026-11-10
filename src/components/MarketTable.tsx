import React, { useState } from 'react';
import { Star, ArrowUpRight, ArrowDownRight, ArrowUpDown, ChevronRight, BarChart2 } from 'lucide-react';
import { TickerItem } from '../types/market';

interface MarketTableProps {
  tickers: TickerItem[];
  watchlist: string[];
  onToggleWatchlist: (tickerId: string) => void;
  onSelectTicker: (ticker: TickerItem) => void;
  flashingTickerIds: Record<string, 'up' | 'down'>;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap';
type SortOrder = 'asc' | 'desc';

export const MarketTable: React.FC<MarketTableProps> = ({
  tickers,
  watchlist,
  onToggleWatchlist,
  onSelectTicker,
  flashingTickerIds,
}) => {
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedTickers = [...tickers].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'marketCap') {
      aVal = a.marketCapValue || 0;
      bVal = b.marketCapValue || 0;
    }

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
      <div className="overflow-x-auto tv-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E0E3EB] bg-[#FAF8FF] text-[11px] font-bold text-[#787B86] uppercase tracking-wider select-none">
              <th className="py-3 px-3 w-10 text-center">
                <Star className="w-3.5 h-3.5 mx-auto text-[#787B86]" />
              </th>
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 cursor-pointer hover:text-[#131722] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Ticker & Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 px-4 text-right cursor-pointer hover:text-[#131722] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 hidden md:table-cell text-center">
                Technical Rating
              </th>
              <th className="py-3 px-4 hidden lg:table-cell text-right">
                24h Range (Low / High)
              </th>
              <th
                onClick={() => handleSort('volume')}
                className="py-3 px-4 hidden sm:table-cell text-right cursor-pointer hover:text-[#131722] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('marketCap')}
                className="py-3 px-4 hidden xl:table-cell text-right cursor-pointer hover:text-[#131722] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Market Cap</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 hidden lg:table-cell text-center w-28">
                7D Trend
              </th>
              <th className="py-3 px-4 text-center w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3FA] text-sm">
            {sortedTickers.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[#787B86] text-sm">
                  No matching assets found in this category.
                </td>
              </tr>
            ) : (
              sortedTickers.map((ticker) => {
                const isStarred = watchlist.includes(ticker.id);
                const isBullish = ticker.change >= 0;
                const flash = flashingTickerIds[ticker.id];

                // Mini sparkline SVG for row
                const spark = ticker.sparkline.length > 0 ? ticker.sparkline : [ticker.price];
                const min = Math.min(...spark);
                const max = Math.max(...spark);
                const range = max - min || 1;
                const sw = 90;
                const sh = 24;
                const points = spark.map((val, idx) => {
                  const x = (idx / (spark.length - 1 || 1)) * sw;
                  const y = sh - ((val - min) / range) * (sh - 4) - 2;
                  return `${x},${y}`;
                });
                const pathD = `M ${points.join(' L ')}`;

                return (
                  <tr
                    key={ticker.id}
                    className={`hover:bg-[#F0F3FA]/70 transition-colors group cursor-pointer ${
                      flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                    }`}
                    onClick={() => onSelectTicker(ticker)}
                  >
                    {/* Watchlist Star Toggle */}
                    <td
                      className="py-3.5 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(ticker.id);
                      }}
                    >
                      <button
                        className="p-1 rounded hover:bg-[#E0E3EB] transition-colors"
                        title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            isStarred
                              ? 'text-[#2962FF] fill-[#2962FF]'
                              : 'text-[#C3C5D8] hover:text-[#787B86]'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Symbol & Company Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            backgroundColor: ticker.badgeBg || '#131722',
                            color: ticker.badgeTextColor || '#FFFFFF',
                          }}
                          className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs"
                        >
                          {ticker.badgeText || ticker.symbol.slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-bold text-[#131722] text-sm leading-tight group-hover:text-[#2962FF] transition-colors">
                            <span>{ticker.symbol}</span>
                            <span className="text-[10px] font-semibold text-[#787B86] px-1 py-0.2 bg-[#F0F3FA] rounded">
                              {ticker.exchange}
                            </span>
                          </div>
                          <div className="text-xs text-[#787B86] truncate max-w-[140px] sm:max-w-[200px]">
                            {ticker.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Last Price */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-semibold text-[#131722] text-sm tabular-nums">
                        {ticker.price >= 1000
                          ? ticker.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : ticker.price >= 1
                          ? ticker.price.toFixed(2)
                          : ticker.price.toFixed(4)}
                      </div>
                      <div className="text-[11px] text-[#787B86] tabular-nums hidden sm:block">
                        {isBullish ? '+' : ''}
                        {ticker.change >= 1000
                          ? ticker.change.toFixed(1)
                          : ticker.change.toFixed(2)}
                      </div>
                    </td>

                    {/* Change % Badge */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center text-xs font-bold tabular-nums px-2 py-0.5 rounded-full ${
                          isBullish
                            ? 'text-[#089981] bg-[#E8F5F1]'
                            : 'text-[#F23645] bg-[#FDECEE]'
                        }`}
                      >
                        {isBullish ? (
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline" />
                        )}
                        {isBullish ? '+' : ''}
                        {ticker.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-center">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          ticker.technicalRating === 'Strong Buy'
                            ? 'bg-[#E8F5F1] text-[#089981]'
                            : ticker.technicalRating === 'Buy'
                            ? 'bg-[#E8F5F1]/70 text-[#089981]'
                            : ticker.technicalRating === 'Neutral'
                            ? 'bg-[#F0F3FA] text-[#787B86]'
                            : 'bg-[#FDECEE] text-[#F23645]'
                        }`}
                      >
                        {ticker.technicalRating}
                      </span>
                    </td>

                    {/* Day Range */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-right">
                      <div className="text-xs text-[#131722] tabular-nums">
                        {ticker.low.toLocaleString()} - {ticker.high.toLocaleString()}
                      </div>
                      {/* Visual mini bar */}
                      <div className="w-24 ml-auto h-1 bg-[#E0E3EB] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#2962FF] rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                10,
                                ((ticker.price - ticker.low) / (ticker.high - ticker.low || 1)) * 100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-right font-medium text-xs text-[#131722] tabular-nums">
                      {ticker.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3.5 px-4 hidden xl:table-cell text-right font-medium text-xs text-[#131722] tabular-nums">
                      {ticker.marketCap || '—'}
                    </td>

                    {/* Mini Sparkline */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-center">
                      <div className="w-[90px] h-6 mx-auto">
                        <svg viewBox={`0 0 ${sw} ${sh}`} className="w-full h-full">
                          <path
                            d={pathD}
                            fill="none"
                            stroke={isBullish ? '#089981' : '#F23645'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Quick Row Action */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicker(ticker);
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#787B86] hover:text-[#2962FF] hover:bg-[#E0E3EB] transition-colors"
                        title="Open interactive chart"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
