---
name: Market Flow
colors:
  surface: '#faf8ff'
  surface-dim: '#d6d9e9'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedfd'
  surface-container-high: '#e5e7f7'
  surface-container-highest: '#dfe2f2'
  on-surface: '#171b26'
  on-surface-variant: '#434656'
  inverse-surface: '#2c303c'
  inverse-on-surface: '#eef0ff'
  outline: '#737687'
  outline-variant: '#c3c5d8'
  surface-tint: '#004ee8'
  primary: '#0049db'
  on-primary: '#ffffff'
  primary-container: '#2962ff'
  on-primary-container: '#f7f5ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006b59'
  on-secondary: '#ffffff'
  secondary-container: '#84f7db'
  on-secondary-container: '#00725f'
  tertiary: '#b40024'
  on-tertiary: '#ffffff'
  tertiary-container: '#da2237'
  on-tertiary-container: '#fff4f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab3'
  secondary-fixed: '#84f7db'
  secondary-fixed-dim: '#66dabf'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#005143'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001b'
  background: '#faf8ff'
  on-background: '#171b26'
  surface-variant: '#dfe2f2'
  surface-canvas: '#FFFFFF'
  surface-subtle: '#F0F3FA'
  surface-card: '#FFFFFF'
  border-subtle: '#E0E3EB'
  border-hover: '#D1D4DC'
  text-primary: '#131722'
  text-secondary: '#787B86'
  text-tertiary: '#B2B5BE'
  financial-up: '#089981'
  financial-up-bg: '#E8F5F1'
  financial-down: '#F23645'
  financial-down-bg: '#FDECEE'
  accent-brand-blue: '#2962FF'
  accent-brand-blue-hover: '#1E53E5'
  chip-dark: '#131722'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  ticker-val:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.01em
  badge-stat:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers a high-density, performance-driven mobile trading and markets experience. Tailored for retail investors, day traders, and financial analysts, the interface emphasizes immediate legibility, high scanning velocity, and crisp informational hierarchy. 

The aesthetic is modern, analytical minimalism rooted in institutional trading tools yet distilled for touch-first handheld navigation. The atmosphere communicates stability, razor-sharp accuracy, and rapid responsiveness through subtle tinted backgrounds, dense typographic structures, pill-shaped filter controls, and distinct chromatic indicators for market movements.

## Colors

The color palette centers around TradingView's electric identity blue, offset by high-utility financial status tones.

- **Primary (`#2962FF`):** Action-driving brand blue reserved for interactive links, active states, key CTAs, and selected tab highlights.
- **Financial Up (`#089981`):** Precision market green for positive delta percentages, bullish candlestick bodies, upward sparkline fills, and gains.
- **Financial Down (`#F23645`):** High-alert red for negative shifts, bearish candlesticks, downward trends, and selling signals.
- **Neutral Canvas (`#F0F3FA` / `#FFFFFF`):** Cool slate tint for background viewports paired with pure white cards to generate natural contrast without heavy borders.
- **Text Layers:** Deep charcoal-black (`#131722`) for prominent tickers and primary values, neutral slate (`#787B86`) for exchange badges, secondary subtitles, and labels.

## Typography

Inter serves across all headline, body, and numeric display layers to ensure strict tabular alignment and legible scanning across dense rows of financial figures. 

- Use `font-variant-numeric: tabular-nums` across all market pricing indicators, percentages, and timestamps to eliminate layout shifting during real-time data streaming.
- Ticker symbols (e.g., `NVDA`, `AAPL`) leverage `label-md` or `headline-sm` with bold weight, while company sub-names use `body-sm` in slate gray (`#787B86`).
- Section titles ("Markets, everywhere", "World indices") use condensed tracking with an inline drop-arrow or chevron icon directly tethered to the title text.

## Layout & Spacing

The mobile layout operates on a tight fluid system focused on edge-to-edge carousel interactions, dual-column market boards, and compact list item stacks.

