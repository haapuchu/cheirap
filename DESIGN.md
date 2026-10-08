# CHEIRAP AI (ꯆꯩꯔꯥꯞ) — Pre-Award Vigilance Radar Design System

## 1. Atmosphere & Identity

A sovereign judicial cyber-command center designed for state vigilance commissioners, procurement auditors, and finance secretaries. High-density, high-legibility telemetry under deep space-black illumination. The atmospheric signature is **sovereign statutory authority** — sharp obsidian planes (`#050811`, `#080d1a`), restrained institutional amber/gold radiance (`#f59e0b`), cold slate borders (`#1e293b`), and clinical risk metrics that command immediate bureaucratic deference without visual clutter or toy-like gamification.

Every element feels like a courtroom-grade telemetry console: numbers are mono-spaced and tabular, statutory orders resemble formal gazette notifications with Kangla seal headers, and risk states are communicated through distinct luminosity shifts and iconography rather than garish stripes.

---

## 2. Color

### Palette

| Role | Token | Light (Paper Mode) | Dark (Judicial Command) | Usage |
|------|-------|--------------------|-------------------------|-------|
| Surface/canvas | `--background` | `#F8FAFC` | `#050811` | Root application canvas |
| Surface/primary | `--surface-primary` | `#FFFFFF` | `#080D1A` | Main panels, triage container |
| Surface/secondary | `--surface-secondary` | `#F1F5F9` | `#0C1324` | KPI cards, data table rows |
| Surface/elevated | `--surface-elevated` | `#FFFFFF` | `#111A30` | Modals, dialogs, floating overlays |
| Text/primary | `--text-primary` | `#0F172A` | `#F8FAFC` | Primary headlines, tender titles, numbers |
| Text/secondary | `--text-secondary` | `#475569` | `#94A3B8` | Metadata, ref numbers, department labels |
| Text/tertiary | `--text-tertiary` | `#94A3B8` | `#64748B` | Timestamp micro-labels, footnotes |
| Border/default | `--border-default` | `#CBD5E1` | `#1E293B` | Section dividers, card frames |
| Border/subtle | `--border-subtle` | `#E2E8F0` | `#141F36` | Table row dividers, inner borders |
| Accent/primary | `--accent-primary` | `#D97706` | `#F59E0B` | Judicial Amber: Primary CTAs, active radar |
| Accent/hover | `--accent-hover` | `#B45309` | `#D97706` | Hover state on primary actions |
| Status/red (Critical) | `--status-error` | `#DC2626` | `#EF4444` | High risk tier (Score ≥ 70), Statutory Hold |
| Status/amber (Caution)| `--status-warning` | `#D97706` | `#F59E0B` | Moderate risk tier (Score 38–69), Corrigenda |
| Status/green (Clear)  | `--status-success` | `#16A34A` | `#10B981` | Low risk tier (Score < 38), Statutory compliant |
| Status/info (Cyan)    | `--status-info` | `#0284C7` | `#06B6D4` | Mantripukhri Venue Corridor badges |

### Rules
- **Semantic Exclusivity**: The Judicial Amber (`#F59E0B`) is reserved strictly for primary regulatory actions (Generate Hold Order, Filter Triage) and Kangla statutory seals.
- **Ink-Alpha Washes**: State highlights (selected row, hover card) utilize low-opacity background washes (`rgba(245, 158, 11, 0.05)` or `rgba(239, 68, 68, 0.08)`) instead of solid fills.
- **No Coloured Accent Borders**: Never apply asymmetric accent borders (`border-l-4 border-red-500`) to indicate risk or selection. Selection is conveyed via uniform border alpha increase (`#334155`), tonal surface elevation, and clear SVG iconography.

