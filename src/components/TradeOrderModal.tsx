import React, { useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { TickerItem } from '../types/market';

interface TradeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: TickerItem;
  allTickers: TickerItem[];
  onSelectTicker: (t: TickerItem) => void;
}

export const TradeOrderModal: React.FC<TradeOrderModalProps> = ({
  isOpen,
  onClose,
  ticker,
  allTickers,
  onSelectTicker,
}) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(Number(ticker.price.toFixed(2)));
  const [executedOrder, setExecutedOrder] = useState<string | null>(null);

  if (!isOpen) return null;

  const effectivePrice = orderType === 'market' ? ticker.price : limitPrice;
  const estimatedTotal = shares * effectivePrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderMessage = `${side.toUpperCase()} ${shares} ${ticker.symbol} @ $${effectivePrice.toFixed(2)} (${orderType.toUpperCase()}) executed successfully!`;
    setExecutedOrder(orderMessage);
    setTimeout(() => {
      setExecutedOrder(null);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E0E3EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: ticker.badgeBg || '#131722',
                color: ticker.badgeTextColor || '#FFFFFF',
              }}
              className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
            >
              {ticker.badgeText || ticker.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="text-base font-extrabold text-[#131722] leading-tight">
                Order Ticket · {ticker.symbol}
              </div>
              <div className="text-xs text-[#787B86]">{ticker.name}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#787B86] hover:bg-[#F0F3FA] hover:text-[#131722]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {executedOrder ? (
          <div className="p-8 text-center space-y-3 bg-[#E8F5F1]">
            <div className="w-14 h-14 bg-[#089981] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#089981]">Order Filled</h3>
            <p className="text-xs text-[#131722] font-medium max-w-xs mx-auto">
              {executedOrder}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F0F3FA] rounded-2xl">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  side === 'buy'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#434656] hover:text-[#131722]'
                }`}
              >
                BUY {ticker.symbol}
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  side === 'sell'
                    ? 'bg-[#F23645] text-white shadow-xs'
                    : 'text-[#434656] hover:text-[#131722]'
                }`}
              >
                SELL {ticker.symbol}
              </button>
            </div>

            {/* Order Type */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#787B86]">Order Type</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    orderType === 'market'
                      ? 'bg-[#131722] text-white'
                      : 'bg-[#F0F3FA] text-[#434656] hover:text-[#131722]'
                  }`}
                >
                  Market
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('limit')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    orderType === 'limit'
                      ? 'bg-[#131722] text-white'
                      : 'bg-[#F0F3FA] text-[#434656] hover:text-[#131722]'
                  }`}
                >
                  Limit
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#787B86]">
                <span>Shares / Contracts</span>
                <span>Current Price: ${ticker.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
                  className="flex-1 bg-[#FAF8FF] border border-[#E0E3EB] rounded-xl px-3 py-2 text-sm font-bold text-[#131722] focus:outline-[#2962FF]"
                  required
                />
                <div className="flex items-center gap-1">
                  {[5, 10, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setShares(num)}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-[#F0F3FA] hover:bg-[#E0E3EB] text-[#131722] transition-colors"
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Limit Price if Limit order */}
            {orderType === 'limit' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#787B86]">Limit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Number(e.target.value))}
                  className="w-full bg-[#FAF8FF] border border-[#E0E3EB] rounded-xl px-3 py-2 text-sm font-bold text-[#131722] focus:outline-[#2962FF]"
                  required
                />
              </div>
            )}

            {/* Estimated Total Calculation */}
            <div className="p-3 bg-[#FAF8FF] rounded-xl border border-[#E0E3EB] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#787B86]">
                <span>Estimated Value:</span>
                <span className="font-bold text-[#131722] text-sm tabular-nums">
                  ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#787B86]">
                <span>Commission & Fees:</span>
                <span className="font-bold text-[#089981]">0.00 USD (Commission-free)</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className={`w-full py-3 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md active:scale-98 ${
                side === 'buy' ? 'bg-[#089981] hover:bg-[#00796B]' : 'bg-[#F23645] hover:bg-[#da2237]'
              }`}
            >
              Confirm {side.toUpperCase()} Order · ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#787B86]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#089981]" />
              <span>Simulated Paper Trading Mode (Instant Execution)</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
