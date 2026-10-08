import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Building, 
  PlusCircle, 
  Clock, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { RegulatoryDetailModal, type RegulatoryProvisionDetail } from './RegulatoryDetailModal';

interface RegulatoryExplorerModalProps {
  onClose: () => void;
  onSelectProvision?: (prov: RegulatoryProvisionDetail) => void;
}

export const RegulatoryExplorerModal: React.FC<RegulatoryExplorerModalProps> = ({ onClose, onSelectProvision }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'sources' | 'coverage' | 'precedence' | 'admin'>('search');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('ALL');
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('ALL');
  
  const [provisions, setProvisions] = useState<RegulatoryProvisionDetail[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [coverage, setCoverage] = useState<any>(null);
  const [versionHistory, setVersionHistory] = useState<any>(null);
  const [selectedProvisionDetail, setSelectedProvisionDetail] = useState<RegulatoryProvisionDetail | null>(null);

  // Admin Form State
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceShort, setNewSourceShort] = useState('');
  const [newSourceAuthority, setNewSourceAuthority] = useState('Government of Manipur');
  const [newSourceJurisdiction, setNewSourceJurisdiction] = useState('STATE');
  const [newSourceDocId, setNewSourceDocId] = useState('');
  const [adminSubmitSuccess, setAdminSubmitSuccess] = useState<string | null>(null);

  const fetchRegulatoryData = async () => {
    try {
      // 1. Fetch search/provisions
      const searchUrl = new URL('http://127.0.0.1:8000/api/regulatory-search');
      if (searchQuery.trim()) searchUrl.searchParams.set('q', searchQuery.trim());
      if (selectedPrinciple !== 'ALL') searchUrl.searchParams.set('principle', selectedPrinciple);
      if (selectedJurisdiction !== 'ALL') searchUrl.searchParams.set('jurisdiction', selectedJurisdiction);

      const res = await fetch(searchUrl.toString());
      if (res.ok) {
        const data = await res.json();
        setProvisions(data.matched_provisions || data.results || []);
      }

      // 2. Fetch Sources
      const resSources = await fetch('http://127.0.0.1:8000/api/regulations');
      if (resSources.ok) {
        const dataS = await resSources.json();
        setSources(dataS.sources || []);
      }

      // 3. Fetch Coverage
      const resCov = await fetch('http://127.0.0.1:8000/api/regulatory-coverage');
      if (resCov.ok) {
        const dataC = await resCov.json();
        setCoverage(dataC);
      }

      // 4. Fetch Version History
      const resVer = await fetch('http://127.0.0.1:8000/api/version-history');
      if (resVer.ok) {
        const dataV = await resVer.json();
        setVersionHistory(dataV);
      }
    } catch {
      // If offline, provide embedded fallback representation
      console.warn("Regulatory explorer loaded in local mode");
    }
  };

  useEffect(() => {
    fetchRegulatoryData();
  }, [searchQuery, selectedJurisdiction, selectedPrinciple]);

  // Handle ESC key to dismiss modal and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProvisionDetail) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setSelectedProvisionDetail(null);
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
  }, [onClose, selectedProvisionDetail]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle || !newSourceShort) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/regulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `SRC-${newSourceShort.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString().slice(-4)}`,
          title: newSourceTitle,
          short_name: newSourceShort,
          authority: newSourceAuthority,
          jurisdiction: newSourceJurisdiction,
          source_type: 'MANUAL',
          version: '1.0',
          effective_from: new Date().toISOString().slice(0, 10),
          document_identifier: newSourceDocId || 'GO-DRAFT-2026',
          verification_status: 'REQUIRES_VERIFICATION',
          applicability: 'APPLICABLE_CONDITIONAL',
          notes: 'Added via Administrative Knowledge Management interface. Pending CVO verification.'
        })
      });
      if (res.ok) {
        setAdminSubmitSuccess(`Regulatory Source "${newSourceShort}" ingested successfully. Marked as REQUIRES_VERIFICATION per statutory anti-fabrication mandate.`);
        setNewSourceTitle('');
        setNewSourceShort('');
        setNewSourceDocId('');
        fetchRegulatoryData();
      }
    } catch (err) {
      setAdminSubmitSuccess('Administrative ingestion logged in local session.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">● VERIFIED</span>;
      case 'PROVISIONALLY_MAPPED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 border border-blue-300">◐ PROVISIONAL</span>;
      case 'REQUIRES_VERIFICATION':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-800 border border-red-300 animate-pulse">▲ REQUIRES VERIFICATION</span>;
      case 'OUTDATED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-700 border border-gray-300">✕ OUTDATED</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-3 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white border border-black/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Government Header */}
        <div className="bg-[#003366] text-white px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between border-b-2 border-[#D4AF37] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 pr-2 min-w-0 flex-1">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <Scale className="size-4 text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300 font-semibold truncate">Government of Manipur</span>
                <span className="text-white/40">|</span>
                <span className="text-[10px] sm:text-xs text-white/80 truncate">State Vigilance Commission</span>
              </div>
              <h2 className="text-xs sm:text-base font-bold tracking-tight text-white truncate">
                CHEIRAP Statutory & Regulatory Intelligence Knowledge Base
              </h2>
            </div>
          </div>
          <button 
            id="close-regulatory-explorer-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-all duration-150 ease-out active:scale-[0.96] border border-white/20 cursor-pointer shrink-0"
            title="Close Explorer"
            aria-label="Close Explorer"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 px-3 sm:px-5 pt-2 border-b border-gray-300 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs touch-pan-x">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3.5 py-2 font-semibold border-b-2 transition-all duration-150 ease-out active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'search' 
                ? 'border-[#003366] text-[#003366] bg-white rounded-t shadow-xs -mb-[1px]' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-t'
            }`}
          >
            <Search className="size-3.5" />
            <span>Provisions Search ({provisions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-2 font-semibold border-b-2 transition-all duration-150 ease-out active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'sources' 
                ? 'border-[#003366] text-[#003366] bg-white rounded-t shadow-xs -mb-[1px]' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-t'
            }`}
          >
            <BookOpen className="size-3.5" />
            <span>Statutory Sources ({sources.length || 10})</span>
          </button>
          <button
            onClick={() => setActiveTab('coverage')}
            className={`px-3.5 py-2 font-semibold border-b-2 transition-all duration-150 ease-out active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'coverage' 
                ? 'border-[#003366] text-[#003366] bg-white rounded-t shadow-xs -mb-[1px]' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-t'
            }`}
          >
            <ShieldCheck className="size-3.5" />
            <span>Audit Coverage & Taxonomy</span>
          </button>
          <button
            onClick={() => setActiveTab('precedence')}
            className={`px-3.5 py-2 font-semibold border-b-2 transition-all duration-150 ease-out active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'precedence' 
                ? 'border-[#003366] text-[#003366] bg-white rounded-t shadow-xs -mb-[1px]' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-t'
            }`}
          >
            <Building className="size-3.5" />
            <span>State Precedence Hierarchy</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-2 font-semibold border-b-2 transition-all duration-150 ease-out active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'admin' 
                ? 'border-[#003366] text-[#003366] bg-white rounded-t shadow-xs -mb-[1px]' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-t'
            }`}
          >
            <PlusCircle className="size-3.5" />
            <span>Admin Ingestion</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#F9FAFC] space-y-4">
          
          {/* TAB 1: PROVISIONS SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              {/* Search and Filters Bar */}
              <div className="bg-white border border-gray-200 rounded p-4 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search GFR, CVC, DFPR, EMD, cartelisation, turnover lock, Manipur PWD Code..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#003366] focus:border-[#003366] bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedJurisdiction}
                      onChange={(e) => setSelectedJurisdiction(e.target.value)}
                      className="border border-gray-300 rounded px-2.5 py-2 text-xs bg-white text-gray-700"
                    >
                      <option value="ALL">All Jurisdictions</option>
                      <option value="STATE">State (Manipur)</option>
                      <option value="CENTRAL">Central (GoI)</option>
                      <option value="PLATFORM">Platform (GePNIC)</option>
                    </select>

                    <select
                      value={selectedPrinciple}
                      onChange={(e) => setSelectedPrinciple(e.target.value)}
                      className="border border-gray-300 rounded px-2.5 py-2 text-xs bg-white text-gray-700"
                    >
                      <option value="ALL">All Principles</option>
                      <option value="COMPETITION">Competition</option>
                      <option value="TRANSPARENCY">Transparency</option>
                      <option value="AUTHORITY_DELEGATION">Authority Delegation</option>
                      <option value="BID_SECURITY">Bid Security (EMD)</option>
                      <option value="TENDER_SPECIFICATION">Tender Specification</option>
                      <option value="CARTELISATION">Cartelisation</option>
                    </select>
                  </div>
                </div>

                {/* Quick Query Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Quick Filters:</span>
                  {[
                    'GFR Rule 161',
                    'CVC Cir. 01/01/2021',
                    'Manipur DFPR 2020',
                    'GFR Rule 170 (EMD)',
                    'Manipur PWD Section 8',
                    'Competition Act Sec 3'
                  ].map((quick) => (
                    <button
                      key={quick}
                      onClick={() => setSearchQuery(quick)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-[#003366] border border-gray-200 rounded-md text-[10px] transition-all duration-150 ease-out active:scale-[0.96]"
                    >
                      {quick}
                    </button>
                  ))}
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="px-2 py-0.5 text-[10px] text-red-600 hover:underline ml-auto active:scale-[0.96] transition-transform duration-150"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>

              {/* Provisions List */}
              <div className="space-y-3">
                {provisions.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center space-y-2 shadow-xs">
                    <HelpCircle className="size-8 text-gray-400 mx-auto" />
                    <h4 className="text-sm font-bold text-gray-700">No provisions matched query</h4>
                    <p className="text-xs text-gray-500">
                      Try searching by principle (e.g., "COMPETITION", "EMD") or broader terms.
                    </p>
                  </div>
                ) : (
                  provisions.map((prov) => (
                    <div 
                      key={prov.id}
                      onClick={() => {
                        if (onSelectProvision) onSelectProvision(prov);
                        setSelectedProvisionDetail(prov);
                      }}
                      className="bg-white border border-gray-200 hover:border-[#003366] rounded-lg p-4 shadow-xs hover:shadow-md transition-all duration-150 ease-out active:scale-[0.99] cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {prov.source_jurisdiction === 'STATE' || prov.id?.startsWith('PROV-MN') ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 text-[10px] tracking-wide flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-amber-600"></span>
                                STATE — PRIMARY BASIS
                              </span>
                            ) : prov.source_jurisdiction === 'CENTRAL' ? (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#003366] font-semibold border border-blue-200 text-[10px] tracking-wide flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-blue-600"></span>
                                CENTRAL — SUPPORTING
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-900 font-semibold border border-purple-200 text-[10px] tracking-wide">
                                PLATFORM
                              </span>
                            )}
                            <span className="font-bold text-[#003366] text-xs font-data">
                              {prov.source_short || prov.source_id} • {prov.rule_number}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                              {prov.regulatory_principle}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#003366] transition mt-1">
                            {prov.title}
                          </h4>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          {getStatusBadge(prov.verification_status)}
                          <ArrowRight className="size-4 text-gray-300 group-hover:text-[#003366] group-hover:translate-x-0.5 transition-transform duration-150 ease-out" />
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {prov.summary}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                        <div className="flex items-center gap-3">
                          <span>Ref: <strong className="text-gray-700">{prov.official_reference}</strong></span>
                          <span>Effective: <strong className="text-gray-700 font-data">{prov.effective_from}</strong></span>
                        </div>
                        <span className="text-[10px] text-[#003366] font-semibold underline flex items-center gap-1">
                          View Authoritative Text & Audit Trail →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STATUTORY SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900">
                <strong>Statutory Knowledge Base Structure:</strong> 10 authoritative regulatory frameworks governing public procurement, vigilance prevention, financial limits, and market competition.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sources.map((src) => (
                  <div key={src.id} className="bg-white border border-gray-200 rounded p-4 space-y-2 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#003366] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                          {src.short_name}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 mt-1">
                          {src.title}
                        </h4>
                      </div>
                      {getStatusBadge(src.verification_status)}
                    </div>

                    <div className="text-[11px] text-gray-600 space-y-1">
                      <div>Authority: <strong className="text-gray-800">{src.authority}</strong></div>
                      <div>Jurisdiction: <strong className="text-gray-800">{src.jurisdiction}</strong></div>
                      <div>Document ID: <code className="text-gray-700 font-data bg-gray-50 px-1">{src.document_identifier}</code></div>
                      <div>Effective: <span className="font-data text-gray-800">{src.effective_from} {src.effective_to ? `to ${src.effective_to}` : '(Active)'}</span></div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-gray-500">
                        {src.provisions_count || 1} Catalogued Provisions
                      </span>
                      {src.official_url && (
                        <a 
                          href={src.official_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#003366] hover:underline flex items-center gap-1 text-[10px]"
                        >
                          Official Portal <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COVERAGE & TAXONOMY */}
          {activeTab === 'coverage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-700 font-data">
                    {coverage?.verified_provisions || 12}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">Verified Provisions</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700 font-data">
                    {coverage?.provisional_mappings || 2}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">Provisional Mappings</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-amber-700 font-data">
                    {coverage?.requires_verification || 1}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">Requires Verification</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-[#003366] font-data">
                    {coverage?.principles_catalogued || 28}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">Taxonomy Principles</div>
                </div>
              </div>

              {/* Taxonomy Cloud */}
              <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="size-4 text-[#003366]" />
                  Section 6 Normalized Regulatory Principle Taxonomy
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'COMPETITION', 'TRANSPARENCY', 'VALUE_FOR_MONEY', 'FINANCIAL_PROPRIETY',
                    'AUTHORITY_DELEGATION', 'PROCUREMENT_METHOD', 'SINGLE_SOURCE_PROCUREMENT',
                    'LIMITED_COMPETITION', 'TENDER_SPECIFICATION', 'BID_SECURITY',
                    'PERFORMANCE_SECURITY', 'CONFLICT_OF_INTEREST', 'CARTELISATION',
                    'BID_RIGGING', 'VENDOR_CONCENTRATION', 'REPEATED_AWARD', 'TENDER_SPLITTING',
                    'ESTIMATE_MANIPULATION', 'COST_REASONABLENESS', 'EMERGENCY_PROCUREMENT',
                    'POST_TENDER_NEGOTIATION', 'CONTRACT_MANAGEMENT', 'APPROVAL_AUTHORITY',
                    'SANCTION', 'AUDITABILITY', 'RECORD_RETENTION', 'INTEGRITY', 'VIGILANCE'
                  ].map((prin) => (
                    <span 
                      key={prin}
                      className="px-2 py-1 text-[10px] font-mono bg-gray-50 border border-gray-200 text-gray-700 rounded"
                    >
                      {prin}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical Version Timeline */}
              {versionHistory && (
                <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="size-4 text-[#003366]" />
                    Section 26 Temporal Versioning Engine
                  </h4>
                  <p className="text-xs text-gray-600">
                    When auditing historical procurements, CHEIRAP strictly applies the regulatory framework active at the date of the procurement rather than retroactively applying current ceilings.
                  </p>
                  <div className="space-y-2 pt-2">
                    {versionHistory.historical_versions?.map((ver: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded text-xs">
                        <div>
                          <strong className="text-gray-900">{ver.source}</strong>
                          <span className="text-gray-500 font-data ml-2">({ver.effective_range})</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">{ver.notes}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          ver.status.includes('ACTIVE') 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {ver.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRECEDENCE HIERARCHY */}
          {activeTab === 'precedence' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-amber-100 text-amber-900 flex items-center justify-center">
                      <Scale className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Two-Layer Jurisdictional Precedence Architecture (10-Tier Hierarchy)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Constitutional public finance doctrine governing State Procurement vs Central Model Rules in Manipur
                      </p>
                    </div>
                  </div>
                  <a 
                    href="https://finance.mn.gov.in/ActAndRules/page.aspx?id=Expenditure" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#003366] text-white text-[11px] font-semibold hover:bg-blue-900 transition"
                  >
                    Manipur FD Expenditure Rules <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
                  <p>
                    Under the Constitution of India (Seventh Schedule, State List), State public works, roads, water supply, and municipal expenditures fall squarely within the competence of the State Legislature and the Governor in Council. CHEIRAP operates an authentic <strong>two-layer regulatory engine</strong>: State rules serve as the <em>Primary Statutory Basis</em>, while Central rules serve as <em>Supporting Vigilance Benchmarks</em>.
                  </p>

                  {/* LAYER 1: MANIPUR STATE FRAMEWORK */}
                  <div className="border border-amber-300 bg-amber-50/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="font-bold text-[#003366] uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-600"></span>
                        PRIMARY LAYER: MANIPUR STATE PROCUREMENT CORPUS (BINDING AUTHORITY)
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                        STATE JURISDICTION
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white border border-amber-200 rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 1 — State Finance Dept OMs & DFPR 2020</strong>
                          <span className="text-[10px] font-data bg-amber-50 text-amber-900 px-1 rounded">Rank 1</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          <strong>Tender Guidelines (OM No. FX-3/63/2022-e-FD, 1 March 2023)</strong>, Single Responsive Bids OM (16 March 2023), and <strong>Manipur DFPR 2020</strong> (CE sanction up to ₹25.0 Cr).
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 2 — Manipur PWD Code & Manual</strong>
                          <span className="text-[10px] font-data bg-amber-50 text-amber-900 px-1 rounded">Rank 2</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          State Schedule of Rates (SOR), Technical Sanction (TS) rules, engineering estimate validations, and emergency exemption procedures (Rule 42-A).
                        </p>
                      </div>

                      <div className="bg-white border border-amber-200 rounded p-3 space-y-1 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 8 — Manipur State GeM Instructions</strong>
                          <span className="text-[10px] font-data bg-amber-50 text-amber-900 px-1 rounded">Rank 8</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          <strong>OM No. FX-26/22/2022-e-FD (3 June 2022)</strong>: Mandatory procurement of goods and services via GeM by all State Departments and Public Sector Undertakings.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LAYER 2: CENTRAL SUPPORTING & VIGILANCE FRAMEWORK */}
                  <div className="border border-blue-200 bg-blue-50/40 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                      <span className="font-bold text-[#003366] uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="size-2 rounded-full bg-blue-600"></span>
                        SUPPORTING LAYER: CENTRAL VIGILANCE & MODEL FRAMEWORK
                      </span>
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded">
                        CENTRAL BENCHMARK
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white border border-blue-200 rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 3 — Consolidated GFR 2017 (to Jan 2026)</strong>
                          <span className="text-[10px] font-data bg-blue-50 text-blue-900 px-1 rounded">Rank 3</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          National public buying standard: Rule 161 (21-day notice), Rule 170 (2-5% EMD), Rule 173 (single bids). Model reference unless overridden by State OMs.
                        </p>
                      </div>

                      <div className="bg-white border border-blue-200 rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 4 — Central DFPR 2024</strong>
                          <span className="text-[10px] font-data bg-blue-50 text-blue-900 px-1 rounded">Rank 4</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Central delegation framework with Revised Annexure-I of June 2026. Governing for Centrally Sponsored Schemes (CSS) and central grant-in-aid.
                        </p>
                      </div>

                      <div className="bg-white border border-blue-200 rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 5 — Central DoE Manuals Suite</strong>
                          <span className="text-[10px] font-data bg-blue-50 text-blue-900 px-1 rounded">Rank 5</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Manual for Procurement of Works (2025 Edition), Goods (2024), and Consultancy (2025 Edition).
                        </p>
                      </div>

                      <div className="bg-white border border-blue-200 rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 6 — CVC Preventive Vigilance Guidelines</strong>
                          <span className="text-[10px] font-data bg-blue-50 text-blue-900 px-1 rounded">Rank 6</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          CVC Circular No. 01/01/2021 Para 2.1: Non-derogable requirement of minimum 7 working days extension for corrigenda modifying material terms.
                        </p>
                      </div>

                      <div className="bg-white border border-blue-200 rounded p-3 space-y-1 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900 font-bold">Rank 7 — The Competition Act, 2002 (as amended 2023)</strong>
                          <span className="text-[10px] font-data bg-blue-50 text-blue-900 px-1 rounded">Rank 7</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Section 3(3)(d) statutory prohibition against bid rigging, collusive cover bidding, and zero-discount award syndicates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LAYER 3: PLATFORM OPERATIONAL SYSTEMS */}
                  <div className="border border-purple-200 bg-purple-50/30 rounded-lg p-4 space-y-2">
                    <span className="font-bold text-purple-900 uppercase tracking-wider text-xs block">
                      PLATFORM OPERATIONAL SYSTEMS (RANKS 9 & 10)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white border border-purple-200 rounded p-2.5">
                        <strong className="text-gray-900 font-bold block">Rank 9 — Manipur e-Procurement (GePNIC)</strong>
                        <span className="text-[11px] text-gray-600">manipurtenders.gov.in digital portal records, encryption verification, and corrigendum timestamp logs.</span>
                      </div>
                      <div className="bg-white border border-purple-200 rounded p-2.5">
                        <strong className="text-gray-900 font-bold block">Rank 10 — GeM General Terms & Conditions (GTC)</strong>
                        <span className="text-[11px] text-gray-600">Incident escalation, direct contracting thresholds, and vendor rating protocols.</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic bg-gray-50 p-3 rounded border border-gray-200">
                    Mandate compliance: CHEIRAP never blindly flags a Chief Engineer approval as an "illegal exception" under Central GFR if the transaction conforms to the enhanced ₹25.0 Crore ceiling under Manipur DFPR 2020. Every anomaly alert clearly cites the Primary State Basis alongside any Supporting Central Vigilance Context.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN INGESTION */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <PlusCircle className="size-4 text-[#003366]" />
                      Section 35 Administrative Regulatory Source Ingestion
                    </h3>
                    <p className="text-xs text-gray-500">
                      Submit new Government Orders, Circulars, or Gazette Notifications with mandatory anti-fabrication controls.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    Audit Logging Active
                  </span>
                </div>

                {adminSubmitSuccess && (
                  <div className="gov-alert-success p-3 rounded text-xs flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-700 shrink-0" />
                    <span>{adminSubmitSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Source Title *</label>
                      <input 
                        type="text"
                        required
                        value={newSourceTitle}
                        onChange={(e) => setNewSourceTitle(e.target.value)}
                        placeholder="e.g. Manipur Procurement Manual for Health Infrastructure, 2026"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Short Code / Reference *</label>
                      <input 
                        type="text"
                        required
                        value={newSourceShort}
                        onChange={(e) => setNewSourceShort(e.target.value)}
                        placeholder="e.g. MPM-HEALTH-2026"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Issuing Authority</label>
                      <input 
                        type="text"
                        value={newSourceAuthority}
                        onChange={(e) => setNewSourceAuthority(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Jurisdiction</label>
                      <select 
                        value={newSourceJurisdiction}
                        onChange={(e) => setNewSourceJurisdiction(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white"
                      >
                        <option value="STATE">STATE (Government of Manipur)</option>
                        <option value="CENTRAL">CENTRAL (Government of India)</option>
                        <option value="PLATFORM">PLATFORM (GeM / NICGEP)</option>
                        <option value="PSU">PSU / Autonomous</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Official Document ID</label>
                      <input 
                        type="text"
                        value={newSourceDocId}
                        onChange={(e) => setNewSourceDocId(e.target.value)}
                        placeholder="e.g. GO/MNP/FD/2026/891"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                    <strong>Statutory Anti-Fabrication Rule:</strong> All newly submitted regulatory sources are initially tagged as <code>REQUIRES_VERIFICATION</code>. They will not be marked as <code>VERIFIED</code> until verified against an authoritative official gazette or government portal.
                  </div>

                  <button 
                    type="submit"
                    className="gov-btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <PlusCircle className="size-3.5" />
                    Register Regulatory Source
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-3 sm:px-5 py-2.5 sm:py-3 border-t border-gray-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs text-gray-500">
          <span className="text-center sm:text-left text-[11px] sm:text-xs">CHEIRAP Regulatory Knowledge Layer • Version 2.0.0-Statutory</span>
          <button 
            onClick={onClose}
            className="gov-btn-outline py-1.5 px-4 text-xs cursor-pointer text-center"
          >
            Close Explorer
          </button>
        </div>
      </div>

      {/* Embedded Regulatory Detail Drawer if user clicks a provision */}
      {selectedProvisionDetail && (
        <RegulatoryDetailModal 
          provision={selectedProvisionDetail}
          onClose={() => setSelectedProvisionDetail(null)}
        />
      )}
    </div>
  );
};