---

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | 32px / 2.0rem | 800 | 1.15 | -0.025em | Main Cheirap Radar Header (`font-syne`) |
| H1 | 24px / 1.5rem | 700 | 1.2 | -0.02em | Section Headers, Modal Titles (`font-cinzel`) |
| H2 | 18px / 1.125rem | 600 | 1.3 | -0.01em | Card Titles, Subheaders (`font-syne`) |
| H3 | 15px / 0.9375rem | 600 | 1.4 | -0.005em | Tender Title Headers in Triage Rows |
| Body/lg | 15px / 0.9375rem | 400 | 1.5 | 0 | Lead descriptive text, hold order preamble |
| Body | 14px / 0.875rem | 400 | 1.5 | 0 | Default interface text, modal directives |
| Body/sm | 13px / 0.8125rem | 400 | 1.4 | 0 | Secondary info, department & date pairs |
| Caption | 11px / 0.6875rem | 500 | 1.3 | 0.02em | Badges, micro-telemetry, status tags |
| Telemetry | 13px / 0.8125rem | 500 | 1.2 | 0.04em | INR Crores, Risk Scores, Ref Numbers (`font-mono`) |

### Font Stack
- **Display & Section Headers**: `'Syne', sans-serif` — Modern European geometric clarity with commanding authority.
- **Sovereign Seals & Gazette Titles**: `'Cinzel', serif` — Classical judicial gravitas for official Manipur State orders.
- **Primary Interface**: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif` — Ultra-legible clean sans for high-density administrative data.
- **Telemetry & Financial Figures**: `'JetBrains Mono', monospace` — Cryptographic precision for tender amounts, ref numbers, and risk percentages.

### Rules
- Max 3 font families used strictly by semantic role (Syne = App Identity, Cinzel = Gazette Authority, Plus Jakarta Sans = UI, JetBrains Mono = Data).
- Body text never drops below 13px in production viewports.
- All currency representations use uppercase `₹` with formatted Indian numbering (`₹XX.XX Cr` or `₹XX,XX,XXX`).

---

## 4. Spacing & Layout

### Base Unit
All spacing derives from a base of **4px**.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight: gap between icon and counter tag |
| `--space-2` | 8px | Compact: badge padding, chip clusters, inline metadata |
| `--space-3` | 12px | Default: table cell vertical padding, search input padding |
| `--space-4` | 16px | Standard: card internal padding, button spacing |
| `--space-5` | 20px | Comfortable: modal section gaps |
| `--space-6` | 24px | Generous: grid gutters, triage panel padding |
| `--space-8` | 32px | Major section margins |
| `--space-10`| 40px | Header to main content container gap |

### Grid System
- **Max Content Width**: 1440px with responsive container margins (`px-4 sm:px-6 lg:px-8`).
- **Telemetry Grid**: 4-column balanced responsive grid for top KPI metrics (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
- **Venue Radar Grid**: 3-column specialized card matrix for Mantripukhri IT SEZ tenders (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`).
- **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

---

## 5. Components

### 1. `Card` (Telemetry Container)
- **Structure**: Glassmorphic dark container (`bg-[#080d1a]/80 backdrop-blur-md`) with subtle border (`border-[#1e293b]`).
- **Variants**: Standard Card, Active Accent Card (subtle gold ambient halo), Alert Card (subtle red ambient glow).
- **States**: Rest (`border-[#1e293b]`), Hover (`border-[#334155] translate-y-[-1px] transition-all`).
- **Accessibility**: Semantic `<section>` or `<article>` wrappers, high contrast text ratios > 7:1.

