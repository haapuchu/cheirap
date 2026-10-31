import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Bookmark,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  FileSearch,
  FileDiff,
  FileDown,
  FileText,
  Flag,
  Filter,
  Globe2,
  HelpCircle,
  Info,
  Layers3,
  LayoutGrid,
  ListFilter,
  MapPinned,
  MapPin,
  Menu,
  MessageSquare,
  Network,
  NotebookPen,
  Printer,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Table,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import embeddedTenders from '@/data/tenders_scored.json';
import { IndiaMapWatermark } from '@/components/IndiaMapWatermark';
import { GepnicDossierSection } from '@/components/GepnicDossierSection';

import {
  formatCrores,
  formatDate,
  formatIndianCurrency,
  getAwardDifference,
  getAwardedName,
  getClosingLabel,
  getDaysUntilClosing,
  getDistrictLabel,
  getLocationLabel,
  getSignal,
  getSignalTone,
  getSimpleDepartment,
  getTenderBrief,
  normalizeSnapshotTender,
  parseTenderDate,
  snapshotMeta,
} from '@/lib/tenderInsights';
import type { Tender, TenderTier } from '@/lib/tenderInsights';
import { useCheirapMotion } from '@/lib/useCheirapMotion';

const allTenders = (embeddedTenders as unknown as Tender[]).map(normalizeSnapshotTender);

const officialPortalUrl = snapshotMeta.sourceUrl;
const officialSearchUrl = snapshotMeta.searchUrl;

const statePortals = [
  {
    code: 'AS',
    state: 'Assam',
    capital: 'Dispur / Guwahati',
    coords: '26.14° N, 91.73° E',
    portalUrl: 'https://assamtenders.gov.in/',
    portalLabel: 'Assam e-Procurement',
    rulebookUrl: 'https://finance.assam.gov.in/portlets/public-procurement',
    rulebookLabel: 'Public procurement guidance',
    status: 'Adapter research underway',
  },
  {
    code: 'ML',
    state: 'Meghalaya',
    capital: 'Shillong',
    coords: '25.57° N, 91.89° E',
    portalUrl: 'https://meghalayatenders.gov.in/',
    portalLabel: 'Meghalaya e-Procurement',
    rulebookUrl: 'https://meghalaya.gov.in/sites/default/files/circulars/e_procurement.pdf',
    rulebookLabel: 'e-Procurement scheme',
    status: 'Portal mapped',
  },
  {
    code: 'NL',
    state: 'Nagaland',
    capital: 'Kohima',
    coords: '25.67° N, 94.10° E',
    portalUrl: 'https://nagalandtenders.gov.in/',
    portalLabel: 'Nagaland e-Procurement',
    rulebookUrl: 'https://ditc.nagaland.gov.in/storage/uploads/MVkvKbXBA3HK9z3GSHM6pKYOH2UWyr652BuwNMEL.pdf',
    rulebookLabel: 'e-Procurement policy',
    status: 'Portal mapped',
  },
  {
    code: 'TR',
    state: 'Tripura',
    capital: 'Agartala',
    coords: '23.83° N, 91.28° E',
    portalUrl: 'https://tripuratenders.gov.in/',
    portalLabel: 'Tripura e-Procurement',
    rulebookUrl: 'https://finance.tripura.gov.in/sites/default/files/Manual-for-Procurement-of-Goods.pdf',
    rulebookLabel: 'Procurement manual',
    status: 'Adapter research underway',
  },
  {
    code: 'MZ',
    state: 'Mizoram',
    capital: 'Aizawl',
    coords: '23.73° N, 92.71° E',
    portalUrl: 'https://mizoramtenders.gov.in/',
    portalLabel: 'Mizoram e-Procurement',
    rulebookUrl: 'https://finance.mizoram.gov.in/uploads/attachments/2023/07/3e83d37f3fb5648c7d634a7730dd3f9a/mizoram-public-procurement-rules-2020.pdf',
    rulebookLabel: 'Public procurement rules',
    status: 'Portal mapped',
  },
];

const getComparableTenders = (tender: Tender) => {
  const sameDepartment = allTenders.filter((item) => item.tender_id !== tender.tender_id && item.department === tender.department);
  if (sameDepartment.length >= 3) return sameDepartment.slice(0, 3);
  return allTenders.filter((item) => item.tender_id !== tender.tender_id).slice(0, 3);
};

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function StatusDot({ tier }: { tier: TenderTier }) {
  return <span className={`status-dot status-${tier.toLowerCase()}`} aria-hidden="true" />;
}

function DataStatus({ compact = false, count = allTenders.length }: { compact?: boolean; count?: number }) {
  return (
    <span className={compact ? 'data-status data-status-compact' : 'data-status'} title={`Snapshot assembled ${snapshotMeta.snapshotDate}; verify the original record before relying on it.`}>
      <span className="data-status-dot" />
      <span>{compact ? `Snapshot · ${snapshotMeta.shortSnapshotDate}` : `${snapshotMeta.status} · ${count} records`}</span>
    </span>
  );
}

function TenderStoryCard({ tender, onOpen }: { tender: Tender; onOpen: (tender: Tender) => void }) {
  const signal = getSignal(tender);
  const brief = getTenderBrief(tender);
  return (
    <article className="story-card">
      <div className="story-card-topline">
        <span className={`signal-label ${getSignalTone(signal.tone)}`}>{signal.label}</span>
        <span className="story-card-value">{formatCrores(tender.estimated_value_inr)}</span>
      </div>
      <h3>{tender.title}</h3>
      <div className="story-card-context">
        <span className="story-card-context-label">In plain language</span>
        <p>{brief.summaryParagraphs[0]}</p>
      </div>
      <div className="story-card-meta">
        <span><MapPin size={14} /> {getLocationLabel(tender.location)}</span>
        <span><Clock3 size={14} /> {getClosingLabel(tender)}</span>
        <span><FileText size={14} /> {getSimpleDepartment(tender.department)}</span>
      </div>
      <button className="text-action" onClick={() => onOpen(tender)}>
        Open transparency brief <ArrowUpRight size={15} />
      </button>
    </article>
  );
}

type SortField = 'value' | 'closing' | 'signal' | 'amendments' | 'window';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'cards' | 'table';

function TenderRow({
  tender,
  watched,
  selected,
  isFocused = false,
  index,
  onOpen,
  onWatch,
  onCompare,
}: {
  tender: Tender;
  watched: boolean;
  selected: boolean;
  isFocused?: boolean;
  index?: number;
  onOpen: (tender: Tender) => void;
  onWatch: (id: string) => void;
  onCompare: (id: string) => void;
}) {
  const signal = getSignal(tender);
  const brief = getTenderBrief(tender);
  return (
    <article
      id={index !== undefined ? `tender-item-${index}` : undefined}
      className={`tender-row ${selected ? 'tender-row-selected' : ''} ${isFocused ? 'tender-row-focused' : ''}`}
    >
      <div className="tender-row-main">
        <div className="tender-row-title-line">
          <StatusDot tier={tender.vigilance_tier} />
          <h3>{tender.title}</h3>
        </div>
        <p className="tender-row-subtitle">{getSimpleDepartment(tender.department)} · {getLocationLabel(tender.location)} · {brief.projectType}</p>
        <div className="tender-row-tags">
          <span className={`signal-label ${getSignalTone(signal.tone)}`}>{signal.label}</span>
          <span className="neutral-tag">{tender.status}</span>
          <span className="neutral-tag">{getClosingLabel(tender)}</span>
        </div>
      </div>
      <div className="tender-row-value">
        <span className="eyebrow-small">Estimated value</span>
        <strong>{formatCrores(tender.estimated_value_inr)}</strong>
      </div>
      <div className="tender-row-actions">
        <button className={`icon-button ${watched ? 'icon-button-active' : ''}`} onClick={() => onWatch(tender.tender_id)} aria-label={watched ? 'Remove from watchlist' : 'Save tender'} title={watched ? 'Remove from watchlist' : 'Save tender'}>
          <Bookmark size={17} fill={watched ? 'currentColor' : 'none'} />
        </button>
        <label className="compare-check">
          <input type="checkbox" checked={selected} onChange={() => onCompare(tender.tender_id)} />
          <span>Compare</span>
        </label>
        <button className="row-open-button" onClick={() => onOpen(tender)}>View tender <ChevronRight size={15} /></button>
      </div>
    </article>
  );
}

function TenderTable({
  tenders,
  watchlist,
  compareIds,
  sortField,
  sortDirection,
  onSort,
  onOpen,
  onWatch,
  onCompare,
  focusedIndex,
}: {
  tenders: Tender[];
  watchlist: string[];
  compareIds: string[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onOpen: (tender: Tender) => void;
  onWatch: (id: string) => void;
  onCompare: (id: string) => void;
  focusedIndex: number;
}) {
  return (
    <div className="tender-table-container">
      <table className="tender-table" role="grid" aria-label="Tenders data grid">
        <thead>
          <tr>
            <th scope="col" className="th-signal">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => onSort('signal')}
                title="Sort by vigilance signal"
              >
                <span>Signal</span>
                {sortField === 'signal' ? (
                  sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                ) : (
                  <ArrowUpDown size={13} className="sort-idle" />
                )}
              </button>
            </th>
            <th scope="col" className="th-tender">Tender & Department</th>
            <th scope="col" className="th-value">
              <button
                type="button"
                className="table-sort-btn table-sort-right"
                onClick={() => onSort('value')}
                title="Sort by estimated value"
              >
                <span>Est. Value</span>
                {sortField === 'value' ? (
                  sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                ) : (
                  <ArrowUpDown size={13} className="sort-idle" />
                )}
              </button>
            </th>
            <th scope="col" className="th-window">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => onSort('window')}
                title="Sort by response window"
              >
                <span>Window</span>
                {sortField === 'window' ? (
                  sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                ) : (
                  <ArrowUpDown size={13} className="sort-idle" />
                )}
              </button>
            </th>
            <th scope="col" className="th-closing">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => onSort('closing')}
                title="Sort by closing deadline"
              >
                <span>Closes</span>
                {sortField === 'closing' ? (
                  sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                ) : (
                  <ArrowUpDown size={13} className="sort-idle" />
                )}
              </button>
            </th>
            <th scope="col" className="th-corrigenda">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => onSort('amendments')}
                title="Sort by amendments count"
              >
                <span>Amendments</span>
                {sortField === 'amendments' ? (
                  sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                ) : (
                  <ArrowUpDown size={13} className="sort-idle" />
                )}
              </button>
            </th>
            <th scope="col" className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender, index) => {
            const isWatched = watchlist.includes(tender.tender_id);
            const isSelected = compareIds.includes(tender.tender_id);
            const isFocused = focusedIndex === index;
            const signal = getSignal(tender);

            return (
              <tr
                key={tender.tender_id}
                id={`tender-item-${index}`}
                className={`table-row ${isFocused ? 'table-row-focused' : ''} ${isSelected ? 'table-row-selected' : ''}`}
                onClick={() => onOpen(tender)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onOpen(tender);
                }}
              >
                <td className="td-signal">
                  <div className="table-signal-cell">
                    <StatusDot tier={tender.vigilance_tier} />
                    <span className={`signal-label signal-label-compact ${getSignalTone(signal.tone)}`}>
                      {signal.label}
                    </span>
                  </div>
                </td>
                <td className="td-tender">
                  <div className="table-tender-cell">
                    <div className="table-tender-top">
                      <span className="table-tender-id">{tender.tender_id}</span>
                      <span className="table-tender-status">{tender.status}</span>
                    </div>
                    <strong className="table-tender-title" title={tender.title}>{tender.title}</strong>
                    <span className="table-tender-meta">
                      {getSimpleDepartment(tender.department)} · {getLocationLabel(tender.location)}
                    </span>
                  </div>
                </td>
                <td className="td-value">
                  <strong className="table-value-num">{formatCrores(tender.estimated_value_inr)}</strong>
                  <small className="table-sub-value">
                    EMD: {tender.emd_amount_inr > 0 ? formatCrores(tender.emd_amount_inr) : 'Exempt'}
                  </small>
                </td>
                <td className="td-window">
                  <span className={`table-window-badge ${tender.feat_window_compression_hours < 72 ? 'window-compressed' : ''}`}>
                    {tender.feat_window_days.toFixed(1)}d
                  </span>
                </td>
                <td className="td-closing">
                  <span className="table-closing-date">{formatDate(tender.closing_date)}</span>
                  <small className="table-closing-sub">{getClosingLabel(tender)}</small>
                </td>
                <td className="td-corrigenda">
                  <span className={`table-corrigenda-badge ${tender.corrigendum_count > 0 ? 'corrigenda-has' : 'corrigenda-zero'}`}>
                    {tender.corrigendum_count}
                  </span>
                </td>
                <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                  <div className="table-actions-cell">
                    <button
                      type="button"
                      className={`icon-button icon-button-compact ${isWatched ? 'icon-button-active' : ''}`}
                      onClick={() => onWatch(tender.tender_id)}
                      aria-label={isWatched ? 'Remove from saved' : 'Save tender'}
                      title={isWatched ? 'Remove from saved' : 'Save tender'}
                    >
                      <Bookmark size={15} fill={isWatched ? 'currentColor' : 'none'} />
                    </button>
                    <label className="table-compare-check" title="Select to compare">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onCompare(tender.tender_id)}
                      />
                    </label>
                    <button
                      type="button"
                      className="table-open-btn"
                      onClick={() => onOpen(tender)}
                      title="Open tender detail"
                      aria-label={`Open tender ${tender.tender_id}`}
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type DetailTabId = 'brief' | 'gepnic' | 'timeline' | 'comparison' | 'action';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const daysBetween = (start: string | undefined, end: string | undefined) => {
  const startDate = parseTenderDate(start);
  const endDate = parseTenderDate(end);
  if (!startDate || !endDate) return null;
  return Math.max(0, (endDate.getTime() - startDate.getTime()) / 86400000);
};

const formatDays = (value: number | null) => value === null ? 'Not listed' : `${value.toFixed(value % 1 ? 1 : 0)} days`;

