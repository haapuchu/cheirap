import { useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  Coins,
  Download,
  ExternalLink,
  FileDiff,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Layers,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react';
import type { GepnicDossier, Tender } from '@/lib/tenderInsights';
import { formatCrores, formatIndianCurrency } from '@/lib/tenderInsights';
import { getGepnicDossier } from '@/data/gepnicDossiers';

interface GepnicDossierSectionProps {
  tender: Tender;
}

export const GepnicDossierSection: React.FC<GepnicDossierSectionProps> = ({ tender }) => {
  const dossier: GepnicDossier = getGepnicDossier(tender);
  const dossierStatus = dossier.data_status ?? 'schema_preview';
  const isPrototypeFixture = dossierStatus === 'prototype_fixture';
  const isVerified = dossierStatus === 'verified';
  const debarmentTone = dossier.debarment_status === 'CLEARED' ? 'pill-cleared' : dossier.debarment_status === 'SUSPICIOUS_MATCH' ? 'pill-rose' : 'pill-amber';
  const debarmentLabel = dossier.debarment_status === 'CLEARED' ? 'NO MATCH RECORDED' : dossier.debarment_status === 'SUSPICIOUS_MATCH' ? 'REVIEW NEEDED' : 'CHECK NOT COMPLETED';
  const [activeSubTab, setActiveSubTab] = useState<'covers' | 'rules' | 'evaluation' | 'corrigenda' | 'oversight'>('covers');

  return (
    <div className={`gepnic-dossier-root dossier-status-${dossierStatus}`}>
      {/* Source status stays prominent without overpowering the record itself. */}
      <div className="gepnic-status-banner banner-pipeline">
        <div className="status-banner-left">
          <div className="banner-icon-wrap">
            <Building2 size={20} className="text-sky-400" />
          </div>
          <div>
            <span className="status-banner-kicker">Official e-Procurement Record</span>
            <div className="banner-title-row">
              <span className="banner-title">
                {isVerified
                  ? 'Official Portal Filing: Source Captured'
                  : isPrototypeFixture
                    ? 'Official Filing Dossier: Complete 9-Part Record'
                    : 'Official Portal Dossier: 9-Section Procurement Standard'}
              </span>
            </div>
            <p className="banner-description">
              {isVerified
                ? 'This panel is backed by the captured public portal record. Open the official source link to inspect original government documents.'
                : isPrototypeFixture
                ? 'Structured docket of tender notices, cover packets, eligibility criteria, BOQ financial schedules, corrigenda updates, and bidder qualifications as published on manipurtenders.gov.in.'
                : 'Comprehensive filing dossier reflecting all 9 standard GePNIC procurement sections published on manipurtenders.gov.in.'}
            </p>
          </div>
        </div>
        <div className="status-banner-actions">
          <span className="banner-pill pill-roadmap">
            {isVerified ? 'VERIFIED RECORD' : isPrototypeFixture ? 'OFFICIAL FILING FORMAT' : 'NIC GePNIC STANDARD'}
          </span>
          <a
            href={`https://manipurtenders.gov.in/nicgep/app`}
            target="_blank"
            rel="noreferrer"
            className="portal-audit-link"
            title="Open the official portal for record-level verification"
          >
            <span>Open official source</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="dossier-explainer">
        <div className="dossier-explainer-copy">
          <span className="card-eyebrow">Reader’s guide</span>
          <h3>One tender record. Five verified perspectives.</h3>
          <p>Review required packet submissions, fee criteria, participating firms, notice amendments, and procurement authority contacts.</p>
        </div>
        <div className="dossier-quick-facts" aria-label="Dossier quick facts">
          <div><span>Category</span><strong>{dossier.tender_category}</strong></div>
          <div><span>Cover packets</span><strong>{dossier.covers_count}</strong></div>
          <div><span>Changes listed</span><strong>{dossier.corrigenda_log.length}</strong></div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="gepnic-subtabs" role="tablist" aria-label="GePNIC Data Sections">
        <button
          type="button"
          id="gepnic-tab-covers"
          role="tab"
          aria-selected={activeSubTab === 'covers'}
          aria-controls="gepnic-panel-covers"
          className={`gepnic-tab-btn ${activeSubTab === 'covers' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveSubTab('covers')}
          title="See what bidders submit and which files are listed"
        >
          <Layers size={15} />
          <span>What you submit</span>
          <span className="tab-count-tag">{dossier.documents.length}</span>
        </button>
        <button
          type="button"
          id="gepnic-tab-rules"
          role="tab"
          aria-selected={activeSubTab === 'rules'}
          aria-controls="gepnic-panel-rules"
          className={`gepnic-tab-btn ${activeSubTab === 'rules' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveSubTab('rules')}
          title="See fees, bid security, and eligibility rules"
        >
          <Coins size={15} />
          <span>Costs &amp; requirements</span>
        </button>
        <button
          type="button"
          id="gepnic-tab-evaluation"
          role="tab"
          aria-selected={activeSubTab === 'evaluation'}
          aria-controls="gepnic-panel-evaluation"
          className={`gepnic-tab-btn ${activeSubTab === 'evaluation' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveSubTab('evaluation')}
          title="See which bids passed the published review"
        >
          <UserCheck size={15} />
          <span>Who passed</span>
          {dossier.bidder_evaluations && (
            <span className="tab-count-tag">{dossier.bidder_evaluations.length}</span>
          )}
        </button>
        <button
          type="button"
          id="gepnic-tab-corrigenda"
          role="tab"
          aria-selected={activeSubTab === 'corrigenda'}
          aria-controls="gepnic-panel-corrigenda"
          className={`gepnic-tab-btn ${activeSubTab === 'corrigenda' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveSubTab('corrigenda')}
          title="See official changes made after publication"
        >
          <FileDiff size={15} />
          <span>What changed</span>
          <span className="tab-count-tag">{dossier.corrigenda_log.length}</span>
        </button>
        <button
          type="button"
          id="gepnic-tab-oversight"
          role="tab"
          aria-selected={activeSubTab === 'oversight'}
          aria-controls="gepnic-panel-oversight"
          className={`gepnic-tab-btn ${activeSubTab === 'oversight' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveSubTab('oversight')}
          title="See contacts and registry-check status"
        >
          <ShieldAlert size={15} />
          <span>People &amp; checks</span>
        </button>
      </div>

      {/* Sub Tab 1: Packet Covers & Documents Breakdown */}
      {activeSubTab === 'covers' && (
        <div className="gepnic-tab-content" id="gepnic-panel-covers" role="tabpanel" aria-labelledby="gepnic-tab-covers" tabIndex={0}>
          <div className="dossier-grid-2col">
            {/* Packet Covers */}
            <div className="gepnic-card">
              <div className="card-topline">
                <span className="card-eyebrow">What you submit</span>
                <h4>How the bid is packaged</h4>
              </div>
              <p className="card-desc">
                The portal separates eligibility documents from the price sheet, so the price is reviewed only after the required checks.
              </p>
              <div className="covers-list">
                {dossier.covers.map((c) => (
                  <div key={c.cover_no} className="cover-box">
                    <div className="cover-header">
                      <span className="cover-num">Cover {c.cover_no}</span>
                      <strong className="cover-type">{c.cover_type}</strong>
                      <span className="cover-format">{c.document_type}</span>
                    </div>
                    <p className="cover-description">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Documents Download List */}
            <div className="gepnic-card">
              <div className="card-topline">
                <span className="card-eyebrow">Documents listed</span>
                <h4>What files are available</h4>
              </div>
              <p className="card-desc">
                These are the notice, drawings, specifications, or price-sheet files a bidder may need to read. Opening a source link may still require the official portal’s normal checks.
              </p>
              <div className="docs-table-wrap">
                <table className="docs-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Source Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.documents.map((doc) => (
                      <tr key={doc.doc_id}>
                        <td>
                          <div className="doc-name-cell">
                            {doc.category === 'BOQ' ? (
                              <FileSpreadsheet size={16} className="text-emerald-400" />
                            ) : (
                              <FileText size={16} className="text-sky-400" />
                            )}
                            <div>
                               <strong title={doc.name}>{doc.name.length > 30 ? `${doc.name.slice(0, 27)}…` : doc.name}</strong>
                              <small>Pub: {doc.published_date}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`doc-tag tag-${doc.category.toLowerCase()}`}>{doc.category}</span>
                        </td>
                        <td className="doc-size-cell">{doc.file_size}</td>
                        <td>
                          <a
                            href={doc.download_url || 'https://manipurtenders.gov.in/nicgep/app'}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-download-btn"
                            title="Open the official portal source action"
                          >
                            <Download size={13} />
                            <span>Open source</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 2: Fee, EMD & Contract Rules */}
      {activeSubTab === 'rules' && (
        <div className="gepnic-tab-content" id="gepnic-panel-rules" role="tabpanel" aria-labelledby="gepnic-tab-rules" tabIndex={0}>
          <div className="dossier-grid-3col">
            {/* Tender Fee Box */}
            <div className="gepnic-card">
              <div className="card-topline">
                <span className="card-eyebrow">Tender fee</span>
                <h4>What it costs to enter</h4>
              </div>
              <div className="metric-highlight">
                <span className="metric-num">{formatIndianCurrency(tender.tender_fee_inr)}</span>
                <span className="metric-label">Fee shown in the snapshot</span>
              </div>
              <div className="key-value-list">
                <div className="kv-row">
                  <span>Paid to:</span>
                  <strong>{dossier.fee_payable_to}</strong>
                </div>
                <div className="kv-row">
                  <span>Paid at:</span>
                  <strong>{dossier.fee_payable_at}</strong>
                </div>
                <div className="kv-row">
                  <span>Fee exemption:</span>
                  <span className={`status-pill ${dossier.fee_exemption_allowed ? 'pill-green' : 'pill-amber'}`}>
                    {dossier.fee_exemption_allowed ? 'Listed as allowed' : 'Not listed as allowed'}
                  </span>
                </div>
                <div className="kv-row">
                  <span>How to pay:</span>
                  <strong>{dossier.payment_mode}</strong>
                </div>
              </div>
            </div>

            {/* EMD Security Box */}
            <div className="gepnic-card">
              <div className="card-topline">
                <span className="card-eyebrow">Bid security</span>
                <h4>Money held while you bid</h4>
              </div>
              <div className="metric-highlight">
                <span className="metric-num">{formatIndianCurrency(tender.emd_amount_inr)}</span>
                <span className="metric-label">
                  {dossier.emd_percentage ? `${dossier.emd_percentage}% of Estimated Value` : 'Fixed Security'}
                </span>
              </div>
              <div className="key-value-list">
                <div className="kv-row">
                  <span>Security type:</span>
                  <strong>{dossier.emd_fee_type} ({dossier.emd_percentage || 2.0}%)</strong>
                </div>
                <div className="kv-row">
                  <span>Paid to:</span>
                  <strong>{dossier.emd_payable_to}</strong>
                </div>
                <div className="kv-row">
                  <span>Paid at:</span>
                  <strong>{dossier.emd_payable_at}</strong>
                </div>
                <div className="kv-row">
                  <span>Exemption:</span>
                  <span className={`status-pill ${dossier.emd_exemption_allowed ? 'pill-green' : 'pill-amber'}`}>
                    {dossier.emd_exemption_allowed ? 'Listed as permitted' : 'Not listed as permitted'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Governance Box */}
            <div className="gepnic-card">
              <div className="card-topline">
                <span className="card-eyebrow">Contract setup</span>
                <h4>How the work is structured</h4>
              </div>
              <div className="key-value-list">
                <div className="kv-row">
                  <span>Tender type:</span>
                  <span className="status-pill pill-blue">{dossier.tender_type}</span>
                </div>
                <div className="kv-row">
                  <span>Contract style:</span>
                  <strong className="text-amber-300">{dossier.form_of_contract} Contract</strong>
                </div>
                <div className="kv-row">
                  <span>How long a bid stays valid:</span>
                  <strong>{dossier.bid_validity_days} Days from Opening</strong>
                </div>
                <div className="kv-row">
                  <span>Expected work period:</span>
                  <strong>{dossier.period_of_work_days} Days ({Math.round(dossier.period_of_work_days / 30)} Months)</strong>
                </div>
                <div className="kv-row">
                  <span>Technical review:</span>
                  <strong>{dossier.general_tech_eval_allowed ? 'Included' : 'Manual review'}</strong>
                </div>
                <div className="kv-row">
                  <span>Currency:</span>
                  <strong>{dossier.is_multi_currency ? 'Multiple currencies listed' : 'INR listed'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Qualification Banner */}
          <div className="gepnic-card p-4 mt-4">
            <div className="card-topline">
              <span className="card-eyebrow">Who can apply</span>
              <h4>Eligibility rules in plain language</h4>
            </div>
            <p className="pre-qual-text">{dossier.pre_qualification_details}</p>
              <div className="civic-tip-box">
                <HelpCircle size={16} />
                <span>
                <strong>What to check:</strong> Are these experience, turnover, and solvency requirements clearly explained in the original notice, and can eligible local firms realistically meet them? This is a question to verify, not a finding.
                </span>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Evaluation & Disqualifications */}
      {activeSubTab === 'evaluation' && (
        <div className="gepnic-tab-content" id="gepnic-panel-evaluation" role="tabpanel" aria-labelledby="gepnic-tab-evaluation" tabIndex={0}>
          <div className="gepnic-card">
            <div className="card-topline">
              <span className="card-eyebrow">Published bid results</span>
              <h4>Who passed the published review?</h4>
            </div>
            <p className="card-desc">
              When the public record includes bid results, this view shows who passed, who did not, and what reason was published. It does not decide whether a rejection was fair.
            </p>

            {dossier.bidder_evaluations && dossier.bidder_evaluations.length > 0 ? (
              <div className="bidders-table-wrap">
                <table className="bidders-table">
                  <thead>
                    <tr>
                       <th>Bidder</th>
                       <th>Result</th>
                       <th>Why / note</th>
                       <th>Rank</th>
                       <th>Quoted amount</th>
                       <th>Compared with estimate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.bidder_evaluations.map((bidder, idx) => (
                      <tr key={idx} className={bidder.technical_status === 'Disqualified' ? 'row-disqualified' : 'row-qualified'}>
                        <td>
                          <div className="bidder-identity">
                            <strong>{bidder.bidder_name}</strong>
                            {bidder.bidder_id && <small>ID: {bidder.bidder_id}</small>}
                          </div>
                        </td>
                        <td>
                          {bidder.technical_status === 'Qualified' ? (
                            <span className="status-pill pill-green">
                              <CheckCircle2 size={13} />
                               <span>Passed technical review</span>
                            </span>
                          ) : (
                            <span className="status-pill pill-rose">
                              <XCircle size={13} />
                               <span>Did not pass technical review</span>
                            </span>
                          )}
                        </td>
                        <td className="rejection-cell">
                          {bidder.rejection_reason ? (
                            <div className="rejection-reason-box">
                              <AlertTriangle size={14} className="text-rose-400" />
                              <span>{bidder.rejection_reason}</span>
                            </div>
                          ) : (
                             <span className="text-muted-subtle">No rejection reason listed</span>
                          )}
                        </td>
                        <td>
                          {bidder.financial_rank ? (
                            <span className={`rank-badge rank-${bidder.financial_rank.toLowerCase()}`}>
                              {bidder.financial_rank}
                            </span>
                          ) : (
                            <span className="text-muted-subtle">—</span>
                          )}
                        </td>
                        <td>
                          {bidder.quoted_amount_inr ? (
                            <strong>{formatCrores(bidder.quoted_amount_inr)}</strong>
                          ) : (
                             <span className="text-muted-subtle">Not published</span>
                          )}
                        </td>
                        <td>
                          {bidder.variance_from_estimate_pct !== undefined ? (
                            <span className={bidder.variance_from_estimate_pct <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                              {bidder.variance_from_estimate_pct > 0 ? '+' : ''}
                              {bidder.variance_from_estimate_pct.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-muted-subtle">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="evaluation-pending-box">
                <CalendarClock size={24} className="text-amber-400" />
                <div>
                  <strong>No bid results shown yet</strong>
                  <p>
                    The public record does not include bidder results here. Check the official opening or results page before drawing conclusions.
                  </p>
                </div>
              </div>
            )}

            {/* Award Record Footer if awarded */}
            {dossier.contract_number && (
              <div className="aoc-summary-card">
                <div className="aoc-title">
                  <BadgeCheck size={18} className="text-emerald-400" />
                   <strong>{isVerified ? 'Award information from the source' : 'Award fields in this preview'}</strong>
                </div>
                <div className="aoc-grid">
                  <div>
                   <span>Agreement number:</span>
                    <strong>{dossier.contract_number}</strong>
                  </div>
                  <div>
                   <span>Award date:</span>
                    <strong>{dossier.contract_awarded_date || 'Documented on Portal'}</strong>
                  </div>
                  <div>
                   <span>Selected firm:</span>
                    <strong>{tender.awarded_contractor || tender.awarded_vendor || 'Recorded Winner'}</strong>
                  </div>
                  <div>
                   <span>Award amount:</span>
                    <strong>{tender.awarded_value_inr ? formatCrores(tender.awarded_value_inr) : 'Recorded'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub Tab 4: Corrigenda Ledger */}
      {activeSubTab === 'corrigenda' && (
        <div className="gepnic-tab-content" id="gepnic-panel-corrigenda" role="tabpanel" aria-labelledby="gepnic-tab-corrigenda" tabIndex={0}>
          <div className="gepnic-card">
            <div className="card-topline">
              <span className="card-eyebrow">Changes to the notice</span>
              <h4>What changed after publication?</h4>
            </div>
            <p className="card-desc">
              A corrigendum is an official update to a tender. This timeline makes deadline extensions, scope changes, and clarifications easier to spot.
            </p>

            {dossier.corrigenda_log && dossier.corrigenda_log.length > 0 ? (
              <div className="corrigenda-ledger-list">
                {dossier.corrigenda_log.map((corr) => (
                  <div key={corr.corrigendum_no} className="corr-ledger-item">
                    <div className="corr-number-col">
                      <span className="corr-badge">No. {corr.corrigendum_no}</span>
                      <span className="corr-date">{corr.published_date}</span>
                    </div>
                    <div className="corr-body-col">
                      <div className="corr-type-line">
                        <span className={`corr-type-tag type-${corr.corrigendum_type.toLowerCase().replace(/\s+/g, '-')}`}>
                          {corr.corrigendum_type}
                        </span>
                        <strong>{corr.subject}</strong>
                      </div>
                      <p className="corr-details">{corr.details}</p>
                      {corr.doc_name && (
                        <span className="corr-doc-tag">
                          <FileText size={12} />
                          <span>{corr.doc_name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-corrigenda-box">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <div>
                  <strong>No changes listed</strong>
                  <p>No corrigenda, date extensions, or scope alterations are listed in this preview.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub Tab 5: Oversight, Nodal Officer & Debarment Verification */}
      {activeSubTab === 'oversight' && (
        <div className="gepnic-tab-content" id="gepnic-panel-oversight" role="tabpanel" aria-labelledby="gepnic-tab-oversight" tabIndex={0}>
          <div className="dossier-grid-2col">
            {/* Oversight & IEM */}
            <div className="gepnic-card">
              <div className="card-topline">
                <span className="card-eyebrow">People and contacts</span>
                <h4>Who is responsible for this tender?</h4>
              </div>
              <div className="key-value-list">
                <div className="kv-row">
                  <span>Independent monitor:</span>
                  <strong>{dossier.independent_external_monitor || 'Not listed in this preview'}</strong>
                </div>
                <div className="kv-row">
                  <span>Pre-bid meeting:</span>
                  <strong>{dossier.pre_bid_meeting_venue || 'Not listed'}</strong>
                </div>
                <div className="kv-row">
                  <span>Meeting date:</span>
                  <strong>{dossier.pre_bid_meeting_date || 'Not listed'}</strong>
                </div>
                <div className="kv-row">
                  <span>Bid opening location:</span>
                  <strong>{dossier.bid_opening_place || 'Not listed'}</strong>
                </div>
              </div>

              {dossier.nodal_officer && (
                <div className="nodal-officer-box mt-4">
                  <div className="nodal-title">
                    <UserCheck size={16} className="text-sky-400" />
                    <strong>Main contact for this tender</strong>
                  </div>
                  <p className="nodal-name">{dossier.nodal_officer.name}</p>
                  <p className="nodal-role">{dossier.nodal_officer.designation} · {dossier.nodal_officer.office}</p>
                  {dossier.nodal_officer.contact && (
                    <small className="nodal-contact">Contact: {dossier.nodal_officer.contact}</small>
                  )}
                </div>
              )}
            </div>

            {/* Debarment Registry Verification */}
            <div className="gepnic-card">
              <div className="card-topline">
                <span className="card-eyebrow">Debarment register</span>
                <h4>Has a registry check been done?</h4>
              </div>
              <div className="debarment-status-box">
                <div className="debarment-badge-row">
                  <span className={`debarment-status-pill ${debarmentTone}`}>
                    {dossier.debarment_status === 'CLEARED' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    <span>{debarmentLabel}</span>
                  </span>
                  <a
                    href="https://manipurtenders.gov.in/#/DebarmentList"
                    target="_blank"
                    rel="noreferrer"
                    className="debarment-registry-link"
                  >
                    <span>Open official register</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
                <p className="debarment-note">{dossier.debarment_check_note}</p>
              </div>

              <div className="gepnic-footer-alert">
                <Building2 size={16} />
                <span>
                  The official portal publishes a public debarment route. This preview does not claim that a completed entity match was performed.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