- **Mobile Viewport:** Outer lateral margin is fixed at `1rem` (16px) with an interior column gutter of `0.75rem` (12px).
- **Horizontal Carousels:** Market summary cards (such as S&P 500, Nasdaq 100, and World Indices) are arranged in horizontally scrollable rails. The first card aligns with the left `margin`, and trailing cards peek past the right viewport boundary to signal swipe affordance.
- **Section Rhythm:** Maintain `1.5rem` (24px) vertical spacing between section headings and their respective card collections. Header-to-content spacing within cards stays clamped to `space-sm` (8px) or `space-md` (12px) to preserve financial data density.

## Elevation & Depth

Visual hierarchy uses crisp boundary outlines and tonal differentiation over heavy shadows.

- **Cards & Surfaces:** Market cards sit on pure white (`#FFFFFF`) with a 1px solid hairline perimeter (`#E0E3EB`). Drop shadows are either entirely omitted or rendered as an ultra-subtle ambient tint: `box-shadow: 0 1px 3px rgba(19, 23, 34, 0.04)`.
- **Top Navigation Bar:** Sticky flat white surface with a thin border-bottom (`#E0E3EB`). Actions maintain 0 elevation.
- **Elevated Modals & Floating Filters:** When sticky bottom sheets or active market drawdowns open, apply a clean floating shadow: `0 8px 24px rgba(19, 23, 34, 0.12)`.

## Shapes

The interface balances soft industrial structure with pill-shaped interactive components.

- **Market Cards & Modals:** Use `1rem` (16px) corner radius for market quote cards, overview containers, and bottom sheet containers to deliver a modern touch-friendly appearance.
- **Chips, Badges, & Primary CTA:** Formed as full stadium pills (`border-radius: 9999px` / Level 3). This includes the "Get started" header button, segmented category filters ("US stocks", "World stocks", "Crypto"), and index counter circular avatars (e.g., the red "500" or blue "100" badges).
- **Inputs & Search Triggers:** Framed with rounded pill geometry or `rounded-lg` corners depending on contextual real estate.

## Components

### Buttons & Navigation Chips
- **Primary Header CTA ("Get started"):** Deep charcoal-black background (`#131722`), pill-shaped (`rounded-full`), white bold text, zero border, padding: `8px 18px`.
- **Segmented Filter Pills:** Encased in a soft bordered pill capsule (`#E0E3EB`). The active pill turns solid black (`#131722`) with pure white text. Inactive pills render transparent with dark slate text (`#131722`) and change to `#F0F3FA` on press.

### Market Cards & Sparkline Containers
- **Card Structure:** White surface, 1px border (`#E0E3EB`), 16px border-radius, minimum width of 160px in horizontal scrollers.
- **Badge Indicators:** Circular circular indicators (24px by 24px) holding the ticker magnitude index (e.g., S&P "500" in `#F23645` or Nasdaq "100" in `#2962FF`) paired with bold title text and optional regional flags.
- **Sparklines:** Rendered below the price metrics with high-precision vector paths. Bullish trends utilize `#089981` with a vertical 10% opacity gradient fill; bearish trends use `#F23645`.

### Data Lists & Tickers
- **Two-Line Ticker Rows:** Left side displays circular logo avatar (32px) + ticker symbol (`#131722`, 600 weight) over company name (`#787B86`, 12px).
- **Price Block (Right):** Current price listed top-right in tabular numbers (`#131722`, 600 weight), accompanied directly below by a percentage change badge colored in `#089981` (+X.XX%) or `#F23645` (-X.XX%).
- **Dividers:** Optional 1px hairline divider (`#F0F3FA`) inset by 48px to align with text margins.

### Inputs & Search Bars
- **Search Header Trigger:** Magnifying glass icon styled in `#131722` or `#787B86`, expanding into a full-width search input with soft gray fill (`#F0F3FA`), zero default border, and active outline in brand blue (`#2962FF`).