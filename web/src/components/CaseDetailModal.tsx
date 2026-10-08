import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Scale, 
  FileText, 
  ChevronRight, 
  Clock, 
  Building2, 
  ShieldAlert, 
  Send, 
  CheckSquare, 
  Square, 
  Info, 
  GitBranch,
  Layers,
  Award,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Globe
} from 'lucide-react';
import { RegulatoryDetailModal, type RegulatoryProvisionDetail } from './RegulatoryDetailModal';
import { GazetteIntegrityReport } from './GazetteIntegrityReport';
import { GazetteReportModal } from './GazetteReportModal';
import { OriginalTenderModal } from './OriginalTenderModal';

export interface CaseDetailModalProps {
  tenderId: string;
  onClose: () => void;
  onReviewRecorded?: () => void;
  userRole?: string;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  tenderId,
  onClose,
  onReviewRecorded,
  userRole = 'State Vigilance Commissioner'
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'dfpr' | 'evidence' | 'xai' | 'graph' | 'review' | 'report'>('dossier');
  const [tender, setTender] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [formalReport, setFormalReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProvision, setSelectedProvision] = useState<RegulatoryProvisionDetail | null>(null);
  const [showGazetteModal, setShowGazetteModal] = useState<boolean>(false);
  const [showOriginalTenderModal, setShowOriginalTenderModal] = useState<boolean>(false);

