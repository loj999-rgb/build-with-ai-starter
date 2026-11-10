export type MarketCategory = 'all' | 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

export type SubFilter = 'all' | 'most-active' | 'gainers' | 'losers' | 'high-volume' | 'all-time-high';

export type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

export type ChartType = 'candlestick' | 'area';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  url?: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  category: MarketCategory;
  sector?: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: string;
  marketCap?: string;
  marketCapValue?: number; // Numeric for heatmap sizing
  peRatio?: number;
  divYield?: string;
  beta?: number;
  week52High: number;
  week52Low: number;
  targetPrice?: number;
  technicalRating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  analystRatingScore: number; // 1 to 5
  analystConsensus: {
    buy: number;
    hold: number;
    sell: number;
  };
  badgeText?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  flag?: string; // Country flag emoji or code
  sparkline: number[];
  history: CandleData[];
  description: string;
  news: NewsItem[];
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  marketCapValue: number;
  changePercent: number;
  price: number;
  sector: string;
}

export interface HeatmapSector {
  sector: string;
  totalMarketCap: number;
  avgChange: number;
  items: HeatmapItem[];
}
