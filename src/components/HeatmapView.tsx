import React, { useState } from 'react';
import { Flame, Info, Sparkles, Filter } from 'lucide-react';
import { S_AND_P_HEATMAP_SECTORS } from '../data/marketData';
import { HeatmapItem, TickerItem } from '../types/market';

interface HeatmapViewProps {
  onSelectTickerBySymbol: (symbol: string) => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ onSelectTickerBySymbol }) => {
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');

  const filteredSectors = selectedSectorFilter === 'all'
    ? S_AND_P_HEATMAP_SECTORS
    : S_AND_P_HEATMAP_SECTORS.filter((s) => s.sector === selectedSectorFilter);

  const getHeatmapColor = (change: number) => {
    if (change >= 5) return 'bg-[#00796B] text-white';
    if (change >= 2.5) return 'bg-[#089981] text-white';
    if (change >= 1) return 'bg-[#26A69A] text-white';
    if (change >= 0) return 'bg-[#80CBC4] text-[#131722]';
    if (change >= -1) return 'bg-[#EF9A9A] text-[#131722]';
    if (change >= -2.5) return 'bg-[#E57373] text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <div className="w-full space-y-4">
      {/* Heatmap Control Header */}
      <div className="bg-white rounded-2xl border border-[#E0E3EB] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#F23645]" />
            <h2 className="text-xl font-black text-[#131722] tracking-tight">
              S&P 500 Market Cap Heatmap
            </h2>
          </div>
          <p className="text-xs text-[#787B86] mt-0.5">
            Tile dimension is weighted by company market cap. Color represents daily percentage change.
          </p>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setSelectedSectorFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
              selectedSectorFilter === 'all'
                ? 'bg-[#131722] text-white border-[#131722]'
                : 'bg-white text-[#434656] border-[#E0E3EB] hover:bg-[#F0F3FA]'
            }`}
          >
            All Sectors
          </button>
          {S_AND_P_HEATMAP_SECTORS.map((sec) => (
            <button
              key={sec.sector}
              onClick={() => setSelectedSectorFilter(sec.sector)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap transition-all ${
                selectedSectorFilter === sec.sector
                  ? 'bg-[#131722] text-white border-[#131722]'
                  : 'bg-white text-[#434656] border-[#E0E3EB] hover:bg-[#F0F3FA]'
              }`}
            >
              {sec.sector}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid Layout */}
      <div className="space-y-4">
        {filteredSectors.map((sector) => {
          return (
            <div
              key={sector.sector}
              className="bg-white rounded-2xl border border-[#E0E3EB] p-4 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#131722]">{sector.sector}</h3>
                  <span className="text-[11px] text-[#787B86]">
                    Est. Market Cap ${(sector.totalMarketCap / 1000).toFixed(1)}T
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    sector.avgChange >= 0
                      ? 'text-[#089981] bg-[#E8F5F1]'
                      : 'text-[#F23645] bg-[#FDECEE]'
                  }`}
                >
                  {sector.avgChange >= 0 ? '+' : ''}
                  {sector.avgChange.toFixed(2)}%
                </span>
              </div>

              {/* Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {sector.items.map((item) => {
                  const isBullish = item.changePercent >= 0;
                  const bgClass = getHeatmapColor(item.changePercent);

                  return (
                    <div
                      key={item.symbol}
                      onClick={() => onSelectTickerBySymbol(item.symbol)}
                      className={`${bgClass} rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md select-none flex flex-col justify-between min-h-[96px]`}
                      title={`${item.name} (${item.symbol}) - ${item.changePercent >= 0 ? '+' : ''}${item.changePercent}%`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-black tracking-tight">{item.symbol}</span>
                        <span className="text-[10px] font-bold opacity-80">
                          ${item.marketCapValue >= 1000 ? `${(item.marketCapValue / 1000).toFixed(1)}T` : `${item.marketCapValue}B`}
                        </span>
                      </div>

                      <div className="my-1">
                        <div className="text-[11px] truncate opacity-90">{item.name}</div>
                      </div>

                      <div className="flex items-baseline justify-between mt-auto">
                        <span className="text-xs font-bold tabular-nums">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-black tabular-nums">
                          {isBullish ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Color Scale Legend */}
      <div className="bg-white rounded-2xl border border-[#E0E3EB] p-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-semibold text-[#787B86]">Performance Scale</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#787B86] mr-1">-3% or less</span>
          <span className="w-5 h-3 rounded-xs bg-[#F23645]" />
          <span className="w-5 h-3 rounded-xs bg-[#E57373]" />
          <span className="w-5 h-3 rounded-xs bg-[#EF9A9A]" />
          <span className="w-5 h-3 rounded-xs bg-[#80CBC4]" />
          <span className="w-5 h-3 rounded-xs bg-[#26A69A]" />
          <span className="w-5 h-3 rounded-xs bg-[#089981]" />
          <span className="w-5 h-3 rounded-xs bg-[#00796B]" />
          <span className="text-[10px] text-[#787B86] ml-1">+3% or more</span>
        </div>
      </div>
    </div>
  );
};