function DetailTabs({ activeTab, onChange }: { activeTab: DetailTabId; onChange: (tab: DetailTabId) => void }) {
  const tabs: Array<{ id: DetailTabId; label: string; icon: typeof BarChart3 }> = [
    { id: 'brief', label: 'Executive Brief', icon: BarChart3 },
    { id: 'gepnic', label: 'Official Filing Dossier', icon: Layers3 },
    { id: 'timeline', label: 'Visual Timeline', icon: Clock3 },
    { id: 'comparison', label: 'Peer Comparison', icon: UsersRound },
    { id: 'action', label: 'Citizen Action', icon: MessageSquare },
  ];

  return (
    <div className="tender-tabs-bar" role="tablist" aria-label="Tender detail sections">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          className={`tender-tab-btn ${activeTab === id ? 'tender-tab-active' : ''} ${id === 'gepnic' ? 'tender-tab-featured' : ''}`}
          key={id}
          id={`tender-tab-${id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          aria-controls={`tender-panel-${id}`}
          tabIndex={activeTab === id ? 0 : -1}
          onClick={() => onChange(id)}
        >
          <Icon size={16} aria-hidden="true" />
          <span>{label}</span>
          {id === 'gepnic' && <span className="tab-pill-badge">9-Part Filing</span>}
        </button>
      ))}
    </div>
  );
}

function ExplainableVigilanceScorecard({ tender, signal }: { tender: Tender; signal: ReturnType<typeof getSignal> }) {
  const score = clamp(Math.round(tender.cheirap_risk_score), 0, 100);
  const tier = tender.vigilance_tier || (score >= 70 ? 'RED' : score >= 40 ? 'AMBER' : 'GREEN');
  const tierLabel = tier === 'RED' ? 'Verify Record' : tier === 'AMBER' ? 'Closer Inspection' : 'Standard Routine';
  const tierTone = tier === 'RED' ? 'score-tone-rose' : tier === 'AMBER' ? 'score-tone-amber' : 'score-tone-green';

  const windowCompressed = tender.feat_window_compression_hours < 72;
  const highAmendments = tender.corrigendum_count >= 3;
  const highEmd = tender.feat_emd_ratio > 0.05;
  const lowBidders = tender.feat_single_bidder_risk >= 0.7 || (tender.bids_received !== undefined && tender.bids_received <= 2);

  return (
    <div className="visual-card explainable-scorecard">
      <div className="scorecard-header">
        <div>
          <span className="eyebrow-small">Vigilance Index</span>
          <h3>Procurement Context Score</h3>
        </div>
        <div className={`scorecard-badge ${tierTone}`}>
          <ShieldCheck size={14} />
          <span>{tierLabel}</span>
        </div>
      </div>

      <div className="scorecard-main">
        <div className="scorecard-number-block">
          <div className="scorecard-number-row">
            <span className="scorecard-big-num">{score}</span>
            <span className="scorecard-max">/100</span>
          </div>
          <span className="scorecard-subtext">{signal.label}</span>
        </div>

        <div className="scorecard-spectrum-wrap">
          <div className="scorecard-spectrum-bar" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`Context score ${score} of 100`}>
            <span className="spectrum-segment spectrum-segment-green" title="0-39: Standard window" />
            <span className="spectrum-segment spectrum-segment-amber" title="40-69: Closer look" />
            <span className="spectrum-segment spectrum-segment-rose" title="70-100: Verify record" />
            <span className="spectrum-pin" style={{ left: `${score}%` }} aria-hidden="true">
              <span className="spectrum-pin-dot" />
            </span>
          </div>
          <div className="scorecard-spectrum-labels">
            <span>0 Standard</span>
            <span>40 Review</span>
            <span>70 High Attention</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <div className="scorecard-factors-grid" aria-label="Score constituent factors">
        <div className={`factor-item ${windowCompressed ? 'factor-flagged' : 'factor-ok'}`}>
          <div className="factor-top">
            <span className="factor-label">Bid Window</span>
            <span className="factor-pill">{windowCompressed ? 'Short' : 'Normal'}</span>
          </div>
          <strong className="factor-val">{tender.feat_window_days.toFixed(1)} days</strong>
          <small className="factor-sub">{windowCompressed ? 'Under 72h compression' : 'Standard tender period'}</small>
        </div>

        <div className={`factor-item ${highAmendments ? 'factor-flagged' : 'factor-ok'}`}>
          <div className="factor-top">
            <span className="factor-label">Amendments</span>
            <span className="factor-pill">{tender.corrigendum_count > 0 ? `${tender.corrigendum_count} changes` : '0 changes'}</span>
          </div>
          <strong className="factor-val">{tender.corrigendum_count} Corrigend{tender.corrigendum_count === 1 ? 'um' : 'a'}</strong>
          <small className="factor-sub">{highAmendments ? 'Frequent notice churn' : 'Normal amendment level'}</small>
        </div>

        <div className={`factor-item ${highEmd ? 'factor-flagged' : 'factor-ok'}`}>
          <div className="factor-top">
            <span className="factor-label">Bid Security</span>
            <span className="factor-pill">{(tender.feat_emd_ratio * 100).toFixed(1)}%</span>
          </div>
          <strong className="factor-val">{formatIndianCurrency(tender.emd_amount_inr)}</strong>
          <small className="factor-sub">{highEmd ? 'Elevated ratio (>5%)' : 'Standard 2–5% range'}</small>
        </div>

        <div className={`factor-item ${lowBidders ? 'factor-flagged' : 'factor-ok'}`}>
          <div className="factor-top">
            <span className="factor-label">Participation</span>
            <span className="factor-pill">{tender.bids_received !== undefined ? `${tender.bids_received} bids` : 'Notice stage'}</span>
          </div>
          <strong className="factor-val">{tender.bids_received !== undefined ? `${tender.bids_received} bids` : 'Pre-bid'}</strong>
          <small className="factor-sub">{lowBidders ? 'Limited bidder pool' : 'Portal snapshot baseline'}</small>
        </div>
      </div>

      <p className="scorecard-footnote">
        <Info size={13} aria-hidden="true" />
        <span>Context score is CHEIRAP's open public-record signal index, not a legal finding or accusation.</span>
      </p>

      {tender.audit_flags && tender.audit_flags.length > 0 && (
        <div className="scorecard-audit-flags">
          <div className="audit-flags-title">
            <AlertCircle size={13} />
            <span>Audited Statutory Checks ({tender.audit_flags.length})</span>
          </div>
          <ul className="audit-flags-list">
            {tender.audit_flags.map((flag, idx) => (
              <li key={idx} className="audit-flag-row">
                <span className="audit-flag-bullet" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ResponseWindowVisual({ tender, benchmark }: { tender: Tender; benchmark: number }) {
  const maximum = Math.max(tender.feat_window_days, benchmark, 1);
  const currentWidth = clamp((tender.feat_window_days / maximum) * 100, 8, 100);
  const benchmarkWidth = clamp((benchmark / maximum) * 100, 8, 100);
  const delta = tender.feat_window_days - benchmark;
  const deltaLabel = Math.abs(delta) < 0.1
    ? 'Matches the snapshot average'
    : delta < 0
      ? `${Math.abs(delta).toFixed(1)} days shorter than the snapshot average`
      : `${delta.toFixed(1)} days longer than the snapshot average`;

  return (
    <div className="visual-card window-card">
      <div className="visual-card-heading"><div><span className="eyebrow-small">Bid window timeline</span><h3>Time to respond</h3></div><Clock3 size={18} aria-hidden="true" /></div>
      <div className="window-compare">
        <div className="window-compare-row"><span>This tender</span><div className="data-bar"><i style={{ width: `${currentWidth}%` }} /></div><strong>{tender.feat_window_days.toFixed(1)}d</strong></div>
        <div className="window-compare-row"><span>Snapshot avg.</span><div className="data-bar data-bar-muted"><i style={{ width: `${benchmarkWidth}%` }} /></div><strong>{benchmark.toFixed(1)}d</strong></div>
      </div>
      <p className={`visual-callout ${delta < -0.1 ? 'visual-callout-warn' : ''}`}><span aria-hidden="true">{delta < -0.1 ? '!' : 'i'}</span>{deltaLabel}</p>
      <small className="visual-footnote">Average calculated from the embedded public snapshot, not a statutory minimum.</small>
    </div>
  );
}

function SpendScaleVisual({ tender, portfolioValues, department }: { tender: Tender; portfolioValues: number[]; department: string }) {
  const sorted = [...portfolioValues].sort((left, right) => left - right);
  const percentile = sorted.length ? sorted.filter((value) => value <= tender.estimated_value_inr).length / sorted.length : 1;
  const markerPosition = clamp(percentile * 100, 4, 96);
  const tier = percentile >= 0.67 ? 'Upper third' : percentile >= 0.34 ? 'Middle third' : 'Lower third';

  return (
    <div className="visual-card spend-card">
      <div className="visual-card-heading"><div><span className="eyebrow-small">Spend scale distribution</span><h3>Where this sits in the portfolio</h3></div><BarChart3 size={18} aria-hidden="true" /></div>
      <div className="spend-scale" role="img" aria-label={`${formatCrores(tender.estimated_value_inr)} sits in the ${tier.toLowerCase()} of this department snapshot.`}>
        <div className="spend-scale-track"><span className="spend-scale-marker" style={{ left: `${markerPosition}%` }} /></div>
        <div className="spend-scale-labels"><span>Smaller works</span><span>Largest works</span></div>
      </div>
      <div className="spend-scale-result"><strong>{tier}</strong><span>{formatCrores(tender.estimated_value_inr)} · {department} snapshot</span></div>
      <small className="visual-footnote">Relative position across {portfolioValues.length || 0} records in this department, not a live portfolio total.</small>
    </div>
  );
}

function TenderAnatomy({ tender, brief }: { tender: Tender; brief: ReturnType<typeof getTenderBrief> }) {
  const [mode, setMode] = useState<'official' | 'citizen'>('citizen');
  const sourceWording = tender.work_desc || tender.title;
  const citizenTranslation = `${brief.buyer} is seeking bids for ${brief.scope.toLowerCase()} in ${brief.location}. The notice sets the estimated value at ${formatCrores(tender.estimated_value_inr)} and gives eligible suppliers a ${tender.feat_window_days.toFixed(1)}-day response window.`;

  return (
    <section className="detail-section anatomy-section">
      <div className="section-heading-inline"><div><span className="eyebrow-small">Tender anatomy</span><h3>Read the same record in two languages.</h3></div><BookOpen size={16} aria-hidden="true" /></div>
      <div className="decoder-toggle" role="group" aria-label="Choose tender wording view">
        <button type="button" className={mode === 'official' ? 'decoder-toggle-active' : ''} aria-pressed={mode === 'official'} onClick={() => setMode('official')}><FileText size={14} /> Official wording</button>
        <button type="button" className={mode === 'citizen' ? 'decoder-toggle-active' : ''} aria-pressed={mode === 'citizen'} onClick={() => setMode('citizen')}><BookOpen size={14} /> Citizen translation</button>
      </div>
      <div className="decoder-copy"><span className="eyebrow-small">{mode === 'official' ? 'Source wording in this snapshot' : 'Plain-language reading'}</span><p>{mode === 'official' ? sourceWording : citizenTranslation}</p></div>
      <div className="detail-chip-row" aria-label="Tender context highlights">
        {tender.feat_window_compression_hours < 72 && (
          <span className="detail-chip detail-chip-rose">
            <Clock3 size={12} aria-hidden="true" />
            <span>{tender.feat_window_days.toFixed(0)}-day notice</span>
          </span>
        )}
        {tender.corrigendum_count > 0 && (
          <span className="detail-chip detail-chip-amber">
            <FileDiff size={12} aria-hidden="true" />
            <span>{tender.corrigendum_count} amendment{tender.corrigendum_count === 1 ? '' : 's'}</span>
          </span>
        )}
        <span className="detail-chip detail-chip-blue">
          <MapPin size={12} aria-hidden="true" />
          <span>{brief.location}</span>
        </span>
      </div>
    </section>
  );
}

function VisualTimeline({ tender, benchmark }: { tender: Tender; benchmark: number }) {
  const publishToClose = daysBetween(tender.published_date, tender.closing_date);
  const closeToOpen = daysBetween(tender.closing_date, tender.opening_date);

  const snapshotTimestamp = Date.parse('2026-10-24T00:00:00+05:30');
  const closingTimestamp = parseTenderDate(tender.closing_date)?.getTime();
  const openingTimestamp = parseTenderDate(tender.opening_date)?.getTime();
  const isClosed = closingTimestamp !== undefined && closingTimestamp < snapshotTimestamp;
  const isOpened = openingTimestamp !== undefined && openingTimestamp < snapshotTimestamp;

  const milestones = [
    {
      id: 'published',
      label: 'Publication',
      date: formatDate(tender.published_date),
      note: 'Initial notice published',
      state: 'Notice',
      status: 'notice',
      icon: FileText,
    },
    {
      id: 'corrigenda',
      label: tender.corrigendum_count > 0 ? `${tender.corrigendum_count} Corrigend${tender.corrigendum_count === 1 ? 'um' : 'a'}` : '0 Amendments',
      date: tender.corrigendum_count > 0 ? `${tender.corrigendum_count} change${tender.corrigendum_count === 1 ? '' : 's'} recorded` : 'Unamended notice',
      note: tender.corrigendum_count ? 'Corrigenda logged on portal' : 'No changes listed',
      state: 'Corrigenda',
      status: tender.corrigendum_count > 0 ? 'corrigenda' : 'neutral',
      icon: FileDiff,
    },
    {
      id: 'closing',
      label: 'Submission Closes',
      date: formatDate(tender.closing_date),
      note: getClosingLabel(tender),
      state: 'Close',
      status: isClosed ? 'closed' : 'open',
      icon: Clock,
    },
    {
      id: 'opening',
      label: 'Technical Opening',
      date: formatDate(tender.opening_date),
      note: isOpened ? 'Bids evaluated' : 'Bid opening scheduled',
      state: 'Opening',
      status: isOpened ? 'opened' : 'pending',
      icon: CalendarDays,
    },
  ];

  const progressPercent = isOpened ? 100 : isClosed ? 66.67 : tender.corrigendum_count > 0 ? 33.33 : 0;

  const formattedLagInterval = closeToOpen === null
    ? 'Pending schedule'
    : closeToOpen === 0
      ? 'Same-day opening'
      : `${closeToOpen.toFixed(1)} day interval`;

  return (
    <div className="timeline-content-wrap">
      <section className="detail-section visual-timeline-section">
        <div className="section-heading-inline">
          <div>
            <span className="eyebrow-small">Notice flow</span>
            <h3>Publication to opening, at a glance.</h3>
          </div>
          <Clipboard size={16} aria-hidden="true" />
        </div>

        {/* Pixel-perfect continuous timeline stepper */}
        <div className="timeline-stepper-card">
          <div className="timeline-stepper" role="list" aria-label="Tender publication, corrigenda, closing, and opening milestone progression">
            {/* 100% gapless continuous track line spanning from center of node 1 to center of node 4 */}
            <div className="stepper-rail-track" aria-hidden="true">
              <div className="stepper-rail-bg" />
              <div className="stepper-rail-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            {milestones.map((milestone) => (
              <div key={milestone.id} className={`stepper-step stepper-step-${milestone.status}`} role="listitem">
                <div className="stepper-marker-row">
                  <div className={`stepper-circle stepper-circle-${milestone.status}`} aria-hidden="true">
                    <milestone.icon size={16} />
                  </div>
                </div>
                <div className="stepper-content">
                  <span className={`stepper-tag stepper-tag-${milestone.status}`}>{milestone.state}</span>
                  <strong className="stepper-label">{milestone.label}</strong>
                  <span className="stepper-date">{milestone.date}</span>
                  <small className="stepper-note">{milestone.note}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* shadcn Stat Tiles */}
        <div className="timeline-stat-grid" aria-label="Tender timeline performance metrics">
          <div className="timeline-stat-tile">
            <div className="stat-tile-top">
              <span className="stat-tile-label">Response Period</span>
              <span className="stat-tile-icon"><Clock3 size={15} /></span>
            </div>
            <div className="stat-tile-main">
              <strong className="stat-tile-number">{formatDays(publishToClose)}</strong>
              <span className="stat-tile-sub">Publication → closing</span>
            </div>
            <div className="stat-tile-badge-wrap">
              {publishToClose !== null && publishToClose < 10 ? (
                <span className="stat-badge stat-badge-warn">
                  <Clock3 size={11} aria-hidden="true" />
                  <span>Compressed window (&lt;10d)</span>
                </span>
              ) : (
                <span className="stat-badge stat-badge-ok">
                  <Check size={11} aria-hidden="true" />
                  <span>Standard window</span>
                </span>
              )}
            </div>
          </div>

          <div className="timeline-stat-tile">
            <div className="stat-tile-top">
              <span className="stat-tile-label">Opening Lag</span>
              <span className="stat-tile-icon"><CalendarDays size={15} /></span>
            </div>
            <div className="stat-tile-main">
              <strong className="stat-tile-number">{formatDays(closeToOpen)}</strong>
              <span className="stat-tile-sub">Closing → technical opening</span>
            </div>
            <div className="stat-tile-badge-wrap">
              <span className="stat-badge stat-badge-neutral">
                <CalendarDays size={11} aria-hidden="true" />
                <span>{formattedLagInterval}</span>
              </span>
            </div>
          </div>

          <div className="timeline-stat-tile">
            <div className="stat-tile-top">
              <span className="stat-tile-label">State Benchmark</span>
              <span className="stat-tile-icon"><BarChart3 size={15} /></span>
            </div>
            <div className="stat-tile-main">
              <strong className="stat-tile-number">{benchmark.toFixed(1)} days</strong>
              <span className="stat-tile-sub">Comparable Manipur average</span>
            </div>
            <div className="stat-tile-badge-wrap">
              {publishToClose !== null && (
                <span className={`stat-badge ${publishToClose < benchmark ? 'stat-badge-accent' : 'stat-badge-ok'}`}>
                  <BarChart3 size={11} aria-hidden="true" />
                  <span>
                    {publishToClose < benchmark
                      ? `${(benchmark - publishToClose).toFixed(1)}d under state avg`
                      : `${(publishToClose - benchmark).toFixed(1)}d over state avg`}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <ResponseWindowVisual tender={tender} benchmark={benchmark} />
        <p className="method-note"><ShieldCheck size={14} /> Amendment count is visible, but amendment text and exact amendment dates still need to be verified on the official portal.</p>
        <a className="inline-source-link" href={officialSearchUrl} target="_blank" rel="noreferrer"><FileDiff size={14} /> Open official corrigendum history <ExternalLink size={13} /></a>
      </section>
    </div>
  );
}

function PeerComparison({ tender, comparable, awardedName, awardDifference, awardAvailable, onCompare }: { tender: Tender; comparable: Tender[]; awardedName: string; awardDifference: number | null; awardAvailable: boolean; onCompare: (id: string) => void }) {
  const items = [tender, ...comparable].slice(0, 4);
  const maxWindow = Math.max(...items.map((item) => item.feat_window_days), 1);

  return (
    <div className="comparison-content-wrap">
      <section className="detail-section">
        <div className="section-heading-inline"><div><span className="eyebrow-small">Peer comparison</span><h3>How this record compares with similar works.</h3></div><button className="text-action" type="button" onClick={() => onCompare(tender.tender_id)}>Add to compare <ChevronRight size={14} /></button></div>
        <p className="section-helper">Comparable records are selected from the same department where possible. Bars are a reading aid, not a compliance threshold.</p>
        <div className="comparison-list comparison-list-large">{items.map((item, index) => <div className={`comparison-item ${index === 0 ? 'comparison-item-current' : ''}`} key={item.tender_id}><div className="comparison-item-label"><StatusDot tier={item.vigilance_tier} /><span>{index === 0 ? 'This tender' : 'Similar record'}</span></div><strong>{item.feat_window_days.toFixed(1)} days</strong><div className="comparison-bar"><span style={{ width: `${Math.max(10, (item.feat_window_days / maxWindow) * 100)}%` }} /></div><span>{formatCrores(item.estimated_value_inr)}</span></div>)}</div>
      </section>
      <section className="detail-section">
        <div className="section-heading-inline"><div><span className="eyebrow-small">Participation & award</span><h3>What is available after the notice?</h3></div><Users size={16} aria-hidden="true" /></div>
        {awardAvailable ? (
          <>
            <div className="award-grid">
              <div><span>Bids recorded</span><strong>{tender.bids_received ?? 'Not listed'}</strong></div>
              <div><span>Qualified bidders</span><strong>{tender.qualified_bidders ?? 'Not listed'}</strong></div>
              <div>
                <span>{tender.status === 'AWARDED' || tender.status === 'Closed' ? 'Awarded value' : 'Evaluated / L1 value'}</span>
                <strong>{tender.awarded_value_inr ? formatCrores(tender.awarded_value_inr) : 'Not listed'}</strong>
              </div>
              <div>
                <span>{tender.status === 'AWARDED' || tender.status === 'Closed' ? 'Awarded contractor' : 'Provisional / L1 firm'}</span>
                <strong>{awardedName || 'Not listed'}</strong>
              </div>
              <div><span>Award vs estimate</span><strong>{awardDifference === null ? 'Not listed' : `${awardDifference > 0 ? '+' : ''}${awardDifference.toFixed(2)}%`}</strong></div>
              <div><span>Record status</span><strong>{tender.status}</strong></div>
            </div>
            {tender.status !== 'AWARDED' && tender.status !== 'Closed' && (
              <p className="method-note">
                <ClipboardCheck size={14} /> <strong>Pre-Award Stage:</strong> The recorded firm and value reflect the provisional L1 bidder evaluated before contract execution.
              </p>
            )}
            <p className="method-note"><ClipboardCheck size={14} /> Participation and award fields come from the embedded snapshot when present. Confirm the original award notice before drawing conclusions.</p>
          </>
        ) : (
          <div className="feature-empty"><AlertCircle size={18} /><div><strong>Award details are not connected for this record.</strong><p>CHEIRAP can show the pre-award notice now. A later award-of-contract record must be verified separately on the official portal.</p></div></div>
        )}
      </section>
    </div>
  );
}

type InquiryType = 'timeline' | 'specification' | 'participation';

function CitizenInquiryGenerator({ tender, brief, onMessage }: { tender: Tender; brief: ReturnType<typeof getTenderBrief>; onMessage: (message: string) => void }) {
  const [inquiryType, setInquiryType] = useState<InquiryType>('timeline');
  const [copied, setCopied] = useState(false);
  const inquiry = useMemo(() => {
    const sourceLine = `Source: ${officialSearchUrl} · Tender ID: ${tender.tender_id}`;
    if (inquiryType === 'specification') return `Subject: Clarification requested on ${tender.tender_id}\n\nDear Sir/Madam,\n\nI am seeking a public clarification on the scope and eligibility requirements for “${tender.title}”. Could you please confirm what work is included, which qualification documents apply, and where the complete specification or BOQ can be reviewed?\n\n${sourceLine}\n\nThank you.`;
    if (inquiryType === 'participation') return `Subject: Request for participation and award information for ${tender.tender_id}\n\nDear Sir/Madam,\n\nCould you please share the published participation and award information for “${tender.title}”, including the number of bids received, qualified bidders, selected contractor, and awarded value if available?\n\n${sourceLine}\n\nThank you.`;
    return `Subject: Clarification requested on the tender timeline for ${tender.tender_id}\n\nDear Sir/Madam,\n\nCould you please clarify the publication, closing, and opening timeline for “${tender.title}”? The public snapshot shows a ${tender.feat_window_days.toFixed(1)}-day response window and ${tender.corrigendum_count} recorded amendment${tender.corrigendum_count === 1 ? '' : 's'}. Please share the relevant amendment notices and confirm whether the closing date was extended.\n\n${sourceLine}\n\nThank you.`;
  }, [inquiryType, tender]);

  const copyInquiry = async () => {
    try {
      await navigator.clipboard.writeText(inquiry);
      setCopied(true);
      onMessage('Source-cited citizen inquiry copied. Review it before sending.');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      onMessage('Copy was not available in this browser.');
    }
  };

  return (
    <section className="citizen-action-card inquiry-card">
      <div className="citizen-action-heading"><span className="action-icon"><MessageSquare size={18} /></span><div><span className="eyebrow-small">Citizen inquiry generator</span><h3>Turn a reading into a respectful question.</h3><p>Choose a question type to create a source-cited draft. It stays in your clipboard until you decide what to do next.</p></div></div>
      <div className="inquiry-type-grid" role="group" aria-label="Citizen inquiry type"><button type="button" className={inquiryType === 'timeline' ? 'inquiry-type-active' : ''} aria-pressed={inquiryType === 'timeline'} onClick={() => setInquiryType('timeline')}><Clock3 size={15} /><span>Timeline inquiry</span></button><button type="button" className={inquiryType === 'specification' ? 'inquiry-type-active' : ''} aria-pressed={inquiryType === 'specification'} onClick={() => setInquiryType('specification')}><FileText size={15} /><span>Specification clarification</span></button><button type="button" className={inquiryType === 'participation' ? 'inquiry-type-active' : ''} aria-pressed={inquiryType === 'participation'} onClick={() => setInquiryType('participation')}><Users size={15} /><span>Participation query</span></button></div>
      <textarea className="inquiry-preview" value={inquiry} readOnly aria-label="Generated citizen inquiry" />
      <button className="primary-button" type="button" onClick={copyInquiry}><ClipboardCheck size={16} /> {copied ? 'Inquiry copied' : 'Copy source-cited inquiry'}</button>
      <p className="section-helper">{brief.buyer} remains the source of record. CHEIRAP does not send messages or represent you.</p>
    </section>
  );
}

/* function LegacyTenderDetail({
  tender,
  watched,
  onClose,
  onWatch,
  onCompare,
  note,
  onSaveNote,
  onSaveCorrection,
}: {
  tender: Tender;
  watched: boolean;
  onClose: () => void;
  onWatch: (id: string) => void;
  onCompare: (id: string) => void;
  note: string;
  onSaveNote: (id: string, value: string) => void;
  onSaveCorrection: (payload: { tenderId: string; field: string; correction: string; source: string }) => void;
}) {
  const signal = getSignal(tender);
  const brief = getTenderBrief(tender);
  const briefProjectType = brief.projectType.toLowerCase();
  const briefProjectArticle = /^[aeiou]/.test(briefProjectType) ? 'an' : 'a';
  const comparable = getComparableTenders(tender);
  const [copied, setCopied] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionField, setCorrectionField] = useState('Scope or project description');
  const [correctionText, setCorrectionText] = useState('');
  const [correctionSource, setCorrectionSource] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const copyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}?tender=${encodeURIComponent(tender.tender_id)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const copyBrief = async () => {
    const text = [
      `CHEIRAP tender brief: ${tender.title}`,
      `${brief.buyer} · ${brief.location} · ${formatCrores(tender.estimated_value_inr)}`,
      ...brief.summaryParagraphs,
      `Official tender ID: ${tender.tender_id}`,
      `Official source: ${officialSearchUrl}`,
    ].join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBrief(true);
      window.setTimeout(() => setCopiedBrief(false), 1800);
    } catch {
      setCopiedBrief(false);
    }
  };

  const copyQuestionBrief = async () => {
    const text = [
      `Public question brief for ${tender.title}`,
      `Tender ID: ${tender.tender_id}`,
      `Source: ${officialSearchUrl}`,
      '',
      'What the snapshot says:',
      ...brief.summaryParagraphs.map((paragraph) => `- ${paragraph}`),
      '',
      'Questions to verify against the official record:',
      ...brief.keyQuestions.map((question) => `- ${question}`),
      '',
      'CHEIRAP note: this is a source-led reading aid, not a legal complaint or finding.',
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setActionMessage('Question brief copied. Review it and add the official documents before sharing.');
    } catch {
      setActionMessage('Copy was not available in this browser.');
    }
  };

  const submitCorrection = () => {
    if (!correctionText.trim()) return;
    onSaveCorrection({ tenderId: tender.tender_id, field: correctionField, correction: correctionText.trim(), source: correctionSource.trim() });
    setCorrectionText('');
    setCorrectionSource('');
    setCorrectionOpen(false);
    setActionMessage('Correction saved locally as a draft. It has not been sent to the government portal.');
  };

  const awardedName = getAwardedName(tender);
  const awardDifference = getAwardDifference(tender);
  const awardAvailable = Boolean(awardedName || tender.awarded_value_inr || tender.bids_received !== undefined || /award/i.test(tender.status));
  const orgChain = tender.org_chain?.replace(/\|+/g, ' → ') || 'Not listed';

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="tender-detail-title">
        <div className="detail-header">
          <div>
            <DataStatus compact />
            <p className="detail-kicker">Tender transparency brief</p>
            <h2 id="tender-detail-title">{tender.title}</h2>
            <p className="detail-id-line">{tender.tender_id} · {brief.projectType}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close tender details"><X size={20} /></button>
        </div>

        <div className="detail-content">
          <section className="detail-intro">
            <div className="detail-signal-row">
              <span className={`signal-label ${getSignalTone(signal.tone)}`}>{signal.label}</span>
              <span className="neutral-tag">{tender.status}</span>
              <span className="neutral-tag">{getClosingLabel(tender)}</span>
            </div>
            <div className="brief-lede"><BookOpen size={19} /><div><span className="eyebrow-small">Read this first</span><strong>{brief.buyer} is planning {briefProjectArticle} {briefProjectType} project.</strong><p>{brief.scope} · {brief.location}</p></div></div>
            <div className="brief-paragraphs">{brief.summaryParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <div className="detail-actions">
              <button className="primary-button" onClick={() => onWatch(tender.tender_id)}><Bookmark size={16} fill={watched ? 'currentColor' : 'none'} /> {watched ? 'Saved' : 'Save tender'}</button>
              <button className="secondary-button" onClick={copyLink}>{copied ? <Check size={16} className="animate-rise" /> : <Share2 size={16} />} {copied ? 'Link copied' : 'Share brief'}</button>
              <button className="secondary-button" onClick={copyBrief}>{copiedBrief ? <Check size={16} className="animate-rise" /> : <FileDown size={16} />} {copiedBrief ? 'Brief copied' : 'Copy plain-language brief'}</button>
              <button className="secondary-button" onClick={() => window.print()}><Printer size={16} /> Print / save PDF</button>
            </div>
          </section>

          <section className="detail-stat-grid detail-stat-grid-wide" aria-label="Tender facts">
            <div><span>Estimated value</span><strong>{formatCrores(tender.estimated_value_inr)}</strong></div>
            <div><span>Who is buying</span><strong>{brief.buyer}</strong></div>
            <div><span>Where</span><strong>{brief.location}</strong></div>
            <div><span>Published</span><strong>{formatDate(tender.published_date)}</strong></div>
            <div><span>Closing date</span><strong>{formatDate(tender.closing_date)}</strong></div>
            <div><span>Bid window</span><strong>{tender.feat_window_days > 0 ? `${tender.feat_window_days.toFixed(1)} days` : 'Not listed'}</strong></div>
            <div><span>Bid security</span><strong>{formatIndianCurrency(tender.emd_amount_inr)}</strong></div>
            <div><span>Tender fee</span><strong>{formatIndianCurrency(tender.tender_fee_inr)}</strong></div>
          </section>

          <section className="detail-section understand-section">
            <div className="section-heading-inline"><h3>What this project means</h3><HelpCircle size={16} /></div>
            <div className="understand-grid">
              <div><span className="understand-icon"><FileText size={16} /></span><strong>What is being procured?</strong><p>{brief.scope}</p></div>
              <div><span className="understand-icon"><Network size={16} /></span><strong>Who is responsible?</strong><p>{brief.buyer}. The recorded chain is {orgChain}.</p></div>
              <div><span className="understand-icon"><MapPin size={16} /></span><strong>Where will it happen?</strong><p>{brief.location}{tender.pincode ? ` · PIN ${tender.pincode}` : ''}.</p></div>
              <div><span className="understand-icon"><WalletCards size={16} /></span><strong>What do the money figures mean?</strong><p>The estimate is the planned value. Bid security and the tender fee are listed entry conditions in the notice.</p></div>
              <div><span className="understand-icon"><CalendarDays size={16} /></span><strong>What is the timetable?</strong><p>Published {formatDate(tender.published_date)}, closes {formatDate(tender.closing_date)}, and opens {formatDate(tender.opening_date)}.</p></div>
              <div><span className="understand-icon"><Flag size={16} /></span><strong>What should a reader verify?</strong><p>Scope, eligibility, amendments, deadline, and any later award notice on the official portal.</p></div>
            </div>
          </section>

          <section className="detail-section">
            <div className="section-heading-inline"><h3>Why it is highlighted</h3><Info size={16} /></div>
            <div className="signal-explanation">
              <div className={`signal-icon ${getSignalTone(signal.tone)}`}><Sparkles size={17} /></div>
              <div><strong>{signal.label}</strong><p>{signal.detail} This is a public-interest signal for context, not a finding of wrongdoing.</p></div>
            </div>
            <div className="detail-mini-grid">
              <div><span>Bidding window</span><strong>{tender.feat_window_days.toFixed(1)} days</strong></div>
              <div><span>Changes recorded</span><strong>{tender.corrigendum_count}</strong></div>
              <div><span>Bid-security ratio</span><strong>{(tender.feat_emd_ratio * 100).toFixed(2)}%</strong></div>
              <div><span>Bidders recorded</span><strong>{tender.bids_received ?? 'Not listed'}</strong></div>
            </div>
            <p className="method-note"><ShieldCheck size={14} /> The comparison benchmark is a reading aid. It is not a legal threshold or a conclusion about the tender.</p>
          </section>

          <section className="detail-section">
            <div className="section-heading-inline"><h3>Participation and award snapshot</h3><Users size={16} /></div>
            {awardAvailable ? (
              <>
                <div className="award-grid">
                  <div><span>Bids recorded</span><strong>{tender.bids_received ?? 'Not listed'}</strong></div>
                  <div><span>Qualified bidders</span><strong>{tender.qualified_bidders ?? 'Not listed'}</strong></div>
                  <div><span>Awarded value</span><strong>{tender.awarded_value_inr ? formatCrores(tender.awarded_value_inr) : 'Not listed'}</strong></div>
                  <div><span>Selected firm</span><strong>{awardedName || 'Not listed'}</strong></div>
                  <div><span>Award vs estimate</span><strong>{awardDifference === null ? 'Not listed' : `${awardDifference > 0 ? '+' : ''}${awardDifference.toFixed(2)}%`}</strong></div>
                  <div><span>Record status</span><strong>{tender.status}</strong></div>
                </div>
                <p className="method-note"><ClipboardCheck size={14} /> Participation and award fields come from the embedded snapshot when present. Confirm the original award notice before drawing conclusions.</p>
              </>
            ) : (
              <div className="feature-empty"><AlertCircle size={18} /><div><strong>Award details are not connected for this record.</strong><p>CHEIRAP can show the pre-award notice now. A later award-of-contract record must be verified separately on the official portal.</p></div></div>
            )}
          </section>

          <section className="detail-section">
            <div className="section-heading-inline"><h3>What is connected to this record?</h3><Layers3 size={16} /></div>
            <div className="coverage-grid">{brief.coverage.map((item) => <div className={`coverage-item coverage-${item.status}`} key={item.label}><span>{item.status === 'available' ? <CheckCircle2 size={15} /> : item.status === 'partial' ? <AlertCircle size={15} /> : <FileText size={15} />}</span><div><strong>{item.label}</strong><small>{item.status === 'available' ? 'Available in snapshot' : item.status === 'partial' ? 'Partial coverage' : 'Not connected'}</small><p>{item.detail}</p></div></div>)}</div>
          </section>

          <section className="detail-section">
            <div className="section-heading-inline"><h3>Compare with similar tenders</h3><button className="text-action" onClick={() => onCompare(tender.tender_id)}>Add to compare <ChevronRight size={14} /></button></div>
            <div className="comparison-list">
              {[tender, ...comparable].slice(0, 4).map((item, index) => (
                <div className={`comparison-item ${index === 0 ? 'comparison-item-current' : ''}`} key={item.tender_id}>
                  <div className="comparison-item-label"><StatusDot tier={item.vigilance_tier} /><span>{index === 0 ? 'This tender' : 'Similar record'}</span></div>
                  <strong>{item.feat_window_days.toFixed(1)} days</strong>
                  <div className="comparison-bar"><span style={{ width: `${Math.min(100, Math.max(10, item.feat_window_days / 30 * 100))}%` }} /></div>
                  <span>{formatCrores(item.estimated_value_inr)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <div className="section-heading-inline"><h3>Notice timeline</h3><Clipboard size={16} /></div>
            <div className="timeline" aria-label="Tender notice timeline">
              <div className="timeline-event"><span className="timeline-marker" aria-hidden="true" /><div className="timeline-content"><div className="timeline-heading"><strong>Published</strong><span className="timeline-state">Notice</span></div><span className="timeline-date">{formatDate(tender.published_date)}</span></div></div>
              <div className="timeline-event"><span className="timeline-marker" aria-hidden="true" /><div className="timeline-content"><div className="timeline-heading"><strong>{tender.corrigendum_count} changes recorded</strong><span className="timeline-state">Amendments</span></div><span className="timeline-note">{tender.corrigendum_count ? 'The count is available; the amendment text is not embedded in this snapshot.' : 'No amendment is listed in this snapshot.'}</span></div></div>
              <div className="timeline-event"><span className="timeline-marker" aria-hidden="true" /><div className="timeline-content"><div className="timeline-heading"><strong>Submission closes</strong><span className="timeline-state timeline-state-closed">{getClosingLabel(tender)}</span></div><span className="timeline-date">{formatDate(tender.closing_date)}</span></div></div>
              <div className="timeline-event timeline-event-last"><span className="timeline-marker" aria-hidden="true" /><div className="timeline-content"><div className="timeline-heading"><strong>Technical bid opening</strong><span className="timeline-state">Opening</span></div><span className="timeline-date">{formatDate(tender.opening_date)}</span></div></div>
            </div>
            <a className="inline-source-link" href={officialSearchUrl} target="_blank" rel="noreferrer"><FileDiff size={14} /> Open official corrigendum history <ExternalLink size={13} /></a>
          </section>

          <section className="detail-section detail-notes-section">
            <div className="section-heading-inline"><h3>Private reading note</h3><NotebookPen size={16} /></div>
            <p className="section-helper">Save a reminder for yourself. Notes stay in this browser and are not sent to CHEIRAP or the government portal.</p>
            <textarea className="note-input" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="What do you want to remember about this tender?" aria-label="Private reading note" />
            <div className="note-actions"><button className="secondary-button" onClick={() => { onSaveNote(tender.tender_id, noteDraft); setActionMessage('Private note saved in this browser.'); }}><NotebookPen size={15} /> Save note</button><span>{noteDraft.length}/500</span></div>
          </section>

          <section className="citizen-action-card">
            <div className="citizen-action-heading"><span className="action-icon"><MessageSquare size={18} /></span><div><span className="eyebrow-small">Citizen reading tools</span><h3>Turn the record into a better question.</h3><p>Use the facts and source link to ask for context without making an unsupported accusation.</p></div></div>
            <ol className="citizen-checklist"><li>Read the scope and eligibility clauses in the official notice.</li><li>Check every corrigendum and the final closing date.</li><li>Look for the award and participation record when it is published.</li></ol>
            <div className="detail-actions"><button className="primary-button" onClick={copyQuestionBrief}><MessageSquare size={16} /> Copy source-led question brief</button><button className="secondary-button" onClick={() => setCorrectionOpen((open) => !open)}><Flag size={16} /> {correctionOpen ? 'Close correction form' : 'Suggest a correction'}</button></div>
            {correctionOpen && <div className="correction-form"><label>Field<select value={correctionField} onChange={(event) => setCorrectionField(event.target.value)}><option>Scope or project description</option><option>Location or district</option><option>Value, fee, or bid security</option><option>Dates or corrigendum count</option><option>Status or award information</option><option>Source link or identifier</option></select></label><label>What should be corrected?<textarea value={correctionText} onChange={(event) => setCorrectionText(event.target.value)} placeholder="Describe the correction clearly." /></label><label>Supporting source link (optional)<input type="url" inputMode="url" value={correctionSource} onChange={(event) => setCorrectionSource(event.target.value)} placeholder="https://..." /></label><button className="secondary-button" onClick={submitCorrection} disabled={!correctionText.trim()}><Check size={15} /> Save correction draft</button></div>}
            {actionMessage && <p className="action-message" role="status">{actionMessage}</p>}
          </section>

          <section className="source-card">
            <div className="source-card-icon"><Globe2 size={19} /></div>
            <div><span className="eyebrow-small">Verify the official record</span><h3>Government of Manipur e-Procurement Portal</h3><p>CHEIRAP presents a structured snapshot of public portal information. Always verify the original notice before relying on it.</p><div className="source-meta"><span>ID {tender.tender_id}</span><span>Ref {tender.ref_no}</span><span>Snapshot {snapshotMeta.shortSnapshotDate}</span></div></div>
            <a className="source-link" href={officialSearchUrl} target="_blank" rel="noreferrer">Open official portal <ExternalLink size={15} /></a>
          </section>
        </div>
      </aside>
    </div>
  );
}

*/

const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
};

function TenderDetail({
  tender,
  watched,
  onClose,
  onWatch,
  onCompare,
  note,
  onSaveNote,
  onSaveCorrection,
  onNavigate,
}: {
  tender: Tender;
  watched: boolean;
  onClose: () => void;
  onWatch: (id: string) => void;
  onCompare: (id: string) => void;
  note: string;
  onSaveNote: (id: string, value: string) => void;
  onSaveCorrection: (payload: { tenderId: string; field: string; correction: string; source: string }) => void;
  onNavigate?: (page: 'home' | 'explore') => void;
}) {
  const signal = getSignal(tender);
  const brief = getTenderBrief(tender);
  const departmentName = getSimpleDepartment(tender.department);
  const comparable = getComparableTenders(tender);
  const benchmark = allTenders.reduce((sum, item) => sum + item.feat_window_days, 0) / Math.max(allTenders.length, 1);
  const portfolioValues = allTenders.filter((item) => getSimpleDepartment(item.department) === departmentName).map((item) => item.estimated_value_inr);
  const [activeTab, setActiveTab] = useState<DetailTabId>('brief');
  const [copied, setCopied] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionField, setCorrectionField] = useState('Scope or project description');
  const [correctionText, setCorrectionText] = useState('');
  const [correctionSource, setCorrectionSource] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const [generatedDateLabel] = useState(() => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));

  const copyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}?tender=${encodeURIComponent(tender.tender_id)}`;
    const success = await safeCopyToClipboard(link);
    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      setActionMessage('Copy was not available in this browser.');
    }
  };

  const copyBrief = async () => {
    const text = [
      `CHEIRAP tender brief: ${tender.title}`,
      `${brief.buyer} · ${brief.location} · ${formatCrores(tender.estimated_value_inr)}`,
      brief.summaryParagraphs[0],
      `Context signal: ${signal.label} — ${signal.detail}`,
      `Official tender ID: ${tender.tender_id}`,
      `Official source: ${officialSearchUrl}`,
    ].join('\n\n');
    const success = await safeCopyToClipboard(text);
    if (success) {
      setCopiedBrief(true);
      window.setTimeout(() => setCopiedBrief(false), 1800);
    } else {
      setActionMessage('Copy was not available in this browser.');
    }
  };

  const copyQuestionBrief = async () => {
    const text = [
      `Public question brief for ${tender.title}`,
      `Tender ID: ${tender.tender_id}`,
      `Source: ${officialSearchUrl}`,
      '',
      'What the snapshot says:',
      ...brief.summaryParagraphs.map((paragraph) => `- ${paragraph}`),
      '',
      'Questions to verify against the official record:',
      ...brief.keyQuestions.map((question) => `- ${question}`),
      '',
      'CHEIRAP note: this is a source-led reading aid, not a legal complaint or finding.',
    ].join('\n');
    const success = await safeCopyToClipboard(text);
    if (success) {
      setActionMessage('Question brief copied. Review it and add the official documents before sharing.');
    } else {
      setActionMessage('Copy was not available in this browser.');
    }
  };

  const submitCorrection = () => {
    if (!correctionText.trim()) return;
    onSaveCorrection({ tenderId: tender.tender_id, field: correctionField, correction: correctionText.trim(), source: correctionSource.trim() });
    setCorrectionText('');
    setCorrectionSource('');
    setCorrectionOpen(false);
    setActionMessage('Correction saved locally as a draft. It has not been sent to the government portal.');
  };

  const awardedName = getAwardedName(tender);
  const awardDifference = getAwardDifference(tender);
  const awardAvailable = Boolean(awardedName || tender.awarded_value_inr || tender.bids_received !== undefined || /award/i.test(tender.status));
  const orgChain = tender.org_chain?.replace(/\|+/g, ' → ') || 'Not listed';
  const briefProjectType = brief.projectType.toLowerCase();
  const briefProjectArticle = /^[aeiou]/.test(briefProjectType) ? 'an' : 'a';

  const tenderRootRef = useRef<HTMLDivElement>(null);

  // GSAP: Tender Mount & Header / Stats Reveal with Ticker Counters
  useEffect(() => {
    const root = tenderRootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const navBar = root.querySelector<HTMLElement>('.tender-nav-bar');
      const hero = root.querySelector<HTMLElement>('.tender-hero-header');
      const pills = root.querySelectorAll<HTMLElement>('.tender-meta-pill');
      const actions = root.querySelector<HTMLElement>('.tender-hero-actions');
      const statCards = root.querySelectorAll<HTMLElement>('.tender-stat-card');
      const tabsBar = root.querySelector<HTMLElement>('.tender-tabs-bar');

      if (navBar) tl.fromTo(navBar, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.35, clearProps: 'opacity,transform' });
      if (hero) tl.fromTo(hero, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.42, clearProps: 'opacity,transform' }, '-=0.2');
      if (pills.length) tl.fromTo(pills, { opacity: 0, scale: 0.93 }, { opacity: 1, scale: 1, stagger: 0.03, duration: 0.28, clearProps: 'opacity,transform' }, '-=0.25');
      if (actions) tl.fromTo(actions, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.32, clearProps: 'opacity,transform' }, '-=0.2');
      if (statCards.length) {
        tl.fromTo(statCards, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.38, clearProps: 'opacity,transform' }, '-=0.2');
        // Animate counter values
        statCards.forEach((card) => {
          const numEl = card.querySelector<HTMLElement>('.stat-num');
          if (numEl) {
            const text = numEl.textContent || '';
            const match = text.match(/[\d,.]+/);
            if (match) {
              const rawNum = parseFloat(match[0].replace(/,/g, ''));
              if (!isNaN(rawNum) && rawNum > 0) {
                const prefix = text.slice(0, match.index);
                const suffix = text.slice((match.index || 0) + match[0].length);
                const isDecimal = match[0].includes('.');
                const decimalPlaces = isDecimal ? match[0].split('.')[1].length : 0;
                const counter = { val: 0 };
                gsap.to(counter, {
                  val: rawNum,
                  duration: 0.9,
                  ease: 'power2.out',
                  delay: 0.15,
                  onUpdate: () => {
                    numEl.textContent = `${prefix}${isDecimal ? counter.val.toFixed(decimalPlaces) : Math.round(counter.val).toLocaleString('en-IN')}${suffix}`;
                  },
                  onComplete: () => {
                    numEl.textContent = text;
                  },
                });
              }
            }
          }
        });
      }
      if (tabsBar) tl.fromTo(tabsBar, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, clearProps: 'opacity,transform' }, '-=0.15');
    }, root);

    return () => ctx.revert();
  }, [tender.tender_id]);

  // GSAP: Sub-tab switching transitions & specific tab animations
  useEffect(() => {
    const root = tenderRootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const panel = root.querySelector<HTMLElement>('.tender-tab-panel-wide');
      if (panel) {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform' }
        );

        if (activeTab === 'brief') {
          const cards = panel.querySelectorAll<HTMLElement>('.brief-takeaway-card, .gepnic-teaser-card, .understand-grid > div');
          if (cards.length) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.38, stagger: 0.05, ease: 'power2.out', clearProps: 'transform' }
            );
          }
          // Animate response timeline bar
          const timeBar = panel.querySelector<HTMLElement>('.time-bar-current');
          if (timeBar) {
            const width = timeBar.style.width || '100%';
            gsap.fromTo(timeBar, { width: '0%' }, { width, duration: 0.85, ease: 'power2.out', delay: 0.1 });
          }
        } else if (activeTab === 'timeline') {
          const milestones = panel.querySelectorAll<HTMLElement>('.timeline-node-card, .timeline-milestone');
          if (milestones.length) {
            gsap.fromTo(
              milestones,
              { opacity: 0, scale: 0.88, y: 10 },
              { opacity: 1, scale: 1, y: 0, duration: 0.42, stagger: 0.08, ease: 'back.out(1.4)', clearProps: 'transform' }
            );
          }
        } else if (activeTab === 'comparison') {
          const bars = panel.querySelectorAll<HTMLElement>('.comparison-bar span');
          bars.forEach((bar) => {
            const target = bar.style.width || '100%';
            gsap.fromTo(bar, { width: '0%' }, { width: target, duration: 0.8, ease: 'power2.out', delay: 0.08 });
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div ref={tenderRootRef} className="tender-window-root" role="region" aria-labelledby="tender-detail-title">
      {/* Dedicated Citizen Brief Print Header (rendered in @media print) */}
      <div className="print-only print-header-banner" aria-hidden="true">
        <div className="print-header-top">
          <div className="print-emblem-wrap">
            <img src="/manipur_emblem_gold.png" alt="Government of Manipur emblem" />
            <div>
              <h2>CHEIRAP · CITIZEN TENDER VERIFICATION BRIEF</h2>
              <p>Public procurement snapshot assembled for citizen transparency and accountability</p>
            </div>
          </div>
          <div className="print-header-meta">
            <div><span>Snapshot:</span> <strong>{snapshotMeta.shortSnapshotDate}</strong></div>
            <div><span>Tender ID:</span> <strong>{tender.tender_id}</strong></div>
            <div><span>Generated:</span> <strong>{generatedDateLabel}</strong></div>
          </div>
        </div>
        <div className="print-header-divider" />
      </div>

      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="tender-nav-bar">
        <div className="tender-nav-left">
          <button className="tender-back-btn" onClick={() => { onClose(); onNavigate?.('explore'); }} aria-label="Back to explore">
            <ArrowLeft size={16} />
            <span>Back to explore</span>
            <kbd className="tender-kbd">Esc</kbd>
          </button>
          <div className="tender-breadcrumbs" aria-label="Breadcrumb navigation">
            <button className="breadcrumb-link" onClick={() => onNavigate?.('home')}>CHEIRAP</button>
            <ChevronRight size={13} className="breadcrumb-separator" />
            <button className="breadcrumb-link" onClick={() => onNavigate?.('explore')}>Explore tenders</button>
            <ChevronRight size={13} className="breadcrumb-separator" />
            <span className="breadcrumb-active">{tender.tender_id}</span>
          </div>
        </div>

        <div className="tender-nav-right">
          <button
            className="secondary-button tender-btn-new-window"
            onClick={() => window.open(`?tender=${encodeURIComponent(tender.tender_id)}`, '_blank')}
            title="Open tender analysis in a separate browser window"
          >
            <ExternalLink size={14} />
            <span>Open in separate window</span>
          </button>
          <button
            className={`secondary-button ${watched ? 'btn-saved-active' : ''}`}
            onClick={() => onWatch(tender.tender_id)}
          >
            <Bookmark size={15} fill={watched ? 'currentColor' : 'none'} />
            <span>{watched ? 'Saved to list' : 'Save tender'}</span>
          </button>
          <button className="secondary-button" onClick={copyLink}>
            {copied ? <Check size={15} /> : <Share2 size={15} />}
            <span>{copied ? 'Link copied' : 'Share brief'}</span>
          </button>
          <button className="secondary-button" onClick={() => window.print()}>
            <Printer size={15} />
            <span>Print / save PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <section className="tender-hero-header">
        <div className="tender-hero-top">
          <span className="eyebrow">CHEIRAP · TENDER ANALYSIS & CITIZEN BRIEF</span>
          <DataStatus compact />
        </div>

        <h1 id="tender-detail-title" className="tender-hero-title">{tender.title}</h1>

        <p className="tender-hero-kicker">
          Official Tender ID: <span className="font-mono">{tender.tender_id}</span> · Published by {brief.buyer} · Categorized as {brief.projectType}
        </p>

        {/* Metadata Badges Strip */}
        <div className="tender-hero-meta-strip" aria-label="Tender core details">
          <span className="tender-meta-pill pill-dept">
            <Building2 size={14} />
            <span>{departmentName}</span>
          </span>
          <span className="tender-meta-pill pill-location">
            <MapPin size={14} />
            <span>{getLocationLabel(tender.location)}</span>
          </span>
          <span className="tender-meta-pill pill-window">
            <Clock3 size={14} />
            <span>
              {tender.feat_window_days.toFixed(1)} days ({getClosingLabel(tender)})
              {tender.feat_window_compression_hours < 72 && (
                <span className="window-compressed-hint"> · {tender.feat_window_compression_hours.toFixed(1)}h post-corrigendum</span>
              )}
            </span>
          </span>
          <span className="tender-meta-pill pill-amendments">
            <FileDiff size={14} />
            <span>{tender.corrigendum_count} Corrigend{tender.corrigendum_count === 1 ? 'um' : 'a'}</span>
          </span>
          <span className="tender-meta-pill pill-value">
            <strong>{formatCrores(tender.estimated_value_inr)}</strong>
          </span>
          <span className={`context-score-chip context-score-${(tender.vigilance_tier || 'GREEN').toLowerCase()}`}>
            <ShieldCheck size={13} />
            <span>Score {Math.round(tender.cheirap_risk_score)}/100 · {signal.label}</span>
          </span>
          <span className="neutral-tag">{tender.status}</span>
        </div>

        {/* Hero Actions */}
        <div className="tender-hero-actions">
          <button className="primary-button" onClick={() => onWatch(tender.tender_id)}>
            <Bookmark size={15} fill={watched ? 'currentColor' : 'none'} />
            {watched ? 'Saved to reading list' : 'Save tender'}
          </button>
          <button className="secondary-button" onClick={copyBrief}>
            {copiedBrief ? <Check size={15} /> : <FileDown size={15} />}
            {copiedBrief ? 'Brief copied to clipboard' : 'Copy citizen brief text'}
          </button>
          <button className="secondary-button" onClick={copyQuestionBrief}>
            <MessageSquare size={15} />
            Copy public question brief
          </button>
          <a className="secondary-button tender-official-portal-btn" href={officialSearchUrl} target="_blank" rel="noreferrer">
            <span>Verify on official portal</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* 4-Stat Metric Strip */}
      <div className="tender-quick-stats" aria-label="Key tender indicators">
        <div className="tender-stat-card">
          <span className="stat-label">Estimated Value</span>
          <strong className="stat-num">{formatCrores(tender.estimated_value_inr)}</strong>
          <small className="stat-hint">Notice planned expenditure</small>
        </div>
        <div className="tender-stat-card">
          <span className="stat-label">Response Window</span>
          <strong className="stat-num">{tender.feat_window_days.toFixed(1)} days</strong>
          <small className="stat-hint">Publication to closing deadline</small>
        </div>
        <div className="tender-stat-card">
          <span className="stat-label">Notice Amendments</span>
          <strong className="stat-num">{tender.corrigendum_count} Corrigend{tender.corrigendum_count === 1 ? 'um' : 'a'}</strong>
          <small className="stat-hint">{tender.bids_received !== undefined ? `${tender.bids_received} bids recorded` : 'Pre-bid / notice stage'}</small>
        </div>
        <div className="tender-stat-card">
          <span className="stat-label">Bid Security (EMD)</span>
          <strong className="stat-num">{formatIndianCurrency(tender.emd_amount_inr)}</strong>
          <small className="stat-hint">{(tender.feat_emd_ratio * 100).toFixed(1)}% of planned estimate</small>
        </div>
      </div>

      {/* Section Tabs Navigation Bar */}
      <DetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="tender-window-content">
        {activeTab === 'brief' && (
          <div className="detail-tab-panel tender-tab-panel-wide" id="tender-panel-brief" role="tabpanel" aria-labelledby="tender-tab-brief" tabIndex={0}>
            <div className="executive-brief-grid">
              {/* Left Main Column */}
              <div className="executive-brief-main">
                {/* Executive Takeaway Card */}
                <div className="brief-takeaway-card">
                  <div className="takeaway-badge-row">
                    <span className="eyebrow-small"><BookOpen size={13} /> Executive Takeaway</span>
                    <span className={`signal-label ${getSignalTone(signal.tone)}`}>{signal.label}</span>
                  </div>
                  <h3 className="brief-takeaway-title">
                    {brief.buyer} is planning {briefProjectArticle} {briefProjectType} project.
                  </h3>
                  <p className="brief-takeaway-scope">
                    <strong>Scope:</strong> {brief.scope} · <strong>Location:</strong> {brief.location}
                  </p>
                  <p className="brief-takeaway-body">
                    {brief.summaryParagraphs[0]}
                  </p>
                </div>

                {/* Official Filing Dossier Invitation Card */}
                <div
                  className="gepnic-teaser-card gepnic-teaser-wide"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveTab('gepnic')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('gepnic'); } }}
                  aria-label="Open complete official portal filing dossier"
                >
                  <div className="teaser-left">
                    <div className="teaser-pill-row">
                      <span className="teaser-pill">Official e-Procurement Record</span>
                      <span className="teaser-subpill">manipurtenders.gov.in</span>
                    </div>
                    <strong>Review the complete 9-part portal filing</strong>
                    <p>Inspect all official tender packets published on the portal—including technical eligibility requirements, BOQ financial schedules, tender fee & EMD receipts, corrigenda updates, and evaluation status.</p>
                  </div>
                  <div className="teaser-action-btn">
                    <span>Open Complete Dossier</span>
                    <ArrowRight size={15} />
                  </div>
                </div>

                {/* Record Anatomy (4 Facts) */}
                <section className="detail-section understand-section">
                  <div className="section-heading-inline">
                    <div>
                      <span className="eyebrow-small">Record anatomy</span>
                      <h3>Four facts to orient the reader.</h3>
                    </div>
                    <HelpCircle size={16} aria-hidden="true" />
                  </div>
                  <div className="understand-grid">
                    <div>
                      <span className="understand-icon"><FileText size={16} /></span>
                      <strong>What is being procured?</strong>
                      <p>{brief.scope}</p>
                    </div>
                    <div>
                      <span className="understand-icon"><Network size={16} /></span>
                      <strong>Who is responsible?</strong>
                      <p>{brief.buyer}. Recorded chain: {orgChain}.</p>
                    </div>
                    <div>
                      <span className="understand-icon"><MapPin size={16} /></span>
                      <strong>Where?</strong>
                      <p>{brief.location}{tender.pincode ? ` · PIN ${tender.pincode}` : ''}.</p>
                    </div>
                    <div>
                      <span className="understand-icon"><Flag size={16} /></span>
                      <strong>Verify next</strong>
                      <p>Scope, eligibility, amendments, deadline, and any later award notice.</p>
                    </div>
                  </div>
                </section>

                {/* Tender Anatomy Dual-Language Decoder */}
                <TenderAnatomy tender={tender} brief={brief} />
              </div>

              {/* Right Sidebar Column */}
              <div className="executive-brief-sidebar">
                <ExplainableVigilanceScorecard tender={tender} signal={signal} />
                <ResponseWindowVisual tender={tender} benchmark={benchmark} />
                <SpendScaleVisual tender={tender} portfolioValues={portfolioValues} department={departmentName} />
                <div className="signal-explanation executive-signal">
                  <div className={`signal-icon ${getSignalTone(signal.tone)}`}><Sparkles size={17} /></div>
                  <div>
                    <strong>{signal.label}</strong>
                    <p>{signal.detail} This is a public-interest signal for context, not a finding of wrongdoing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gepnic' && (
          <div className="detail-tab-panel tender-tab-panel-wide" id="tender-panel-gepnic" role="tabpanel" aria-labelledby="tender-tab-gepnic" tabIndex={0}>
            <GepnicDossierSection tender={tender} />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="detail-tab-panel tender-tab-panel-wide" id="tender-panel-timeline" role="tabpanel" aria-labelledby="tender-tab-timeline" tabIndex={0}>
            <VisualTimeline tender={tender} benchmark={benchmark} />
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="detail-tab-panel tender-tab-panel-wide" id="tender-panel-comparison" role="tabpanel" aria-labelledby="tender-tab-comparison" tabIndex={0}>
            <PeerComparison tender={tender} comparable={comparable} awardedName={awardedName} awardDifference={awardDifference} awardAvailable={awardAvailable} onCompare={onCompare} />
          </div>
        )}

        {activeTab === 'action' && (
          <div className="detail-tab-panel tender-tab-panel-wide" id="tender-panel-action" role="tabpanel" aria-labelledby="tender-tab-action" tabIndex={0}>
            <CitizenInquiryGenerator tender={tender} brief={brief} onMessage={setActionMessage} />

            <section className="detail-section detail-notes-section">
              <div className="section-heading-inline">
                <div>
                  <span className="eyebrow-small">Keep a local record</span>
                  <h3>Private reading note</h3>
                </div>
                <NotebookPen size={16} aria-hidden="true" />
              </div>
              <p className="section-helper">Save a reminder for yourself. Notes stay in this browser and are not sent to CHEIRAP or the government portal.</p>
              <textarea className="note-input" value={noteDraft} onChange={(event) => setNoteDraft(event.target.value.slice(0, 500))} placeholder="What do you want to remember about this tender?" aria-label="Private reading note" />
              <div className="note-actions">
                <button className="secondary-button" onClick={() => { onSaveNote(tender.tender_id, noteDraft); setActionMessage('Private note saved in this browser.'); }}>
                  <NotebookPen size={15} /> Save note
                </button>
                <span>{noteDraft.length}/500</span>
              </div>
            </section>

            <section className="citizen-action-card">
              <div className="citizen-action-heading">
                <span className="action-icon"><ShieldCheck size={18} /></span>
                <div>
                  <span className="eyebrow-small">Source-led action</span>
                  <h3>Check the record before escalating.</h3>
                  <p>Use the official notice as the source of truth and keep the question specific.</p>
                </div>
              </div>
              <ol className="citizen-checklist">
                <li>Read the scope and eligibility clauses in the official notice.</li>
                <li>Check every corrigendum and the final closing date.</li>
                <li>Look for the award and participation record when it is published.</li>
              </ol>
              <div className="detail-actions">
                <button className="secondary-button" onClick={copyQuestionBrief}>
                  <MessageSquare size={16} /> Copy full question brief
                </button>
                <button className="secondary-button" onClick={() => setCorrectionOpen((open) => !open)}>
                  <Flag size={16} /> {correctionOpen ? 'Close correction form' : 'Suggest a correction'}
                </button>
              </div>
              {correctionOpen && (
                <div className="correction-form">
                  <label>
                    Field
                    <select value={correctionField} onChange={(event) => setCorrectionField(event.target.value)}>
                      <option>Scope or project description</option>
                      <option>Location or district</option>
                      <option>Value, fee, or bid security</option>
                      <option>Dates or corrigendum count</option>
                      <option>Status or award information</option>
                      <option>Source link or identifier</option>
                    </select>
                  </label>
                  <label>
                    What should be corrected?
                    <textarea value={correctionText} onChange={(event) => setCorrectionText(event.target.value)} placeholder="Describe the correction clearly." />
                  </label>
                  <label>
                    Supporting source link (optional)
                    <input type="url" inputMode="url" value={correctionSource} onChange={(event) => setCorrectionSource(event.target.value)} placeholder="https://..." />
                  </label>
                  <button className="secondary-button" onClick={submitCorrection} disabled={!correctionText.trim()}>
                    <Check size={15} /> Save correction draft
                  </button>
                </div>
              )}
              {actionMessage && <p className="action-message" role="status">{actionMessage}</p>}
            </section>

            <section className="detail-section">
              <div className="section-heading-inline">
                <div>
                  <span className="eyebrow-small">Coverage map</span>
                  <h3>What is connected to this record?</h3>
                </div>
                <Layers3 size={16} aria-hidden="true" />
              </div>
              <div className="coverage-grid">
                {brief.coverage.map((item) => (
                  <div className={`coverage-item coverage-${item.status}`} key={item.label}>
                    <span>{item.status === 'available' ? <CheckCircle2 size={15} /> : item.status === 'partial' ? <AlertCircle size={15} /> : <FileText size={15} />}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <small>{item.status === 'available' ? 'Available in snapshot' : item.status === 'partial' ? 'Partial coverage' : 'Not connected'}</small>
                      <p>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="source-card">
              <div className="source-card-icon"><Globe2 size={19} /></div>
              <div>
                <span className="eyebrow-small">Verify the official record</span>
                <h3>Government of Manipur e-Procurement Portal</h3>
                <p>CHEIRAP presents a structured snapshot of public portal information. Record-level verification is still pending, so always verify the original notice before relying on it.</p>
                <div className="source-meta">
                  <span>ID {tender.tender_id}</span>
                  <span>Ref {tender.ref_no}</span>
                  <span>Snapshot {snapshotMeta.shortSnapshotDate}</span>
                  <span>Record status: {tender.source_status === 'snapshot' ? 'Snapshot only' : tender.source_status}</span>
                </div>
              </div>
              <a className="source-link" href={officialSearchUrl} target="_blank" rel="noreferrer">Open official portal <ExternalLink size={15} /></a>
            </section>
          </div>
        )}

        {/* Dedicated Citizen Brief Print Footer */}
        <div className="print-only print-footer-banner" aria-hidden="true">
          <div className="print-footer-divider" />
          <div className="print-footer-grid">
            <div>
              <strong>Official Verification Source:</strong>
              <p>{officialSearchUrl} (Tender ID: {tender.tender_id})</p>
            </div>
            <div>
              <strong>Integrity & Civic Notice:</strong>
              <p>Assembled from the public e-tender snapshot. Signals are contextual reading aids, not judicial findings or criminal accusations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareTray({ tenders, onRemove, onClear, onOpen }: { tenders: Tender[]; onRemove: (id: string) => void; onClear: () => void; onOpen: (tender: Tender) => void }) {
  if (!tenders.length) return null;
  return (
    <div className="compare-tray">
      <div><span className="eyebrow-small">Comparison</span><strong>{tenders.length} tender{tenders.length > 1 ? 's' : ''} selected</strong></div>
      <div className="compare-tray-items">{tenders.map((tender) => <button key={tender.tender_id} onClick={() => onOpen(tender)} title={tender.title}>{tender.title.slice(0, 34)}… <X size={13} onClick={(event) => { event.stopPropagation(); onRemove(tender.tender_id); }} /></button>)}</div>
      <button className="secondary-button" onClick={onClear}>Clear</button>
    </div>
  );
}

function DeadlineCalendar({ tenders, onOpen }: { tenders: Tender[]; onOpen: (tender: Tender) => void }) {
  const sorted = [...tenders].sort((left, right) => {
    const leftDays = getDaysUntilClosing(left);
    const rightDays = getDaysUntilClosing(right);
    if (leftDays === null) return 1;
    if (rightDays === null) return -1;
    return leftDays - rightDays;
  });
  const upcoming = sorted.filter((tender) => {
    const days = getDaysUntilClosing(tender);
    return days !== null && days >= 0 && days <= 45;
  });
  const displayed = (upcoming.length ? upcoming : sorted).slice(0, 10);

  return (
    <section className="deadline-calendar" aria-label="Tender closing calendar">
      <div className="deadline-calendar-heading"><div><span className="eyebrow-small">Deadline view</span><h2><CalendarDays size={20} /> Closing dates in this snapshot</h2><p>{upcoming.length ? 'Upcoming deadlines are listed first.' : 'No record closes in the next 45 days of the snapshot date; nearest archived dates are shown instead.'}</p></div><span className="calendar-date-note">As of {snapshotMeta.shortSnapshotDate}</span></div>
      <div className="deadline-list">{displayed.map((tender) => <button className="deadline-item" key={tender.tender_id} onClick={() => onOpen(tender)}><span className="deadline-day">{formatDate(tender.closing_date)}</span><span className="deadline-title"><strong>{tender.title}</strong><small>{getSimpleDepartment(tender.department)} · {getLocationLabel(tender.location)}</small></span><span className="deadline-status">{getClosingLabel(tender)}<ChevronRight size={15} /></span></button>)}</div>
    </section>
  );
}

function PublicApp() {
  const motionRootRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState<'home' | 'explore'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [district, setDistrict] = useState('ALL');
  const [signal, setSignal] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [valueBand, setValueBand] = useState('ALL');
  const [closingWindow, setClosingWindow] = useState('ALL');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showDeadlineCalendar, setShowDeadlineCalendar] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const heroSearchRef = useRef<HTMLInputElement>(null);
  const exploreSearchRef = useRef<HTMLInputElement>(null);
  const [listMessage, setListMessage] = useState('');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(() => {
    const tenderId = new URLSearchParams(window.location.search).get('tender');
    return allTenders.find((tender) => tender.tender_id === tenderId) || null;
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cheirap-watchlist') || '[]') as string[];
      const shared = (new URLSearchParams(window.location.search).get('list') || '').split(',').filter(Boolean);
      return Array.from(new Set([...stored, ...shared].filter((id) => allTenders.some((tender) => tender.tender_id === id))));
    } catch { return []; }
  });
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('cheirap-notes') || '{}'); } catch { return {}; }
  });
  const [corrections, setCorrections] = useState<Array<{ tenderId: string; field: string; correction: string; source: string; createdAt: string }>>(() => {
    try { return JSON.parse(localStorage.getItem('cheirap-corrections') || '[]'); } catch { return []; }
  });

  useCheirapMotion(motionRootRef, selectedTender ? 'detail' : activePage);

  useEffect(() => {
    localStorage.setItem('cheirap-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cheirap-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('cheirap-corrections', JSON.stringify(corrections));
  }, [corrections]);

  const departments = useMemo(() => Array.from(new Set(allTenders.map((tender) => getSimpleDepartment(tender.department)))).sort(), []);
  const locations = useMemo(() => Array.from(new Set(allTenders.map((tender) => getLocationLabel(tender.location)))).sort(), []);
  const districts = useMemo(() => Array.from(new Set(allTenders.map((tender) => getDistrictLabel(tender.location)))).sort(), []);
  const statuses = useMemo(() => Array.from(new Set(allTenders.map((tender) => tender.status))).sort(), []);
  const totalValue = useMemo(() => allTenders.reduce((sum, tender) => sum + tender.estimated_value_inr, 0), []);
  const redCount = allTenders.filter((tender) => tender.vigilance_tier === 'RED').length;
  const amberCount = allTenders.filter((tender) => tender.vigilance_tier === 'AMBER').length;
  const greenCount = allTenders.filter((tender) => tender.vigilance_tier === 'GREEN').length;

  const filteredTenders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allTenders.filter((tender) => {
      const matchesQuery = !normalized || [tender.title, tender.work_desc, tender.tender_id, tender.ref_no, tender.department, tender.location, tender.product_category].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized));
      const matchesDepartment = department === 'ALL' || getSimpleDepartment(tender.department) === department;
      const matchesLocation = location === 'ALL' || getLocationLabel(tender.location) === location;
      const matchesDistrict = district === 'ALL' || getDistrictLabel(tender.location) === district;
      const matchesSignal = signal === 'ALL' || getSignal(tender).label === signal;
      const matchesStatus = statusFilter === 'ALL' || tender.status === statusFilter;
      const matchesValue = valueBand === 'ALL' || (valueBand === 'UNDER_1' && tender.estimated_value_inr < 1e7) || (valueBand === 'ONE_TO_TEN' && tender.estimated_value_inr >= 1e7 && tender.estimated_value_inr <= 1e8) || (valueBand === 'OVER_10' && tender.estimated_value_inr > 1e8);
      const daysUntilClosing = getDaysUntilClosing(tender);
      const matchesClosing = closingWindow === 'ALL' || (daysUntilClosing !== null && daysUntilClosing >= 0 && daysUntilClosing <= Number(closingWindow));
      const matchesSaved = !showSavedOnly || watchlist.includes(tender.tender_id);
      return matchesQuery && matchesDepartment && matchesLocation && matchesDistrict && matchesSignal && matchesStatus && matchesValue && matchesClosing && matchesSaved;
    });
  }, [closingWindow, department, district, location, query, signal, showSavedOnly, statusFilter, valueBand, watchlist]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'closing' ? 'asc' : 'desc');
    }
  };

  const sortedFilteredTenders = useMemo(() => {
    return [...filteredTenders].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'value') {
        comparison = a.estimated_value_inr - b.estimated_value_inr;
      } else if (sortField === 'closing') {
        const aTime = parseTenderDate(a.closing_date)?.getTime() || 0;
        const bTime = parseTenderDate(b.closing_date)?.getTime() || 0;
        comparison = aTime - bTime;
      } else if (sortField === 'signal') {
        comparison = a.cheirap_risk_score - b.cheirap_risk_score;
      } else if (sortField === 'amendments') {
        comparison = a.corrigendum_count - b.corrigendum_count;
      } else if (sortField === 'window') {
        comparison = a.feat_window_days - b.feat_window_days;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTenders, sortField, sortDirection]);

  const compareTenders = compareIds.map((id) => allTenders.find((tender) => tender.tender_id === id)).filter(Boolean) as Tender[];
  const featured = useMemo(() => [
    allTenders.find((tender) => tender.vigilance_tier === 'GREEN'),
    allTenders.find((tender) => tender.feat_window_compression_hours < 72),
    allTenders.find((tender) => tender.corrigendum_count >= 3 && tender.feat_window_compression_hours >= 72),
  ].filter(Boolean) as Tender[], []);

  const toggleWatch = (id: string) => setWatchlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (id: string) => setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 3 ? current : [...current, id]);
  const saveNote = (id: string, value: string) => setNotes((current) => {
    const next = { ...current };
    if (value.trim()) next[id] = value.trim().slice(0, 500);
    else delete next[id];
    return next;
  });
  const saveCorrection = (payload: { tenderId: string; field: string; correction: string; source: string }) => setCorrections((current) => [...current, { ...payload, createdAt: new Date().toISOString() }]);
  const clearFilters = () => {
    setQuery('');
    setDepartment('ALL');
    setLocation('ALL');
    setDistrict('ALL');
    setSignal('ALL');
    setStatusFilter('ALL');
    setValueBand('ALL');
    setClosingWindow('ALL');
    setShowSavedOnly(false);
  };
  const copyReadingList = async () => {
    if (!watchlist.length) return;
    const listUrl = `${window.location.origin}${window.location.pathname}?list=${encodeURIComponent(watchlist.join(','))}`;
    const ok = await safeCopyToClipboard(listUrl);
    if (ok) {
      setListMessage('Shareable reading-list link copied. It contains tender IDs only.');
    } else {
      setListMessage('Copy was not available in this browser.');
    }
  };
  const openTender = (tender: Tender) => {
    setSelectedTender(tender);
    window.history.pushState({ tenderId: tender.tender_id }, '', `?tender=${encodeURIComponent(tender.tender_id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const closeTender = () => {
    setSelectedTender(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  useEffect(() => {
    const handlePopState = () => {
      const tenderId = new URLSearchParams(window.location.search).get('tender');
      if (tenderId) {
        const found = allTenders.find((t) => t.tender_id === tenderId);
        setSelectedTender(found || null);
      } else {
        setSelectedTender(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openExplore = (nextQuery = '') => {
    setQuery(nextQuery);
    setActivePage('explore');
    setMobileMenuOpen(false);
    window.setTimeout(() => scrollToSection('explore-tenders'), 0);
  };

  const openHomeSection = (id: string) => {
    setActivePage('home');
    setMobileMenuOpen(false);
    window.setTimeout(() => scrollToSection(id), 0);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');

      // 1. Escape key
      if (event.key === 'Escape') {
        if (selectedTender) {
          closeTender();
          return;
        }
        if (showDeadlineCalendar) {
          setShowDeadlineCalendar(false);
          return;
        }
        if (isInputActive) {
          (activeEl as HTMLElement).blur();
          return;
        }
        if (compareIds.length > 0) {
          setCompareIds([]);
          return;
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          return;
        }
      }

      // If user is currently typing in an input field or textarea, do NOT intercept other hotkeys
      if (isInputActive) return;

      // 2. '/' to focus search input
      if (event.key === '/') {
        event.preventDefault();
        if (activePage === 'explore') {
          exploreSearchRef.current?.focus();
          exploreSearchRef.current?.select();
        } else {
          heroSearchRef.current?.focus();
          heroSearchRef.current?.select();
        }
        return;
      }

      // Explorer-specific hotkeys (only when in explore view and modal closed)
      if (activePage === 'explore' && !selectedTender && sortedFilteredTenders.length > 0) {
        // 3. ArrowDown or 'j'
        if (event.key === 'ArrowDown' || event.key === 'j') {
          event.preventDefault();
          setFocusedIndex((prev) => (prev < sortedFilteredTenders.length - 1 ? prev + 1 : 0));
          return;
        }

        // 4. ArrowUp or 'k'
        if (event.key === 'ArrowUp' || event.key === 'k') {
          event.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : sortedFilteredTenders.length - 1));
          return;
        }

        // 5. Enter to open focused tender
        if (event.key === 'Enter' && focusedIndex >= 0 && focusedIndex < sortedFilteredTenders.length) {
          event.preventDefault();
          openTender(sortedFilteredTenders[focusedIndex]);
          return;
        }

        // 6. 'c' or 'C' to toggle compare
        if ((event.key === 'c' || event.key === 'C') && focusedIndex >= 0 && focusedIndex < sortedFilteredTenders.length) {
          event.preventDefault();
          toggleCompare(sortedFilteredTenders[focusedIndex].tender_id);
          return;
        }

        // 7. 's' or 'w' to toggle watchlist
        if ((event.key === 's' || event.key === 'S' || event.key === 'w' || event.key === 'W') && focusedIndex >= 0 && focusedIndex < sortedFilteredTenders.length) {
          event.preventDefault();
          toggleWatch(sortedFilteredTenders[focusedIndex].tender_id);
          return;
        }

        // 8. 'v' or 't' to toggle table vs cards view
        if (event.key === 'v' || event.key === 'V' || event.key === 't' || event.key === 'T') {
          event.preventDefault();
          setViewMode((prev) => (prev === 'cards' ? 'table' : 'cards'));
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage, compareIds.length, focusedIndex, mobileMenuOpen, selectedTender, showDeadlineCalendar, sortedFilteredTenders]);

  useEffect(() => {
    if (focusedIndex >= 0) {
      const el = document.getElementById(`tender-item-${focusedIndex}`);
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex]);

  return (
    <div ref={motionRootRef} className="public-app">
      <div className="scroll-progress-bar" aria-hidden="true" />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="site-header-inner">
          <button className="brand-lockup" onClick={() => { closeTender(); setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="CHEIRAP home">
            <img src="/manipur_emblem_badge.png" alt="Government of Manipur emblem" />
            <span><strong>CHEIRAP</strong><small>Public tender transparency</small></span>
          </button>
          <nav id="site-navigation" className={`site-nav ${mobileMenuOpen ? 'site-nav-open' : ''}`}>
            <button className={(!selectedTender && activePage === 'explore') ? 'nav-link nav-link-active' : 'nav-link'} onClick={() => { closeTender(); openExplore(); }}>Explore tenders</button>
            <button className="nav-link" onClick={() => { closeTender(); openHomeSection('how-it-works'); }}>How it works</button>
            <button className="nav-link" onClick={() => { closeTender(); openHomeSection('data-method'); }}>Data & method</button>
            <button className="nav-link" onClick={() => { closeTender(); openHomeSection('across-india'); }}>Across India</button>
          </nav>
          <div className="header-actions">
            <button className="header-cta" onClick={() => { closeTender(); openExplore(); }}>Explore <ArrowUpRight size={16} /></button>
            <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-controls="site-navigation" aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>

      {selectedTender ? (
        <main id="main-content" className="tender-window-page page-container anchor-section">
          <TenderDetail
            key={selectedTender.tender_id}
            tender={selectedTender}
            watched={watchlist.includes(selectedTender.tender_id)}
            onClose={closeTender}
            onWatch={toggleWatch}
            onCompare={toggleCompare}
            note={notes[selectedTender.tender_id] || ''}
            onSaveNote={saveNote}
            onSaveCorrection={saveCorrection}
            onNavigate={(page) => {
              closeTender();
              if (page === 'home') {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                openExplore();
              }
            }}
          />
        </main>
      ) : activePage === 'home' ? (
        <main id="main-content">
          <section className="hero-section page-container">
             <div className="hero-copy">
              <span className="eyebrow">CHEIRAP · Public tender transparency for Manipur</span>
              <h1>See what public money is buying.</h1>
              <p>Explore public tender records in plain language, compare similar contracts, and verify every source on the official portal.</p>
              <div className="hero-search">
                <Search size={19} />
                 <input ref={heroSearchRef} type="search" name="tender-search" enterKeyHint="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && openExplore(query)} placeholder="Search tenders, departments, or districts... (press /)" aria-label="Search public tenders" />
                <button onClick={() => openExplore(query)}>Search</button>
              </div>
              <div className="hero-notes">
                <DataStatus />
                <span><Check size={14} /> Official source links preserved</span>
                <span>CVC & GFR 2017 Audit Baseline</span>
              </div>
            </div>
             <div className="hero-visual" aria-label="Tender transparency visual">
              <div className="hero-record-card">
                <div className="hero-record-top"><span className="hero-record-label">A public record, explained</span><span className="record-source-dot" /></div>
                <div className="hero-record-doc"><FileText size={20} /><span>Notice Inviting Tender</span><small>Government of Manipur</small></div>
                <div className="hero-record-line"><span>Estimated value</span><strong>{formatCrores(allTenders[0].estimated_value_inr)}</strong></div>
                <div className="hero-record-line"><span>Response window</span><strong>{allTenders[0].feat_window_days.toFixed(1)} days</strong></div>
                <div className="hero-record-line"><span>What stands out</span><strong className="hero-record-accent">Compare with similar</strong></div>
                <div className="hero-record-footer"><span>Source link preserved</span><ArrowUpRight size={15} /></div>
              </div>
              <div className="hero-emblem"><img src="/manipur_emblem_gold.png" alt="" /></div>
            </div>
          </section>

          <section className="snapshot-section page-container">
            <div className="section-heading"><span className="eyebrow">The public record</span><h2>Start with the shape of the spend.</h2><p>Before reading a tender line by line, see what this public snapshot contains and where a closer look may help.</p></div>
            <div className="snapshot-layout">
              <div className="snapshot-lead">
                <div className="snapshot-lead-top"><span className="eyebrow-small">Estimated value across this snapshot</span><BarChart3 size={20} /></div>
                <strong>{formatCrores(totalValue)}</strong>
                <p>{allTenders.length} notices from the Manipur e-tender portal, represented here as a structured public snapshot assembled {snapshotMeta.shortSnapshotDate}.</p>
                <div className="snapshot-bars" aria-label="Distribution of review signals">
                  <div><span>Open opportunity</span><i><b style={{ width: `${(greenCount / allTenders.length) * 100}%` }} /></i><strong>{greenCount}</strong></div>
                  <div><span>Worth a closer look</span><i><b className="bar-amber" style={{ width: `${((amberCount + redCount) / allTenders.length) * 100}%` }} /></i><strong>{amberCount + redCount}</strong></div>
                </div>
              </div>
              <div className="snapshot-metrics">
                <div className="snapshot-metric"><span className="metric-icon"><FileSearch size={18} /></span><strong>{allTenders.length}</strong><span>tender records</span><small>What is publicly listed</small></div>
                <div className="snapshot-metric"><span className="metric-icon"><Layers3 size={18} /></span><strong>{departments.length}</strong><span>departments</span><small>Who is procuring</small></div>
                <div className="snapshot-metric"><span className="metric-icon"><MapPinned size={18} /></span><strong>{districts.length}</strong><span>district areas</span><small>Where work appears</small></div>
                <div className="snapshot-metric"><span className="metric-icon"><ListFilter size={18} /></span><strong>{redCount + amberCount}</strong><span>review signals</span><small>Where context may help</small></div>
              </div>
              <div className="snapshot-note"><CheckCircle2 size={18} /><div><strong>How to read this</strong><p>A signal is a prompt to inspect the original notice. It is not a verdict about a department, bidder, or tender.</p></div></div>
            </div>
          </section>

          <section className="question-section page-container">
            <div className="section-heading"><h2>Start with a question.</h2><p>You do not need to know a tender number to begin.</p></div>
            <div className="question-grid">
              <button onClick={() => { setLocation('ALL'); openExplore(); }}><span className="question-icon"><MapPinned size={19} /></span><span className="question-index">01</span><strong>What is planned near me?</strong><span>Browse notices by location and closing date.</span><span className="question-cta">Browse by place <ArrowUpRight size={15} /></span></button>
              <button onClick={() => { setDepartment('ALL'); openExplore(); }}><span className="question-icon"><Network size={19} /></span><span className="question-index">02</span><strong>What is each department buying?</strong><span>See which public bodies are procuring work and services.</span><span className="question-cta">Browse by department <ArrowUpRight size={15} /></span></button>
              <button onClick={() => { setSignal('Short bidding window'); openExplore(); }}><span className="question-icon"><ShieldCheck size={19} /></span><span className="question-index">03</span><strong>What deserves a closer look?</strong><span>Start with timelines, amendments, and participation signals.</span><span className="question-cta">Explore signals <ArrowUpRight size={15} /></span></button>
            </div>
          </section>

          <section className="stories-section page-container">
            <div className="section-heading section-heading-row"><div><span className="eyebrow">Tender stories</span><h2>Public records, with context.</h2></div><button className="secondary-button section-heading-action" onClick={() => openExplore()}><span>Browse all<br />tenders</span><ArrowUpRight size={16} /></button></div>
            <div className="stories-grid">{featured.map((tender) => <TenderStoryCard key={tender.tender_id} tender={tender} onOpen={openTender} />)}</div>
          </section>

          <section className="record-layers-section page-container">
            <div className="record-layers-heading"><span className="eyebrow">The transparency chain</span><h2>One notice is useful. A connected record is better.</h2><p>The deep scan points to more public materials on the official portal. CHEIRAP should expose them in stages, only after each source is verified and explained.</p></div>
            <div className="record-layers-grid">
              <article className="record-layer record-layer-current"><span className="record-layer-number">01</span><div className="record-layer-icon"><FileText size={20} /></div><span className="record-layer-status">Available now</span><h3>Notice and deadline</h3><p>What is being bought, by whom, where, for how much, and when bids close.</p></article>
              <article className="record-layer"><span className="record-layer-number">02</span><div className="record-layer-icon"><Clock3 size={20} /></div><span className="record-layer-status">Counted where listed</span><h3>Changes and addenda</h3><p>CHEIRAP shows the number of recorded changes now; the full amendment text still needs verified document ingestion.</p></article>
              <article className="record-layer"><span className="record-layer-number">03</span><div className="record-layer-icon"><UsersRound size={20} /></div><span className="record-layer-status">Partial snapshot</span><h3>Award and participation</h3><p>Some records include bid and award fields. The original award notice remains the source of truth.</p></article>
              <article className="record-layer"><span className="record-layer-number">04</span><div className="record-layer-icon"><Layers3 size={20} /></div><span className="record-layer-status">Not connected</span><h3>Evaluation, BOQ and delivery</h3><p>Bid matrices, debarment lists, itemized schedules, and post-award evidence are clearly marked when unavailable.</p></article>
            </div>
          </section>

          <section id="how-it-works" className="how-section page-container anchor-section">
            <div className="how-intro"><span className="eyebrow">How CHEIRAP works</span><h2>Understand first. Judge never.</h2><p>CHEIRAP is a reading layer between a complex portal and a public question. Every signal stays connected to the original record.</p><div className="how-callout"><CheckCircle2 size={17} /><span>Plain language, preserved sources, visible limitations.</span></div></div>
            <div className="how-steps"><div><span>01</span><h3>Find the record.</h3><p>Search by place, department, work, tender ID, or closing date.</p></div><div><span>02</span><h3>See the context.</h3><p>Compare timelines, values, amendments, and available participation data.</p></div><div><span>03</span><h3>Verify the source.</h3><p>Open the official portal before relying on a summary or raising a question.</p></div></div>
          </section>

          <section id="across-india" className="expansion-section page-container anchor-section">
            {/* Subtle India map watermark */}
            <IndiaMapWatermark className="expansion-india-backdrop" showNodes={false} showGrid={false} />

            <div className="expansion-copy">
              <span className="eyebrow">Across India · Research map</span>
              <h2>One reading layer, built to travel.</h2>
              <p>Manipur is live. The links below are official public portals and procurement guidance for neighbouring states, mapped as future adapter targets—not live CHEIRAP feeds.</p>

              <div className="expansion-proof">
                <CheckCircle2 size={15} />
                <span>Manipur snapshot live · {statePortals.length} Northeast state portals mapped for the next adapter cycle.</span>
              </div>

              <button className="primary-button" onClick={() => scrollToSection('data-method')}>
                See the data model <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="expansion-visual">
              <div className="expansion-visual-map-overlay" aria-hidden="true">
                <IndiaMapWatermark className="expansion-card-watermark" showNodes={false} showGrid={false} />
              </div>

              <div className="expansion-architecture-label">
                <Globe2 size={15} />
                <span>State-ready architecture</span>
              </div>

              <div className="expansion-node-grid" aria-label="State expansion status">
                <div className="expansion-node-card expansion-node-card-active">
                  <span className="expansion-node-code">MN</span>
                  <strong>Manipur</strong>
                  <small>Current focus</small>
                </div>
                <div className="expansion-node-card">
                  <span className="expansion-node-code">NE</span>
                  <strong>Northeast states</strong>
                  <small>Adapters in progress</small>
                </div>
              </div>

              <p className="expansion-common-fields">Common fields · source links preserved · live and snapshot status visible</p>

              <div className="expansion-map-label">
                <Globe2 size={16} />
                <span>Portal directory</span>
                <small>Official sources</small>
              </div>

              <div className="state-directory">
                {statePortals.map((portal) => (
                  <article className="state-directory-row" key={portal.code}>
                    <div className="state-code">{portal.code}</div>
                      <div className="state-row-info">
                        <strong>{portal.state}</strong>
                        <span className="state-capital">{portal.capital}</span>
                        <span className="state-source-status">{portal.status === 'Portal mapped' ? 'Source mapped' : 'Research underway'}</span>
                      </div>
                    <div className="state-directory-links">
                      <a href={portal.portalUrl} target="_blank" rel="noreferrer">
                        Tender portal <ExternalLink size={12} />
                      </a>
                      <a href={portal.rulebookUrl} target="_blank" rel="noreferrer">
                        {portal.rulebookLabel} <ExternalLink size={12} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              <div className="adapter-health" aria-label="Adapter health summary">
                <div><span>Portals mapped</span><strong>{statePortals.length}</strong></div>
                <div><span>Live adapters</span><strong>0</strong></div>
                <div><span>Common schema</span><strong>Targeted</strong></div>
              </div>

              <p className="expansion-card-note">
                <ShieldCheck size={13} />
                <span>Links go directly to official government sites. CHEIRAP does not host or mirror tender data from these states.</span>
              </p>
            </div>
          </section>

          <section id="data-method" className="method-section page-container anchor-section">
            <div className="section-heading"><span className="eyebrow">Data & method</span><h2>Trust is part of the interface.</h2><p>Every record should tell you where it came from, what is connected today, and what CHEIRAP can and cannot infer.</p></div>
            <div className="method-grid"><div><div className="method-icon"><Globe2 size={18} /></div><h3>Official sources first</h3><p>We preserve the original government portal and tender identifiers so the public record remains verifiable.</p></div><div><div className="method-icon"><Sparkles size={18} /></div><h3>Signals with context</h3><p>We explain timelines, changes, and comparisons without turning patterns into accusations or legal conclusions.</p></div><div><div className="method-icon"><NotebookPen size={18} /></div><h3>Citizen tools stay local</h3><p>Watchlists, private notes, shareable reading lists, and correction drafts stay in the browser until a real service is intentionally connected.</p></div><div><div className="method-icon"><Info size={18} /></div><h3>Visible data status</h3><p>This release distinguishes available, partial, and not-connected material. It does not make a legal-evidence or admissibility claim.</p></div></div>
          </section>
        </main>
      ) : (
        <main id="main-content" className="explore-page page-container anchor-section">
          <div id="explore-tenders" className="explore-heading">
            <div>
              <span className="eyebrow">Public tender explorer</span>
              <h1>Find a tender. Understand the story.</h1>
              <p>Browse {allTenders.length} structured records from the Manipur e-tender portal snapshot.</p>
            </div>
            <DataStatus />
          </div>

          <div className="explore-toolbar">
            <div className="explore-search">
              <Search size={18} />
              <input
                ref={exploreSearchRef}
                type="search"
                name="explore-search"
                enterKeyHint="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, work, department, district or tender ID (or press /)"
                aria-label="Search tenders"
              />
            </div>
            <div className="filter-group filter-group-primary">
              <Filter size={16} />
              <select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)}>
                <option value="ALL">All departments</option>
                {departments.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select aria-label="Filter by district" value={district} onChange={(event) => setDistrict(event.target.value)}>
                <option value="ALL">All districts</option>
                {districts.slice(0, 25).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select aria-label="Filter by location" value={location} onChange={(event) => setLocation(event.target.value)}>
                <option value="ALL">All locations</option>
                {locations.slice(0, 20).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="filter-group filter-group-secondary">
              <select aria-label="Filter by tender status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="ALL">All statuses</option>
                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select aria-label="Filter by estimated value" value={valueBand} onChange={(event) => setValueBand(event.target.value)}>
                <option value="ALL">All values</option>
                <option value="UNDER_1">Under ₹1 Cr</option>
                <option value="ONE_TO_TEN">₹1–10 Cr</option>
                <option value="OVER_10">Over ₹10 Cr</option>
              </select>
              <select aria-label="Filter by closing date" value={closingWindow} onChange={(event) => setClosingWindow(event.target.value)}>
                <option value="ALL">Any closing date</option>
                <option value="3">Closing in 3 days</option>
                <option value="7">Closing in 7 days</option>
                <option value="14">Closing in 14 days</option>
              </select>
              <select aria-label="Filter by review signal" value={signal} onChange={(event) => setSignal(event.target.value)}>
                <option value="ALL">All signals</option>
                <option value="Open opportunity">Open opportunity</option>
                <option value="Short bidding window">Short bidding window</option>
                <option value="Several changes recorded">Several changes recorded</option>
                <option value="Low participation signal">Low participation signal</option>
                <option value="Bid-security outlier">Bid-security outlier</option>
              </select>
            </div>
            <div className="explore-toolbar-actions">
              <div className="view-mode-selector" role="group" aria-label="Explorer layout mode">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === 'cards' ? 'view-mode-btn-active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Cards view (Press 'V' to toggle)"
                >
                  <LayoutGrid size={15} />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === 'table' ? 'view-mode-btn-active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Compact data-grid view (Press 'V' to toggle)"
                >
                  <Table size={15} />
                  <span>Table</span>
                </button>
              </div>
              <button className={`saved-filter ${showSavedOnly ? 'saved-filter-active' : ''}`} onClick={() => setShowSavedOnly((current) => !current)}>
                <Bookmark size={15} fill={showSavedOnly ? 'currentColor' : 'none'} /> Saved {watchlist.length}
              </button>
              <button className="saved-filter" onClick={() => setShowDeadlineCalendar((current) => !current)}>
                <CalendarDays size={15} /> {showDeadlineCalendar ? 'Hide deadlines' : 'Deadline view'}
              </button>
              <button className="saved-filter" onClick={copyReadingList} disabled={!watchlist.length}>
                <Share2 size={15} /> Share list
              </button>
            </div>
          </div>
          {listMessage && <p className="action-message explore-message" role="status">{listMessage}</p>}
          {showDeadlineCalendar && <DeadlineCalendar tenders={allTenders} onOpen={openTender} />}
          <div className="explore-summary">
            <span>{sortedFilteredTenders.length} tenders shown · Sorted by {sortField} ({sortDirection === 'asc' ? 'ascending' : 'descending'})</span>
            <span className="explore-summary-note"><StatusDot tier="GREEN" /> {greenCount} open opportunity signals · <StatusDot tier="AMBER" /> {amberCount} worth a closer look · {districts.length} district areas</span>
          </div>
          <div className="explore-signal-strip">
            <div><span>Open opportunity</span><i><b style={{ width: `${(greenCount / allTenders.length) * 100}%` }} /></i><strong>{greenCount}</strong></div>
            <div><span>Review signal</span><i><b className="bar-amber" style={{ width: `${((amberCount + redCount) / allTenders.length) * 100}%` }} /></i><strong>{amberCount + redCount}</strong></div>
            <p>Signals help you choose where to read next. They do not establish wrongdoing.</p>
          </div>

          {viewMode === 'cards' ? (
            <div className="tender-list">
              {sortedFilteredTenders.length ? sortedFilteredTenders.map((tender, index) => (
                <TenderRow
                  key={tender.tender_id}
                  tender={tender}
                  index={index}
                  isFocused={focusedIndex === index}
                  watched={watchlist.includes(tender.tender_id)}
                  selected={compareIds.includes(tender.tender_id)}
                  onOpen={openTender}
                  onWatch={toggleWatch}
                  onCompare={toggleCompare}
                />
              )) : (
                <div className="empty-state">
                  <Search size={28} />
                  <h2>No tenders match that search.</h2>
                  <p>Try a department, district, closing window, or a broader phrase.</p>
                  <button className="secondary-button" onClick={clearFilters}><RotateCcw size={15} /> Clear filters</button>
                </div>
              )}
            </div>
          ) : (
            sortedFilteredTenders.length ? (
              <TenderTable
                tenders={sortedFilteredTenders}
                watchlist={watchlist}
                compareIds={compareIds}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onOpen={openTender}
                onWatch={toggleWatch}
                onCompare={toggleCompare}
                focusedIndex={focusedIndex}
              />
            ) : (
              <div className="empty-state">
                <Search size={28} />
                <h2>No tenders match that search.</h2>
                <p>Try a department, district, closing window, or a broader phrase.</p>
                <button className="secondary-button" onClick={clearFilters}><RotateCcw size={15} /> Clear filters</button>
              </div>
            )
          )}

          <div className="keyboard-shortcuts-bar" aria-label="Keyboard navigation shortcuts">
            <span className="shortcut-item"><kbd>/</kbd> Focus search</span>
            <span className="shortcut-item"><kbd>↑</kbd><kbd>↓</kbd> or <kbd>J</kbd><kbd>K</kbd> Navigate</span>
            <span className="shortcut-item"><kbd>↵ Enter</kbd> Open</span>
            <span className="shortcut-item"><kbd>C</kbd> Compare</span>
            <span className="shortcut-item"><kbd>S</kbd> Save</span>
            <span className="shortcut-item"><kbd>V</kbd> Table/Cards</span>
            <span className="shortcut-item"><kbd>Esc</kbd> Close modal</span>
          </div>
        </main>
      )}

      <footer className="site-footer">
        <div className="page-container footer-strip">
          <button className="brand-lockup footer-brand" onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="/manipur_emblem_badge.png" alt="Government of Manipur emblem" />
            <span><strong>CHEIRAP</strong><small>Public tender transparency</small></span>
          </button>
          <nav className="footer-nav" aria-label="Footer navigation">
            <button onClick={() => openExplore()}>Explore tenders</button>
            <span className="footer-dot" aria-hidden="true" />
            <a href={officialPortalUrl} target="_blank" rel="noreferrer">Official portal <ExternalLink size={12} /></a>
          </nav>
          <span className="footer-legal">Signals are not legal findings. Source links preserved.</span>
        </div>
      </footer>

      <CompareTray tenders={compareTenders} onRemove={(id) => setCompareIds((current) => current.filter((item) => item !== id))} onClear={() => setCompareIds([])} onOpen={openTender} />
    </div>
  );
}

export default PublicApp;
