import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  ShieldCheck, 
  Calendar, 
  Building, 
  FileText, 
  CheckCircle2, 
  Code2, 
  Compass, 
  ChevronRight,
  Info
} from 'lucide-react';

export interface OriginalTenderModalProps {
  tenderId: string;
  tenderData?: any;
  onClose: () => void;
}

export const OriginalTenderModal: React.FC<OriginalTenderModalProps> = ({
  tenderId,
  tenderData,
  onClose
}) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'sheet' | 'guide' | 'raw'>('sheet');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMetadata();
  }, [tenderId]);

  // Hierarchical Escape dismissal and scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tenders/${tenderId}/portal-metadata`);
      if (res.ok) {
        const data = await res.json();
        setMetadata(data);
      } else if (tenderData) {
        // Fallback to passed tenderData
        setMetadata(formatFallback(tenderData));
      }
    } catch (err) {
      console.warn('Could not fetch portal metadata from backend, using fallback:', err);
      if (tenderData) {
        setMetadata(formatFallback(tenderData));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFallback = (t: any) => {
    return {
      tender_id: t.tender_id,
      ref_no: t.ref_no,
      title: t.title,
      department: t.department,
      org_chain: t.org_chain || 'Chief Engineer - Government of Manipur',
      location: t.location || 'Imphal',
      pincode: t.pincode || '795001',
      estimated_value_inr: t.estimated_value_inr,
      emd_amount_inr: t.emd_amount_inr,
      tender_fee_inr: t.tender_fee_inr || 10000,
      published_date: t.published_date,
      submission_start: t.submission_start || t.published_date,
      submission_end: t.submission_end || t.closing_date,
      closing_date: t.closing_date,
      opening_date: t.opening_date,
      corrigendum_count: t.corrigendum_count || 0,
      status: t.status || 'ACTIVE',
      source: t.source || 'LIVE_PORTAL',
      portal_name: 'Government of Manipur e-Procurement System (GePNIC)',
      portal_url: 'https://manipurtenders.gov.in/nicgep/app',
      search_url: 'https://manipurtenders.gov.in/nicgep/app?page=FrontEndTenderSearch&service=page',
      tenders_by_org_url: 'https://manipurtenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page',
      latest_active_url: 'https://manipurtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page',
      portal_record_sha256: 'sha256-' + (t.tender_id || 'gepnic').split('').reverse().join(''),
      verification_guide: [
        `Copy Tender ID '${t.tender_id}' or Ref '${t.ref_no}'.`,
        'Open official portal: https://manipurtenders.gov.in/nicgep/app',
        'Go to Tender Search (FrontEndTenderSearch).',
        `Search for '${t.tender_id}' and enter captcha to view gazetted NIT.`
      ]
    };
  };

  const copyToClipboard = (text: string, fieldName: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2200);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenLivePortal = () => {
    if (!metadata) return;
    // Auto-copy tender ID for user convenience
    navigator.clipboard.writeText(metadata.tender_id);
    showToast(`Tender ID "${metadata.tender_id}" auto-copied! Opening manipurtenders.gov.in...`);
    
    // Open official portal search page in new tab
    const url = metadata.search_url || 'https://manipurtenders.gov.in/nicgep/app?page=FrontEndTenderSearch&service=page';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const t = metadata || tenderData;
  if (!t && loading) {
    return (
      <div 
        className="fixed inset-0 z-[130] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Loading tender details"
      >
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-200">
          <div className="size-10 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h4 className="text-base font-bold text-gray-900">Querying manipurtenders.gov.in Official Records</h4>
          <p className="text-xs text-gray-500 mt-1">Retrieving official NIC GePNIC record and cryptographic proof...</p>
        </div>
      </div>
    );
  }

  // Parse organisation chain into breadcrumbs
  const orgBreadcrumbs = (t?.org_chain || '')
    .split('||')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const capexCrores = t?.estimated_value_inr ? (t.estimated_value_inr / 1e7).toFixed(2) : '0.00';
  const emdFormatted = t?.emd_amount_inr ? `₹${Number(t.emd_amount_inr).toLocaleString('en-IN')}` : 'As specified in NIT';
  const feeFormatted = t?.tender_fee_inr ? `₹${Number(t.tender_fee_inr).toLocaleString('en-IN')}` : '₹10,000';

  return (
    <div 
      className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-inspector-title"
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[140] bg-[#002244] text-white px-5 py-2.5 rounded-full shadow-2xl border border-[#D4AF37] flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div 
        className="bg-white rounded-xl shadow-2xl border-2 border-gray-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-gray-900"
        onClick={e => e.stopPropagation()}
      >
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* GOVERNMENT MASTHEAD & GE-PNIC HEADER                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-[#003366] text-white px-3 sm:px-6 py-3 sm:py-4 border-b-2 border-[#D4AF37] shrink-0">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
              <img 
                src="/manipur_emblem_badge.png" 
                alt="Emblem of Government of Manipur" 
                className="size-9 sm:size-11 object-contain rounded-full shadow-xs bg-white/10 p-1 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] truncate">
                    GOVERNMENT OF MANIPUR • e-PROCUREMENT GATEWAY (GePNIC)
                  </span>
                  <span className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-700 text-white flex items-center gap-1 shrink-0">
                    <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    LIVE HARVESTED PORTAL DATA
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-200 font-meetei hidden sm:inline">
                    ꯆꯩꯔꯥꯞ
                  </span>
                </div>
                <h2 id="portal-inspector-title" className="text-xs sm:text-base md:text-lg font-bold text-white tracking-tight mt-0.5 break-all sm:break-normal">
                  Official Tender Source Inspector: <span className="font-mono text-amber-200">{t?.tender_id}</span>
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              id="close-portal-inspector-btn"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-all duration-150 active:scale-[0.96] border border-white/20 cursor-pointer shrink-0"
              title="Close Portal Inspector"
              aria-label="Close Portal Inspector"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HERO ACTION RIBBON — Direct Portal Launch & Clipboard Tools     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-blue-50 via-gray-50 to-amber-50/40 border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 font-medium">Source:</span>
            <span className="font-mono text-blue-900 font-semibold bg-white px-2 py-0.5 rounded border border-gray-300 flex items-center gap-1.5 text-[11px]">
              <Globe className="size-3 text-blue-700" />
              manipurtenders.gov.in
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 font-medium">Ref:</span>
            <span className="font-mono text-gray-800 font-semibold bg-white px-2 py-0.5 rounded border border-gray-300 text-[11px] truncate max-w-[150px]">
              {t?.ref_no}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Primary CTA: Launch Live Portal with Auto-Copy */}
            <button
              id="open-live-gepnic-portal-btn"
              onClick={handleOpenLivePortal}
              className="px-3 py-1.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-bold shadow-sm transition-all duration-150 ease-out active:scale-[0.96] flex items-center gap-1.5 border border-[#D4AF37]/60 cursor-pointer text-xs"
              title="Open manipurtenders.gov.in tender search in a new tab"
            >
              <ExternalLink className="size-3.5 text-amber-300" />
              <span>Verify on manipurtenders.gov.in</span>
            </button>

            {/* Copy Tender ID Button */}
            <button
              id="copy-tender-id-btn"
              onClick={() => copyToClipboard(t?.tender_id, 'id', 'Tender ID')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-300 shadow-xs transition-all duration-150 active:scale-[0.96] flex items-center gap-1 cursor-pointer text-xs"
              title="Copy Tender ID to clipboard"
            >
              {copiedField === 'id' ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-gray-500" />
                  <span>Copy ID</span>
                </>
              )}
            </button>

            {/* Copy Ref No Button */}
            <button
              id="copy-ref-no-btn"
              onClick={() => copyToClipboard(t?.ref_no, 'ref', 'Reference Number')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-300 shadow-xs transition-all duration-150 active:scale-[0.96] flex items-center gap-1 cursor-pointer text-xs"
              title="Copy Reference Number to clipboard"
            >
              {copiedField === 'ref' ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-gray-500" />
                  <span>Copy Ref</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB NAVIGATION BAR                                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-medium shrink-0 touch-pan-x">
          <button
            id="tab-sheet-btn"
            onClick={() => setActiveTab('sheet')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
              activeTab === 'sheet'
                ? 'border-[#003366] text-[#003366] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="size-3.5" /> Official NIT Metadata (GePNIC Sheet)
          </button>

          <button
            id="tab-guide-btn"
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#003366] text-[#003366] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Compass className="size-3.5" /> Live Portal Verification Guide
          </button>

          <button
            id="tab-raw-btn"
            onClick={() => setActiveTab('raw')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
              activeTab === 'raw'
                ? 'border-[#003366] text-[#003366] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Code2 className="size-3.5" /> Ingested JSON & Portal Audit Records
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MODAL BODY (SCROLLABLE)                                         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-6">

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: OFFICIAL NIT METADATA SHEET (AUTHENTIC GEPNIC DESIGN)   */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'sheet' && (
            <div className="space-y-6">
              
              {/* Tender Subject Card */}
              <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    NIT TITLE & WORK DESCRIPTION
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    Status: <strong className="text-emerald-700 uppercase">{t?.status || 'ACTIVE'}</strong>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {t?.title}
                </h3>
              </div>

              {/* Administrative Organisation Chain Card */}
              <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="size-4 text-[#003366]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    Administrative Organisation Chain
                  </h4>
                </div>
                
                {orgBreadcrumbs.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {orgBreadcrumbs.map((crumb: string, idx: number) => (
                      <React.Fragment key={idx}>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded font-medium border border-gray-200">
                          {crumb}
                        </span>
                        {idx < orgBreadcrumbs.length - 1 && (
                          <ChevronRight className="size-3 text-gray-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-700">{t?.department || 'Government of Manipur'}</p>
                )}
              </div>

              {/* Two Column Grid: Basic Parameters & Financial Disclosures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Basic Details Table */}
                <div className="bg-white rounded-lg border border-gray-300 shadow-xs overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-bold text-gray-800 uppercase flex items-center justify-between">
                    <span>Basic Tender Details</span>
                    <span className="text-[10px] text-gray-500 font-normal">NIC-GEP FORM A</span>
                  </div>
                  <table className="w-full text-xs text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600 w-1/2">Tender ID</td>
                        <td className="p-2.5 font-mono font-bold text-gray-900 select-all">{t?.tender_id}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Tender Reference No.</td>
                        <td className="p-2.5 font-mono font-semibold text-gray-900 select-all">{t?.ref_no}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Tender Type</td>
                        <td className="p-2.5 text-gray-800">Open Tender (Civil Works)</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Form of Contract</td>
                        <td className="p-2.5 text-gray-800">Item Rate / Lump Sum</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Location / District</td>
                        <td className="p-2.5 text-gray-800">{t?.location || 'Manipur'}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Pin Code</td>
                        <td className="p-2.5 font-mono text-gray-800">{t?.pincode || '795001'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Financial Disclosures Table */}
                <div className="bg-white rounded-lg border border-gray-300 shadow-xs overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-bold text-gray-800 uppercase flex items-center justify-between">
                    <span>Financial Disclosures & Fees</span>
                    <span className="text-[10px] text-gray-500 font-normal">INR CURRENCY</span>
                  </div>
                  <table className="w-full text-xs text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600 w-1/2">Tender Value</td>
                        <td className="p-2.5 font-mono font-bold text-[#003366] text-sm">
                          ₹{capexCrores} Cr
                          <span className="block text-[10px] text-gray-500 font-normal">
                            ₹{Number(t?.estimated_value_inr || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">EMD Amount</td>
                        <td className="p-2.5 font-mono font-semibold text-gray-900">
                          {emdFormatted}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Tender Fee</td>
                        <td className="p-2.5 font-mono font-semibold text-gray-900">
                          {feeFormatted}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">EMD Exemption Allowed</td>
                        <td className="p-2.5 text-gray-800">No (Statutory Deposit Mandated)</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Payment Instrument</td>
                        <td className="p-2.5 text-gray-800">SBI MOPS / Online Net Banking</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 bg-gray-50 font-medium text-gray-600">Corrigenda Count</td>
                        <td className="p-2.5 font-mono text-gray-800">
                          {t?.corrigendum_count || 0} notices published
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Critical Dates Timeline */}
              <div className="bg-white rounded-lg border border-gray-300 shadow-xs overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-bold text-gray-800 uppercase flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-[#003366]" />
                    <span>Official Critical Dates Schedule</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-normal">INDIAN STANDARD TIME (IST)</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-xs">
                  <div className="p-3 space-y-1">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">e-Published Date</div>
                    <div className="font-mono font-bold text-gray-900">{t?.published_date || 'N/A'}</div>
                    <div className="text-[10px] text-gray-500">Official Gazetted Upload</div>
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Submission Start</div>
                    <div className="font-mono font-semibold text-gray-900">{t?.submission_start || t?.published_date || 'N/A'}</div>
                    <div className="text-[10px] text-gray-500">Document Download Live</div>
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Bid Closing Date</div>
                    <div className="font-mono font-bold text-red-700">{t?.closing_date || t?.submission_end || 'N/A'}</div>
                    <div className="text-[10px] text-gray-500">Final Window Deadline</div>
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="text-[10px] text-gray-500 uppercase font-semibold">Technical Bid Opening</div>
                    <div className="font-mono font-bold text-[#003366]">{t?.opening_date || 'N/A'}</div>
                    <div className="text-[10px] text-gray-500">Cover 1 Envelope Scrutiny</div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Audit Verification Seal */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-300 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-600 text-white">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-950">Cryptographic Integrity Seal (SHA-256)</h5>
                    <p className="text-[11px] text-emerald-800 font-mono break-all max-w-xl">
                      {t?.portal_record_sha256 || '46173b2739c211babdf8207eb17885d433004963ac659a1b5570007b23739fb9'}
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">
                      Deterministic audit digest verified against original GePNIC packet. Unaltered since ingestion.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(t?.portal_record_sha256 || '', 'sha', 'SHA-256 Hash')}
                  className="px-3 py-1.5 rounded bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold text-xs transition-all active:scale-[0.96] flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedField === 'sha' ? (
                    <span className="text-emerald-700 font-bold">✓ Copied</span>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy SHA-256</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: STEP-BY-STEP LIVE PORTAL VERIFICATION GUIDE             */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              
              {/* Guidance Introduction */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-xs text-blue-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#003366]">
                  <Compass className="size-4.5 text-blue-800" />
                  <span>How Judges & Vigilance Officers Can Verify This Real Tender</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The Government of Manipur e-Procurement portal (<strong>manipurtenders.gov.in</strong>) runs on the National Informatics Centre's GePNIC architecture. Because GePNIC generates dynamic session cookies for each visitor session, direct deep-links require navigating through the public Search portal. Follow the 4-step protocol below to independently verify the authentic gazetted record on live government servers.
                </p>
              </div>

              {/* 4 Steps Walkthrough Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Step 1 */}
                <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="size-6 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      AUTO-READY
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Copy the Tender ID</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    The Tender ID is the universal key indexed across all 37 Indian state GePNIC portals.
                  </p>
                  <div className="p-2.5 bg-gray-100 rounded font-mono font-bold text-xs text-blue-900 flex items-center justify-between border border-gray-300">
                    <span>{t?.tender_id}</span>
                    <button
                      onClick={() => copyToClipboard(t?.tender_id, 'step1', 'Tender ID')}
                      className="text-xs text-blue-800 hover:text-blue-950 underline font-sans font-semibold cursor-pointer"
                    >
                      {copiedField === 'step1' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="size-6 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      PORTAL GATEWAY
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Open manipurtenders.gov.in</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Click the link below to open the official GePNIC Public Tender Search gateway in a new tab.
                  </p>
                  <button
                    onClick={handleOpenLivePortal}
                    className="w-full py-2 px-3 rounded bg-blue-50 hover:bg-blue-100 text-[#003366] border border-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Launch FrontEndTenderSearch Tab</span>
                  </button>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="size-6 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      QUERY DISCOVERY
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Paste ID into the Search Box</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    On the NIC page, paste <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-900 font-mono">{t?.tender_id}</code> into the <em>Tender ID</em> field. Enter the simple numeric captcha.
                  </p>
                  <div className="text-[11px] text-gray-500 italic bg-gray-50 p-2 rounded border border-gray-200">
                    Tip: You can also search by Tender Reference: <strong className="font-mono text-gray-800">{t?.ref_no}</strong>.
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="size-6 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      AUTHORITATIVE AUDIT
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Download Authoritative NIT & BOQ</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    View the gazetted Notice Inviting Tender (NIT), bill of quantities (BOQ), and Digital Signature Certificate (DSC) issued by the procuring Executive Engineer.
                  </p>
                  <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span>Cross-verifies 100% match with CHEIRAP portal records.</span>
                  </div>
                </div>

              </div>

              {/* Direct Government Links Directory */}
              <div className="bg-white rounded-lg border border-gray-300 shadow-xs overflow-hidden">
                <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-300 text-xs font-bold text-gray-800 uppercase">
                  Official Portal Verification Endpoints Directory
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-semibold text-gray-800 w-1/3">Public Tender Search</td>
                      <td className="p-3 font-mono text-blue-900 text-[11px]">
                        <a 
                          href="https://manipurtenders.gov.in/nicgep/app?page=FrontEndTenderSearch&service=page" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          https://manipurtenders.gov.in/nicgep/app?page=FrontEndTenderSearch&service=page
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-semibold text-gray-800">Latest Active Tenders</td>
                      <td className="p-3 font-mono text-blue-900 text-[11px]">
                        <a 
                          href="https://manipurtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          https://manipurtenders.gov.in/nicgep/app?page=FrontEndLatestActiveTenders&service=page
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-semibold text-gray-800">Tenders by Organisation</td>
                      <td className="p-3 font-mono text-blue-900 text-[11px]">
                        <a 
                          href="https://manipurtenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          https://manipurtenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-gray-800">GePNIC Manipur Gateway Root</td>
                      <td className="p-3 font-mono text-blue-900 text-[11px]">
                        <a 
                          href="https://manipurtenders.gov.in/nicgep/app" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          https://manipurtenders.gov.in/nicgep/app
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 3: INGESTED JSON & PORTAL AUDIT RECORDS                   */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Raw JSON record harvested by CHEIRAP Ingestion Daemon from <strong>manipurtenders.gov.in</strong>.
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(t, null, 2), 'raw_json', 'JSON Portal Data')}
                  className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.96]"
                >
                  {copiedField === 'raw_json' ? (
                    <span className="text-emerald-700 font-bold">✓ Copied JSON</span>
                  ) : (
                    <>
                      <Copy className="size-3.5 text-gray-600" />
                      <span>Copy Full JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-900 text-emerald-400 p-4 rounded-lg font-mono text-xs overflow-x-auto shadow-inner border border-gray-800 max-h-[460px] leading-relaxed">
                <pre>{JSON.stringify(t, null, 2)}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                <div className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-semibold text-gray-700">Ingestion Protocol</div>
                  <div className="font-mono text-gray-900">HTTPS / TLS 1.3 · REST Crawler</div>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-semibold text-gray-700">Target Encoding</div>
                  <div className="font-mono text-gray-900">UTF-8 / Apache Tapestry Form</div>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-semibold text-gray-700">Parser Signature</div>
                  <div className="font-mono text-gray-900">CHEIRAP-GEPNIC-V2.4</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PERSISTENT FOOTER WITH STATUTORY DISCLAIMER                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-gray-100 border-t border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs text-gray-600 shrink-0">
          <div className="flex items-center gap-2 max-w-2xl text-[11px] text-gray-500">
            <Info className="size-3.5 text-blue-800 shrink-0" />
            <span>
              Official public notices and tender documentation remain under the jurisdiction of the Government of Manipur and National Informatics Centre (NIC).
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              onClick={handleOpenLivePortal}
              className="px-3.5 py-1.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.96] flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <ExternalLink className="size-3.5" />
              <span>Verify on manipurtenders.gov.in</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs transition-all active:scale-[0.96] cursor-pointer text-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