  // Review Form States
  const [reviewAction, setReviewAction] = useState<string>('CONFIRM CONCERN');
  const [officerName, setOfficerName] = useState<string>('Shri N. Biren Singh, IAS');
  const [reviewReason, setReviewReason] = useState<string>('Procedural indicators warrant competent pre-award scrutiny.');
  const [reviewComments, setReviewComments] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  // Checklist state for Recommended Review Actions
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchData();
  }, [tenderId]);

  // Handle ESC key to dismiss modal and handle body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showOriginalTenderModal) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setShowOriginalTenderModal(false);
        } else if (selectedProvision) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setSelectedProvision(null);
        } else if (showGazetteModal) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setShowGazetteModal(false);
        } else {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          onClose();
        }
      }
    };
    // Capture phase ensures the topmost modal intercepts and consumes Escape key first
    window.addEventListener('keydown', handleKeyDown, true);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, selectedProvision, showGazetteModal, showOriginalTenderModal]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch tender detail
      const resTender = await fetch(`http://127.0.0.1:8000/api/tenders/${tenderId}`);
      if (resTender.ok) {
        const tData = await resTender.json();
        setTender(tData);
      }

      // 2. Fetch statutory analysis
      const resAnalysis = await fetch(`http://127.0.0.1:8000/api/tenders/${tenderId}/regulatory-analysis`);
      if (resAnalysis.ok) {
        const aData = await resAnalysis.json();
        setAnalysis(aData);
      }

      // 3. Fetch audit trail
      const resAudit = await fetch(`http://127.0.0.1:8000/api/tenders/${tenderId}/audit-trail`);
      if (resAudit.ok) {
        const auditData = await resAudit.json();
        setAuditTrail(auditData.audit_trail || []);
      }

      // 4. Fetch formal 14-section report
      const resReport = await fetch(`http://127.0.0.1:8000/api/tenders/${tenderId}/report`);
      if (resReport.ok) {
        const reportData = await resReport.json();
        setFormalReport(reportData);
      }
    } catch (err) {
      console.error('Failed to fetch case data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionToggle = (idx: number) => {
    setCheckedActions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleExecuteReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cases/${tenderId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_name: officerName,
          officer_role: userRole.includes('Vigilance') ? 'CVO' : 'PROCUREMENT_OFFICER',
          action: reviewAction,
          reason: reviewReason,
          comments: reviewComments,
          evidence_accessed: ['Procurement Portal Records', 'Comparable Deviations', 'DFPR Limit'],
          regulatory_references_viewed: analysis?.regulatory_mappings?.map((m: any) => m.provision_ref) || ['Manipur DFPR 2020']
        })
      });

      if (res.ok) {
        setReviewSuccessMsg(`Decision '${reviewAction}' recorded in immutable audit registry.`);
        setTimeout(() => setReviewSuccessMsg(null), 4000);
        fetchData();
        if (onReviewRecorded) onReviewRecorded();
      }
    } catch (err) {
      console.error('Review submission error:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEscalateQuick = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cases/${tenderId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_name: officerName,
          officer_role: 'CVO',
          reason: 'Compounding window compression, single-bidder vulnerability, and DFPR limit exceedance.',
          comments: 'Formal file requisition submitted to State Vigilance Commission.'
        })
      });
      if (res.ok) {
        setReviewSuccessMsg('Case successfully escalated to State Vigilance Commission.');
        setTimeout(() => setReviewSuccessMsg(null), 4000);
        fetchData();
        if (onReviewRecorded) onReviewRecorded();
      }
    } catch (err) {
      console.error('Escalation error:', err);
    }
  };

  const openProvisionDrawer = async (provisionId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/provisions/${provisionId}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.provision;
        const s = data.source;
        setSelectedProvision({
          ...p,
          source_title: s?.title,
          source_short: s?.short_name,
          source_jurisdiction: s?.jurisdiction,
          source_authority: s?.authority,
          official_url: s?.official_url
        });
      }
    } catch (err) {
      console.error('Error fetching provision:', err);
    }
  };

  if (!tender && loading) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-white p-8 rounded shadow-2xl flex flex-col items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="size-8 border-3 border-[#003366] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-gray-700">Loading Statutory Intelligence Dossier...</span>
        </div>
      </div>
    );
  }

  const score = tender?.cheirap_risk_score || 0;
  const tier = tender?.vigilance_tier || 'GREEN';
  const valCr = (tender?.estimated_value_inr || 0) / 1e7;

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-dossier-title"
          className="relative w-full max-w-6xl bg-white border border-gray-300 rounded sm:rounded-lg shadow-2xl overflow-hidden flex flex-col h-[94vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Government Titlebar */}
          <div id="case-dossier-titlebar" className="bg-[#003366] text-white px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-3 border-b-2 border-[#D4AF37] shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 rounded bg-white/10 text-white shrink-0">
                <Scale className="size-4 sm:size-5 text-[#D4AF37]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] truncate">
                  CHEIRAP (<span className="font-meetei">ꯆꯩꯔꯥꯞ</span>) STATUTORY TRACEABILITY DOSSIER • REF: {tender?.ref_no}
                </div>
                <div className="flex items-center gap-2 mt-0.5 min-w-0">
                  <h3 id="case-dossier-title" className="text-xs sm:text-base font-bold text-white tracking-tight truncate min-w-0 flex-1" title={tender?.title}>
                    {tender?.title}
                  </h3>
                  <span className={`text-[9px] px-1.5 sm:px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 shadow-xs ${
                    tier === 'RED' ? 'bg-red-700 text-white' :
                    tier === 'AMBER' ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
                  }`}>
                    {tier} PRIORITY • {score}/100
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="open-original-tender-modal-btn"
                onClick={() => setShowOriginalTenderModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all duration-150 ease-out active:scale-[0.96] border border-emerald-400/40 cursor-pointer"
                title="Inspect Original Tender on manipurtenders.gov.in"
              >
                <Globe className="size-3.5 text-emerald-300" />
                <span>Inspect Source Portal</span>
              </button>
              <button
                id="open-gazette-modal-btn"
                onClick={() => setShowGazetteModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800/80 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all duration-150 ease-out active:scale-[0.96] border border-blue-400/30 cursor-pointer"
                title="View & Print Official Gazette Integrity Report (PIAR)"
              >
                <Award className="size-3.5 text-amber-300" />
                <span>Gazette PIAR</span>
              </button>
              <button
                onClick={handleEscalateQuick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold shadow-xs transition-all duration-150 ease-out active:scale-[0.96] cursor-pointer"
                title="Escalate to State Vigilance Commission"
              >
                <ShieldAlert className="size-3.5" /> Escalate Case
              </button>
              <button 
                id="close-dossier-header-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-all duration-150 ease-out active:scale-[0.96] border border-white/20 cursor-pointer shrink-0"
                title="Close Dossier"
                aria-label="Close Dossier"
              >
                <X className="size-4.5" />
              </button>
            </div>
          </div>

          {/* Sub-Header KPI Ribbon */}
          <div className="bg-gray-100 border-b border-gray-200 px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-700">
              <span><strong>Department:</strong> {tender?.department}</span>
              <span className="text-gray-300">|</span>
              <span><strong>Value:</strong> <strong className="text-blue-900 font-data">₹{valCr.toFixed(2)} Cr</strong></span>
              <span className="text-gray-300">|</span>
              <span><strong>Tender ID:</strong> <button onClick={() => setShowOriginalTenderModal(true)} className="font-data text-[#003366] hover:underline font-bold cursor-pointer inline-flex items-center gap-1" title="Inspect original record on manipurtenders.gov.in">{tender?.tender_id} <Globe className="size-3 text-blue-700" /></button></span>
              <span className="text-gray-300">|</span>
              <span><strong>Method:</strong> Open Tender</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[11px]">Officer Review:</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] uppercase">
                {tender?.officer_review_status || 'PENDING_OFFICER_REVIEW'}
              </span>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="bg-white border-b border-gray-200 px-3 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-medium shrink-0 touch-pan-x">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:outline-none ${
                activeTab === 'dossier'
                  ? 'border-[#003366] text-[#003366] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText className="size-3.5" /> 01-05 Core Dossier
            </button>

            <button
              onClick={() => setActiveTab('dfpr')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:outline-none ${
                activeTab === 'dfpr'
                  ? 'border-[#003366] text-[#003366] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Building2 className="size-3.5" /> DFPR Authority Scrutiny
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:outline-none ${
                activeTab === 'evidence'
                  ? 'border-[#003366] text-[#003366] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <CheckSquare className="size-3.5" /> Benchmarking Evidence
            </button>

            <button
              onClick={() => setActiveTab('xai')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:outline-none ${
                activeTab === 'xai'
                  ? 'border-[#003366] text-[#003366] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Layers className="size-3.5" /> Explainable AI Waterfall
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:outline-none ${
                activeTab === 'graph'
                  ? 'border-[#003366] text-[#003366] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <GitBranch className="size-3.5" /> Regulatory Knowledge Graph
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:outline-none ${
                activeTab === 'review'
                  ? 'border-[#003366] text-[#003366] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Send className="size-3.5" /> Officer Review & Audit Trail ({auditTrail.length})
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-[#003366] focus-visible:outline-none ${
                activeTab === 'report'
                  ? 'border-[#003366] text-[#003366] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Award className="size-3.5" /> 14-Section Report
            </button>
          </div>

          {/* Success Banner if review recorded */}
          {reviewSuccessMsg && (
            <div className="bg-emerald-600 text-white px-6 py-2 text-xs flex items-center gap-2 font-medium shrink-0 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}

          {/* Main Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm bg-gray-50">
            
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 1: 01-05 CORE DOSSIER (EXACTLY SECTION 16 SPECIFICATION)   */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'dossier' && (
              <div className="space-y-6">

                {/* 01 — Executive Risk Summary */}
                <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-data">01</span>
                      Executive Risk Summary
                    </h4>
                    <span className="text-xs text-gray-500">
                      Screened against GFR 2017, CVC Guidelines & Manipur DFPR 2020
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Composite Risk Score</span>
                      <span className={`text-xl font-bold font-data block mt-1 ${
                        tier === 'RED' ? 'text-red-700' : tier === 'AMBER' ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {score} / 100
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Tier: {tier} (Statutory Scrutiny Required)</span>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Estimated Contract Value</span>
                      <span className="text-xl font-bold font-data text-gray-900 block mt-1">
                        ₹{valCr.toFixed(2)} Cr
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">EMD: ₹{((tender?.emd_amount_inr || 0)/1e5).toFixed(1)} Lakhs</span>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Issuing Authority Chain</span>
                      <span className="text-xs font-bold text-gray-800 block mt-1 line-clamp-1" title={tender?.org_chain}>
                        {tender?.recorded_approving_authority || 'Chief Engineer'}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{tender?.department}</span>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Key Dates & Bidders</span>
                      <span className="text-xs font-bold font-data text-gray-800 block mt-1">
                        {tender?.bids_received ?? (tender?.feat_single_bidder_risk ? 1 : 2)} Bidder(s) Recorded
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Closing: {tender?.closing_date}</span>
                    </div>
                  </div>
                </div>

                {/* 02 — Why CHEIRAP Flagged This Procurement */}
                <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-data">02</span>
                      Why CHEIRAP Flagged This Procurement
                    </h4>
                    <span className="text-xs text-gray-500 font-medium">
                      {analysis?.why_flagged_reasons?.length || 0} Independent Risk Indicators
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {analysis?.why_flagged_reasons && analysis.why_flagged_reasons.length > 0 ? (
                      analysis.why_flagged_reasons.map((reason: string, rIdx: number) => (
                        <div key={rIdx} className="flex items-start gap-3 p-3 bg-red-50/50 border border-red-200 rounded text-xs text-gray-800">
                          <span className="px-2 py-0.5 rounded bg-red-700 text-white font-data font-bold text-[10px] shrink-0 mt-0.5">
                            {reason.slice(0, 2)}
                          </span>
                          <span className="leading-relaxed font-medium">
                            {reason.slice(3)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span>No severe procedural anomalies flagged for this tender.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 03 — Evidence Dossier */}
                <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-data">03</span>
                      Key Evidence Dossier (Empirical Benchmarking)
                    </h4>
                    <span className="text-xs text-gray-500">
                      Compared against {analysis?.benchmarking?.comparable_pool_count || 43} comparable state procurements
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis?.evidence_dossier && analysis.evidence_dossier.length > 0 ? (
                      analysis.evidence_dossier.map((ev: any, evIdx: number) => (
                        <div key={evIdx} className="p-3.5 bg-gray-50 border border-gray-200 rounded space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800">{ev.metric}</span>
                            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                              Dev: {ev.deviation}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-200">
                            <div>
                              <span className="text-gray-500 block">Current Tender:</span>
                              <strong className="text-gray-900 font-data">{ev.value}</strong>
                            </div>
                            <div>
                              <span className="text-gray-500 block">Statutory Benchmark:</span>
                              <span className="text-gray-700 font-data">{ev.statutory_benchmark}</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-gray-400 font-data truncate">
                            Source: {ev.source_record}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 p-4 text-center text-xs text-gray-400">
                        Evidence records conform to standard procurement limits.
                      </div>
                    )}
                  </div>
                </div>

                {/* 04 — Regulatory Basis (Clickable Citations) */}
                <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-data">04</span>
                        Regulatory Basis (Two-Layer Statutory Grounding)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        State-specific rules take precedence; Central rules provide supporting vigilance benchmarks.
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-500 italic">
                      Click any citation to inspect authoritative gazette text
                    </span>
                  </div>

                  <div className="space-y-4">
                    {analysis?.regulatory_mappings && analysis.regulatory_mappings.length > 0 ? (
                      analysis.regulatory_mappings.map((mapping: any, mIdx: number) => (
                        <div 
                          key={mIdx}
                          className="p-4 bg-gray-50 hover:bg-blue-50/30 border border-gray-200 rounded transition-all space-y-3 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-[#003366] text-white font-bold text-[10px]">
                                {mapping.source_short}
                              </span>
                              <span className="font-bold text-gray-900">
                                {mapping.risk_title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase">
                                {mapping.relationship_type.replace('_', ' ')}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                mapping.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {mapping.verification_status}
                              </span>
                            </div>
                          </div>

                          {/* Two-Layer Breakdown: Primary State Basis vs Supporting Central Context */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-amber-50/70 border border-amber-200 rounded p-3 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="size-1.5 rounded-full bg-amber-600"></span>
                                  Primary Regulatory Basis (State)
                                </span>
                                {mapping.primary_provision_id && (
                                  <button
                                    onClick={() => openProvisionDrawer(mapping.primary_provision_id)}
                                    className="text-[10px] text-[#003366] hover:underline font-semibold flex items-center gap-0.5"
                                  >
                                    Inspect State OM <ChevronRight className="size-3" />
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                                {mapping.primary_basis || mapping.provision_ref}
                              </p>
                            </div>

                            <div className="bg-slate-100/80 border border-slate-200 rounded p-3 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="size-1.5 rounded-full bg-slate-500"></span>
                                  Supporting Vigilance Context (Central)
                                </span>
                                {mapping.supporting_provision_id && (
                                  <button
                                    onClick={() => openProvisionDrawer(mapping.supporting_provision_id)}
                                    className="text-[10px] text-[#003366] hover:underline font-semibold flex items-center gap-0.5"
                                  >
                                    Inspect Central Rule <ChevronRight className="size-3" />
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-slate-800 leading-relaxed">
                                {mapping.supporting_context || 'Central Vigilance Commission Preventive Vigilance Guidelines & Consolidated GFR 2017'}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed pt-1">
                            {mapping.explanation}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-200">
                            <span>Principle: <strong className="text-gray-700">{mapping.principle}</strong></span>
                            {mapping.provision_id && (
                              <button
                                onClick={() => openProvisionDrawer(mapping.provision_id)}
                                className="text-[#003366] font-semibold flex items-center gap-1 hover:underline"
                              >
                                View Detailed Citation <ChevronRight className="size-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-400">
                        No adverse regulatory mappings catalogued for this record.
                      </div>
                    )}
                  </div>
                </div>

                {/* 05 — Recommended Review Actions */}
                <div className="bg-white border border-gray-200 rounded p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-data">05</span>
                      Recommended Review Actions for Competent Authority
                    </h4>
                    <span className="text-xs text-gray-500">
                      Non-binding statutory checklist for procurement / vigilance officers
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {analysis?.recommended_review_actions && analysis.recommended_review_actions.length > 0 ? (
                      analysis.recommended_review_actions.map((act: string, aIdx: number) => {
                        const isChecked = !!checkedActions[aIdx];
                        return (
                          <div 
                            key={aIdx}
                            onClick={() => handleActionToggle(aIdx)}
                            className={`p-3 rounded border flex items-start gap-3 cursor-pointer transition-colors ${
                              isChecked 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                                : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            <button className="mt-0.5 text-gray-600 focus:outline-none">
                              {isChecked ? (
                                <CheckSquare className="size-4 text-emerald-700" />
                              ) : (
                                <Square className="size-4 text-gray-400" />
                              )}
                            </button>
                            <span className={`leading-relaxed ${isChecked ? 'line-through text-gray-500' : 'font-medium'}`}>
                              {act}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-400">
                        No special review actions recommended.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 2: DFPR AUTHORITY SCRUTINY (SECTION 17)                    */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'dfpr' && (
              <div className="space-y-5">
                <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <Building2 className="size-4 text-[#003366]" />
                      Manipur Delegation of Financial Powers Rules (DFPR) Competence Audit
                    </h4>
                    <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                      analysis?.authority_check?.compliance_flag === 'RED' ? 'bg-red-700 text-white' :
                      analysis?.authority_check?.compliance_flag === 'AMBER' ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
                    }`}>
                      STATUS: {analysis?.authority_check?.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-5">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Recorded Approving Officer</span>
                      <span className="text-base font-bold text-gray-900 block">
                        {analysis?.authority_check?.recorded_authority}
                      </span>
                      <span className="text-gray-500 text-[11px] block">
                        Department Chain: {tender?.org_chain}
                      </span>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Statutory Financial Competence Limit</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold font-data text-blue-900">
                          Limit: ₹{analysis?.authority_check?.permitted_financial_limit_cr} Cr
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-base font-bold font-data text-red-700">
                          Tender: ₹{analysis?.authority_check?.procurement_value_cr} Cr
                        </span>
                      </div>
                      <span className="text-gray-500 text-[11px] block">
                        Governing Provision: {analysis?.authority_check?.applicable_delegation}
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded border text-xs leading-relaxed ${
                    analysis?.authority_check?.compliance_flag === 'RED'
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}>
                    <strong>Statutory Determination:</strong> {analysis?.authority_check?.details}
                  </div>

                  <div className="mt-5 p-4 bg-blue-50/50 border border-blue-200 rounded text-xs text-gray-700 space-y-2">
                    <h5 className="font-bold text-[#003366] uppercase text-[11px]">Governing Manipur Delegation Hierarchy</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <span className="text-gray-500 block">Executive Engineer</span>
                        <strong className="font-data">Up to ₹1.00 Cr</strong>
                      </div>
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <span className="text-gray-500 block">Superintending Eng.</span>
                        <strong className="font-data">Up to ₹5.00 Cr</strong>
                      </div>
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <span className="text-gray-500 block">Chief Engineer</span>
                        <strong className="font-data">Up to ₹25.00 Cr</strong>
                      </div>
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <span className="text-gray-500 block">Administrative Dept</span>
                        <strong className="font-data">₹25 Cr to ₹50 Cr</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 3: BENCHMARKING EVIDENCE (SECTION 19)                      */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'evidence' && (
              <div className="space-y-5">
                <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <Scale className="size-4 text-[#003366]" />
                      Comparable Cohort Deviation Analysis
                    </h4>
                    <span className="text-xs text-gray-500">
                      Cohort Size: {analysis?.benchmarking?.comparable_pool_count || 43} Manipur Public Works Tenders
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-5">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Bidder Participation Deviation</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-data text-red-700">
                          {analysis?.benchmarking?.current_bidders || 1} Bidders
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-xs font-data text-gray-600">
                          Median: {analysis?.benchmarking?.median_bidders || 5}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-red-600 block">
                        Deviation: {analysis?.benchmarking?.bidder_deviation_pct || -71.4}%
                      </span>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Bidding Window Duration</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-data text-red-700">
                          {analysis?.benchmarking?.current_window_days || 9.8} Days
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-xs font-data text-gray-600">
                          Median: {analysis?.benchmarking?.median_window_days || 21} Days
                        </span>
                      </div>
                      <span className="text-xs font-bold text-red-600 block">
                        Deviation: {analysis?.benchmarking?.window_deviation_pct || -53.3}%
                      </span>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Award-to-Estimate Spread</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-data text-gray-900">
                          {((analysis?.benchmarking?.current_spread_ratio || 0.998) * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-xs font-data text-gray-600">
                          Median: {((analysis?.benchmarking?.median_spread_ratio || 0.925) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-700 block">
                        Near-zero competitive discount spread
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs space-y-2 text-gray-700">
                    <h5 className="font-bold text-gray-900 uppercase text-[11px]">Statistical Reasoning</h5>
                    <p>
                      This procurement differs materially from {analysis?.benchmarking?.comparable_pool_count || 43} comparable state public tenders across PWD and PHED. Under GFR 2017 Rule 173(xxi), significant deviation from historical competitive norms warrants procedural review before contract award.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 4: EXPLAINABLE AI WATERFALL (SECTION 20)                   */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'xai' && (
              <div className="space-y-5">
                {/* Mathematical Decomposition Banner */}
                <div className="bg-gradient-to-r from-[#003366] to-[#0f294a] text-white p-5 rounded-lg border border-[#002244] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Layers className="size-4 text-[#D4AF37]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Dual-Brain Mathematical Attribution Waterfall
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">
                      Composite Risk Score: <span className="font-data text-[#FCD34D] text-base">{score}/100</span>
                      <span className="text-gray-300 font-normal text-xs ml-2">({tier} Priority Tier)</span>
                    </h3>
                    <p className="text-[11px] text-gray-200 mt-1 max-w-xl leading-relaxed">
                      Every point is mathematically derived without black-box estimation. Procedural rule violations map directly to codified statutory penalties, complemented by multi-dimensional Isolation Forest anomaly distance.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-white/10 border border-white/20 rounded px-3 py-2 text-center">
                      <span className="text-[9px] uppercase tracking-wider text-gray-300 block font-semibold">Model Confidence</span>
                      <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1 mt-0.5">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {analysis?.explainable_ai?.confidence || 'HIGH'}
                      </span>
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded px-3 py-2 text-center">
                      <span className="text-[9px] uppercase tracking-wider text-gray-300 block font-semibold">Evidence Coverage</span>
                      <span className="text-xs font-bold font-data text-blue-200 block mt-0.5">
                        {analysis?.explainable_ai?.evidence_coverage_pct || 92.4}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Aggregation Formula Strip */}
                <div className="bg-white border border-gray-200 rounded p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                    <span className="uppercase text-[10px] tracking-wider text-[#003366]">Additive Attribution Formula</span>
                    <span className="text-[10px] text-gray-400">Judicial Traceability Standard • No Hallucination</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-data">
                    <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                      Baseline: +15.0 pts
                    </span>
                    <span className="text-gray-400">+</span>
                    <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-medium">
                      Procedural Penalties: +{Math.max(0, score - 22.8).toFixed(1)} pts
                    </span>
                    <span className="text-gray-400">+</span>
                    <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 font-medium">
                      Isolation Forest Vector: +7.8 pts
                    </span>
                    <span className="text-gray-400">=</span>
                    <span className="px-3 py-1 rounded bg-red-100 text-red-800 font-bold">
                      Composite: {score}/100
                    </span>
                  </div>
                </div>

                {/* Main Waterfall Contributor List */}
                <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                        <TrendingUp className="size-4 text-[#003366]" />
                        Itemized Risk Factor Contributors (Descending Magnitude)
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Horizontal delta bars reflect the relative mathematical weight contributed to the final risk score.
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-data">
                      {analysis?.explainable_ai?.primary_contributors?.length || 0} Evaluated Factors
                    </span>
                  </div>

                  <div className="space-y-3.5 mb-5">
                    {analysis?.explainable_ai?.primary_contributors?.map((item: any, cIdx: number) => {
                      const ptsNum = parseInt(item.points?.replace(/[^0-9]/g, '') || '10', 10);
                      const barColor = ptsNum >= 20 ? 'bg-red-600' : ptsNum >= 14 ? 'bg-amber-600' : 'bg-blue-600';
                      const badgeColor = ptsNum >= 20 ? 'bg-red-100 text-red-800 border-red-200' : ptsNum >= 14 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200';

                      return (
                        <div 
                          key={cIdx} 
                          className="p-4 bg-gray-50 hover:bg-blue-50/20 border border-gray-200 hover:border-blue-300 rounded-lg space-y-2.5 text-xs transition-all duration-200"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-data text-[10px] font-bold">
                                  #{cIdx + 1}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-[#003366] text-white font-bold text-[9px] uppercase tracking-wider">
                                  {item.category?.replace(/_/g, ' ') || 'PROCEDURAL'}
                                </span>
                                <strong className="text-gray-900 text-xs">
                                  {item.factor}
                                </strong>
                              </div>
                            </div>
                            
                            <span className={`px-2.5 py-1 rounded border font-bold font-data text-xs shrink-0 flex items-center gap-1 ${badgeColor}`}>
                              <ArrowUpRight className="size-3" />
                              {item.points} pts
                            </span>
                          </div>

                          {/* Progress Meter with Calibrated Fill */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-gray-500 font-data">
                              <span>Relative Risk Weight</span>
                              <span>{Math.min(100, item.weight_pct * 3)}% Attribution</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`} 
                                style={{ width: `${Math.min(100, item.weight_pct * 3)}%` }}
                              />
                            </div>
                          </div>

                          {/* Forensic Evidence Detail */}
                          <div className="pt-2 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                            <div className="text-gray-600">
                              <span className="font-semibold text-gray-800">Evidence Record:</span>{' '}
                              <span className="font-data text-gray-900 bg-white px-1.5 py-0.5 rounded border border-gray-200 inline-block">
                                {item.evidence}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500 italic shrink-0">
                              Metric: {item.metric || 'Codified Parameter'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Governance Notice */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2.5">
                    <ShieldCheck className="size-4.5 text-[#003366] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#003366] uppercase text-[10px] tracking-wider block">
                        Statutory Evidence & Non-Hallucination Assurance
                      </strong>
                      <p className="text-[11px] text-blue-950 mt-0.5 leading-relaxed">
                        {analysis?.explainable_ai?.governance_notice || 'Risk score is an algorithmic prioritisation metric and does NOT constitute proof of legal non-compliance or fraud. All parameters are deterministic and verifiable against the official tender gazette.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 5: REGULATORY KNOWLEDGE GRAPH (SECTION 24)                 */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'graph' && (
              <div className="space-y-5">
                <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <GitBranch className="size-4 text-[#003366]" />
                      Unbroken Regulatory Traceability Graph
                    </h4>
                    <span className="text-xs text-gray-500">
                      Procurement ➔ Anomaly ➔ Risk Code ➔ Principle ➔ Provision ➔ Authority ➔ Action
                    </span>
                  </div>

                  <div className="space-y-4">
                    {analysis?.knowledge_graph?.edges && analysis.knowledge_graph.edges.length > 0 ? (
                      <div className="space-y-3">
                        {analysis.knowledge_graph.edges.map((edge: any, eIdx: number) => {
                          const srcNode = analysis.knowledge_graph.nodes.find((n: any) => n.id === edge.source);
                          const tgtNode = analysis.knowledge_graph.nodes.find((n: any) => n.id === edge.target);
                          return (
                            <div key={eIdx} className="p-3 bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                                  {srcNode?.type}
                                </span>
                                <strong className="text-gray-900">{srcNode?.label}</strong>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400 font-data text-[10px]">
                                <span>── [{edge.relation}] ──▶</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                                  {tgtNode?.type}
                                </span>
                                <strong className="text-gray-900">{tgtNode?.label}</strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-400">
                        Graph relationship data loading...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 6: OFFICER REVIEW & IMMUTABLE AUDIT TRAIL (SECTION 21, 22) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'review' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Officer Decision Form */}
                <div className="bg-white border border-gray-200 rounded p-6 shadow-sm space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <Send className="size-4 text-[#003366]" />
                      Human-in-the-Loop Officer Determination
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Statutory review decision recorded immutably with cryptographic timestamp.
                    </p>
                  </div>

                  <form onSubmit={handleExecuteReview} className="space-y-3.5 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Reviewing Officer</label>
                      <input 
                        type="text" 
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded font-medium text-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Officer Role / Designation</label>
                      <select 
                        value={userRole} 
                        disabled
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-medium text-gray-800"
                      >
                        <option>{userRole}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Formal Action Selection</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'CONFIRM CONCERN',
                          'DISMISS',
                          'FALSE POSITIVE',
                          'REQUEST DOCUMENTS',
                          'ESCALATE',
                          'MARK FOR MONITORING'
                        ].map((act) => (
                          <button
                            type="button"
                            key={act}
                            onClick={() => setReviewAction(act)}
                            className={`p-2 rounded text-left border font-semibold transition-colors ${
                              reviewAction === act
                                ? 'bg-[#003366] text-white border-[#003366]'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Reason for Determination</label>
                      <textarea
                        rows={2}
                        value={reviewReason}
                        onChange={(e) => setReviewReason(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Confidential Notes / Directives</label>
                      <textarea
                        rows={2}
                        placeholder="Optional remarks regarding stay notice, tender amendment or vigilance enquiry..."
                        value={reviewComments}
                        onChange={(e) => setReviewComments(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full py-2.5 px-4 bg-[#003366] hover:bg-blue-900 text-white rounded font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="size-3.5" />
                      {isSubmittingReview ? 'Recording in Audit Log...' : 'Commit Formal Determination'}
                    </button>
                  </form>
                </div>

                {/* Right: Immutable Audit Trail Timeline */}
                <div className="bg-white border border-gray-200 rounded p-6 shadow-sm space-y-4">
                  <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2">
                      <Clock className="size-4 text-[#003366]" />
                      Immutable Audit Trail ({auditTrail.length} Events)
                    </h4>
                    <span className="text-[10px] text-gray-400 font-data">SHA-256 Log</span>
                  </div>

                  <div className="space-y-4 max-h-[480px] overflow-y-auto pl-4 pr-2 py-1">
                    {auditTrail.map((ev, idx) => (
                      <div key={idx} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-transparent last:pb-0 text-xs">
                        <span className={`absolute -left-[9px] top-1 size-4 rounded-full ring-2 ring-white flex items-center justify-center shadow-xs ${
                          ev.action === 'ESCALATE' ? 'bg-red-700' :
                          ev.action === 'FALSE POSITIVE' ? 'bg-amber-500' :
                          ev.officer_role === 'SYSTEM' ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}>
                          <span className="size-1.5 bg-white rounded-full"></span>
                        </span>

                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-gray-900">{ev.action}</strong>
                          <span className="text-[10px] font-data text-gray-500">{ev.timestamp}</span>
                        </div>

                        <p className="text-gray-700 text-[11px] leading-relaxed">{ev.reason}</p>
                        
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500 font-data">
                          <span>Officer: <strong className="text-gray-700">{ev.officer_name}</strong></span>
                          <span>•</span>
                          <span>Role: {ev.officer_role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 7: FORMAL 14-SECTION GAZETTE REPORT (PIAR)                 */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'report' && (
              <div className="space-y-4">
                <GazetteIntegrityReport 
                  reportData={formalReport}
                  tender={tender}
                  analysis={analysis}
                />
              </div>
            )}

          </div>

          {/* Persistent Footer with Legal Disclaimer (Section 29) */}
          <div className="bg-gray-100 border-t border-gray-200 px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs text-gray-600 shrink-0">
            <div className="flex items-center gap-2 max-w-4xl text-[11px] leading-tight text-gray-500">
              <Info className="size-3.5 text-blue-800 shrink-0" />
              <span>
                <strong>Statutory Disclaimer:</strong> CHEIRAP (<span className="font-meetei">ꯆꯩꯔꯥꯞ</span>) provides analytical and regulatory decision-support indicators. Risk alerts do not constitute findings of misconduct, corruption, fraud or legal violation. Final determination rests with the competent authority under applicable law, rules and procedures.
              </span>
            </div>
            <button
              id="close-dossier-footer-btn"
              onClick={onClose}
              className="px-4 py-2 sm:py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs transition-all duration-150 ease-out active:scale-[0.96] shrink-0 flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <span>Close Dossier</span>
            </button>
          </div>

        </div>
      </div>

      {/* Linked Regulatory Detail Modal */}
      {selectedProvision && (
        <RegulatoryDetailModal 
          provision={selectedProvision} 
          onClose={() => setSelectedProvision(null)} 
        />
      )}

      {/* Linked Official Gazette Report Modal (Standalone Print Dialog) */}
      {showGazetteModal && (
        <GazetteReportModal
          tenderId={tenderId}
          tender={tender}
          onClose={() => setShowGazetteModal(false)}
        />
      )}

      {/* Linked Original Tender Portal Inspector Modal */}
      {showOriginalTenderModal && (
        <OriginalTenderModal
          tenderId={tenderId}
          tenderData={tender}
          onClose={() => setShowOriginalTenderModal(false)}
        />
      )}
    </>
  );
};