### 2. `Badge` (Vigilance Tiers & Venue Tags)
- **Structure**: Compact pill (`px-2.5 py-0.5 rounded-full text-xs font-semibold`).
- **Variants**:
  - `RED`: `bg-red-500/10 text-red-400 border border-red-500/30`
  - `AMBER`: `bg-amber-500/10 text-amber-400 border border-amber-500/30`
  - `GREEN`: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/30`
  - `VENUE`: `bg-cyan-500/10 text-cyan-400 border border-cyan-500/30`
- **States**: Immutable indicator, hoverable only when acting as filter trigger.

### 3. `Button` (Administrative Action Trigger)
- **Structure**: Ergonomic rectangular action control (`h-9 px-4 rounded-md font-medium text-sm flex items-center gap-2`).
- **Variants**:
  - `Primary / Amber`: `bg-amber-500 text-black hover:bg-amber-400 shadow-sm shadow-amber-500/20`
  - `Destructive / Red`: `bg-red-600/90 text-white hover:bg-red-500 shadow-sm shadow-red-500/20`
  - `Ghost / Outline`: `border border-[#1e293b] text-slate-300 hover:bg-[#141f36]`
- **States**: Default, Hover (tone ramp + 10%), Active (scale 0.98), Disabled (`opacity-50 pointer-events-none`).

### 4. `Dialog` (Official Pre-Award Vigilance Hold Order)
- **Structure**: Centered modal overlay (`bg-black/80 backdrop-blur-sm`), content sheet (`max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0f1d] border border-amber-500/40 rounded-xl p-6`).
- **Features**: Kangla Emblem header, formal reference number, statutory citation box (CVC Circular 01/01/2021 & GFR Rule 161), automated corrective directives, export/print trigger.
- **States**: Open with ease-out entry, Close via Escape or backdrop dismiss.

---

## 6. Motion & Interaction

### Timing
| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 120ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Button press, tab hover, badge highlight |
| Standard | 220ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Modal reveal, tab switch, filter transition |
| Ambient | 2400ms | `ease-in-out infinite` | Live Radar radar sweep / venue status beacon |

### Rules
- **GPU Acceleration**: Strictly animate `transform`, `opacity`, and `filter`.
- **Purpose-Driven Motion**: Every transition marks a real administrative state shift (e.g., radar filter change, hold order modal presentation).
- **Accessibility**: Respect `prefers-reduced-motion` across all pulse effects and modal transitions.

---

## 7. Depth & Surface

### Strategy: Layered Muted Depth (`mixed`)
Surfaces are differentiated through progressive illumination layers combined with micro-thin borders:
- **Base Canvas**: `#050811` (Deep void)
- **Surface Elevation 1 (Card/Table)**: `#080d1a` + `border 1px solid #1e293b`
- **Surface Elevation 2 (Modal / Popup)**: `#0c1427` + `border 1px solid #334155` + `box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7)`

### Radius Tokens
- `--radius-sm`: `4px` (Tags, code pills)
- `--radius-md`: `8px` (Buttons, form fields, badges)
- `--radius-lg`: `12px` (Cards, panels, triage containers)
- `--radius-xl`: `16px` (Pre-Award Hold Order Modal)
- `--radius-full`: `9999px` (Pills, live indicator dots)

---

## 8. Accessibility Constraints & Accepted Debt

### Constraints
- **WCAG Compliance**: WCAG 2.2 Level AA target.
- **Contrast Ratios**: Minimum 7:1 for headers and key financial figures against dark canvas; minimum 4.5:1 for secondary metadata.
- **Keyboard Navigation**: Full Tab/Shift+Tab focus traversal on search inputs, tab triggers, modal buttons, and table rows with visible focus rings (`ring-2 ring-amber-400`).
- **Screen Reader Support**: All risk badges carry ARIA role annotations and explicit textual descriptors (`Critical Vigilance Tier`).

### Accepted Debt
| Item | Location | Why Accepted | Owner / Exit |
|------|----------|--------------|--------------|
| Embedded Data Fallback | `src/App.tsx` | Guarantees instant 0ms offline demo functionality for hackathon stage without relying on local port 8000 uptime | Core Engineering / Post-Hackathon |
| Static Map Projection | `VenueRadar.tsx` | Precise vector GIS coordinates replace dynamic Mapbox tiles to eliminate external API key dependencies | Frontend Team / Q4 2026 |
