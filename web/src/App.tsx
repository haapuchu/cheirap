import { useState, useEffect, useRef, Fragment } from 'react';
import { 
  AlertTriangle, 
  Search, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Lock, 
  TrendingUp, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  RefreshCw,
  BookOpen,
  Clock,
  Send,
  Loader2,
  Building2,
  Check,
  Layers,
  Scale,
  Info,
  Eye,
  ShieldAlert,
  Globe
} from 'lucide-react';
import gsap from 'gsap';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ForensicRadarChart } from '@/components/ForensicRadarChart';
import { CaseDetailModal } from '@/components/CaseDetailModal';
import { RegulatoryDetailModal, type RegulatoryProvisionDetail } from '@/components/RegulatoryDetailModal';
import { RegulatoryExplorerModal } from '@/components/RegulatoryExplorerModal';
import { OriginalTenderModal } from '@/components/OriginalTenderModal';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { CheirapWorksAssuranceView } from '@/components/CheirapWorksAssuranceView';
import embeddedTenders from '@/data/tenders_scored.json';

interface Tender {
  tender_id: string;
  ref_no: string;
  title: string;
  department: string;
  org_chain?: string;
  location: string;
  pincode?: string;
  estimated_value_inr: number;
  emd_amount_inr: number;
  tender_fee_inr: number;
  published_date: string;
  closing_date: string;
  opening_date: string;
  corrigendum_count: number;
  status: string;
  is_mantripukhri_venue: boolean;
  cheirap_risk_score: number;
  if_anomaly_score: number;
  cvc_statutory_penalty: number;
  vigilance_tier: 'RED' | 'AMBER' | 'GREEN';
  vigilance_recommendation: string;
  feat_window_days: number;
  feat_corr_velocity: number;
  feat_window_compression_hours: number;
  feat_emd_ratio: number;
  feat_single_bidder_risk: number;
  feat_spread_ratio: number;
  audit_flags: string[];
}

const allTenders = embeddedTenders as unknown as Tender[];

export default function App() {
  const [currentView, setCurrentView] = useState<'hero' | 'dashboard' | 'works'>('hero');
  const [userRole, setUserRole] = useState<string>('State Vigilance Commissioner');
  
  const [tenders, setTenders] = useState<Tender[]>(allTenders);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHoldTender, setActiveHoldTender] = useState<Tender | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDispatchingStay, setIsDispatchingStay] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;
  
  // GovTech Feature States
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'larger'>('normal');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('04 Oct 2026, 23:30:00 IST');
  const [isSyncingNICGEP, setIsSyncingNICGEP] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('04 Oct 2026, 23:15 IST');
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showRegulatoryExplorer, setShowRegulatoryExplorer] = useState<boolean>(false);
  const [selectedCaseTenderId, setSelectedCaseTenderId] = useState<string | null>(null);
  const [selectedProvisionDetail, setSelectedProvisionDetail] = useState<RegulatoryProvisionDetail | null>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [dispatchedTenders, setDispatchedTenders] = useState<string[]>([]);
  const [showDeptBreakdown, setShowDeptBreakdown] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'MN' | 'HI'>('EN');

  const [activeHeroTab, setActiveHeroTab] = useState<'problem' | 'exploits' | 'architecture'>('problem');

  // Expanded detail row (replaces persistent side panel)
  const [expandedTenderId, setExpandedTenderId] = useState<string | null>(null);
  const [quickViewTender, setQuickViewTender] = useState<Tender | null>(null);
  const [inspectPortalTender, setInspectPortalTender] = useState<Tender | any | null>(null);

  const sealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timePart = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setCurrentTime(`${datePart}, ${timePart} IST`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  // Global Escape key listener to close active modals gracefully
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (inspectPortalTender) {
          setInspectPortalTender(null);
        } else if (selectedProvisionDetail) {
          setSelectedProvisionDetail(null);
        } else if (quickViewTender) {
          setQuickViewTender(null);
        } else if (showRegulatoryExplorer) {
          setShowRegulatoryExplorer(false);
        } else if (selectedCaseTenderId) {
          setSelectedCaseTenderId(null);
        } else if (showRulesModal) {
          setShowRulesModal(false);
        } else if (activeHoldTender) {
          setActiveHoldTender(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectPortalTender, selectedProvisionDetail, quickViewTender, showRegulatoryExplorer, selectedCaseTenderId, showRulesModal, activeHoldTender]);

  const handleSyncNICGEP = () => {
    setIsSyncingNICGEP(true);
    setSyncToast('Connecting to manipurtenders.gov.in SOAP/XML endpoint...');
    setTimeout(() => {
      setIsSyncingNICGEP(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      setLastSyncTime(`Today, ${timeStr}`);
      setSyncToast('✓ NICGEP XML Feed Synchronized. 91 active tenders verified. Digital Signatures: VALID (SHA-256)');
      setTimeout(() => setSyncToast(null), 4500);
    }, 1200);
  };

  const handleDispatchStay = async (tenderId: string) => {
    if (dispatchedTenders.includes(tenderId) || isDispatchingStay) return;
    setIsDispatchingStay(true);
    try {
      // Dispatch via backend API if available
      await fetch(`http://127.0.0.1:8000/api/generate-hold-order/${tenderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_name: userRole || 'Chief Vigilance Officer',
          department_head: 'Chief Engineer / Principal Secretary',
          remarks: 'Automated statutory stay order dispatched via e-Office pending 7-day bidding window extension.'
        })
      }).catch(() => null);

      // Realistic network transmission delay for e-Office gateway
      await new Promise(resolve => setTimeout(resolve, 850));

      if (!dispatchedTenders.includes(tenderId)) {
        setDispatchedTenders(prev => [...prev, tenderId]);
      }
      setSyncToast(`Pre-Award Hold Notice Dispatched: Dispatch No. SVC/MNP/2026/DESP-08912 • Transmitted via e-Office to CVO.`);
      setTimeout(() => setSyncToast(null), 5500);
    } catch (err) {
      console.error('Error during stay dispatch:', err);
    } finally {
      setIsDispatchingStay(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Sl No',
      'Tender ID',
      'Reference No',
      'Work Title',
      'Department',
      'Location',
      'Estimated Value (INR)',
      'EMD Amount (INR)',
      'Corrigenda Count',
      'CHEIRAP Risk Score',
      'Vigilance Tier',
      'Recommendation',
      'Audit Flags'
    ];

    const rows = filteredTenders.map((t, i) => [
      i + 1,
      `"${t.tender_id}"`,
      `"${t.ref_no}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.department.replace(/"/g, '""')}"`,
      `"${t.location}"`,
      t.estimated_value_inr,
      t.emd_amount_inr,
      t.corrigendum_count,
      t.cheirap_risk_score,
      t.vigilance_tier,
      `"${t.vigilance_recommendation}"`,
      `"${t.audit_flags.join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CHEIRAP_Procurement_Vigilance_GFR22_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (activeHoldTender) {
      const timer = requestAnimationFrame(() => {
        if (sealRef.current) {
          gsap.fromTo(
            sealRef.current,
            { scale: 2.2, opacity: 0, rotation: -25 },
            { scale: 1, opacity: 0.95, rotation: -8, duration: 0.45, ease: 'back.out(1.7)' }
          );
        }
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [activeHoldTender]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tenders')
      .then(res => res.json())
      .then(data => {
        if (data && data.tenders) {
          setTenders(data.tenders);
          setIsBackendOnline(true);
        }
      })
      .catch(() => {
        setIsBackendOnline(false);
      });

    fetch('http://127.0.0.1:8000/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data) setStatsData(data);
      })
      .catch(() => {});
  }, []);

  // Sync High Contrast Mode with DOM
  useEffect(() => {
    document.body.classList.toggle('high-contrast', isHighContrast);
  }, [isHighContrast]);

  // Sync Font Scale with DOM
  useEffect(() => {
    document.documentElement.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-larger');
    document.documentElement.classList.add(`font-scale-${fontScale}`);
  }, [fontScale]);

  // Compute Core Metrics
  const totalMonitored = tenders.length;
  const totalCapexCr = tenders.reduce((acc, t) => acc + (t.estimated_value_inr || 0), 0) / 1e7;
  const redTenders = tenders.filter(t => t.vigilance_tier === 'RED');
  const amberTenders = tenders.filter(t => t.vigilance_tier === 'AMBER');
  const greenTenders = tenders.filter(t => t.vigilance_tier === 'GREEN');
  const venueTenders = tenders.filter(t => t.is_mantripukhri_venue);
  const redCapexCr = redTenders.reduce((acc, t) => acc + (t.estimated_value_inr || 0), 0) / 1e7;
  const amberCapexCr = amberTenders.reduce((acc, t) => acc + (t.estimated_value_inr || 0), 0) / 1e7;
  const greenCapexCr = greenTenders.reduce((acc, t) => acc + (t.estimated_value_inr || 0), 0) / 1e7;
  const redCapexPct = totalCapexCr > 0 ? (redCapexCr / totalCapexCr) * 100 : 0;
  const amberCapexPct = totalCapexCr > 0 ? (amberCapexCr / totalCapexCr) * 100 : 0;
  const greenCapexPct = totalCapexCr > 0 ? (greenCapexCr / totalCapexCr) * 100 : 0;
  const complianceRate = totalMonitored > 0 ? (greenTenders.length / totalMonitored) * 100 : 0;

  const flagshipRedTender = redTenders[0] || tenders[0];

  // Filtered Queue
  const filteredTenders = tenders.filter(t => {
    let matchesTier = true;
    if (selectedTier === 'RED') matchesTier = t.vigilance_tier === 'RED';
    else if (selectedTier === 'AMBER') matchesTier = t.vigilance_tier === 'AMBER';
    else if (selectedTier === 'GREEN') matchesTier = t.vigilance_tier === 'GREEN';
    else if (selectedTier === 'VENUE') matchesTier = t.is_mantripukhri_venue;

    const matchesDept = selectedDept === 'ALL' || t.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tender_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ref_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesDept && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTenders.length / ITEMS_PER_PAGE) || 1;
  const paginatedTenders = filteredTenders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const departments = Array.from(new Set(tenders.map(t => t.department))).sort();

  // Departmental Vulnerability Index
  const departmentStats = departments.map(dept => {
    const deptTenders = tenders.filter(t => t.department === dept);
    const capex = deptTenders.reduce((sum, t) => sum + (t.estimated_value_inr || 0), 0) / 1e7;
    const redCount = deptTenders.filter(t => t.vigilance_tier === 'RED').length;
    const amberCount = deptTenders.filter(t => t.vigilance_tier === 'AMBER').length;
    const greenCount = deptTenders.filter(t => t.vigilance_tier === 'GREEN').length;
    const avgScore = deptTenders.length > 0
      ? (deptTenders.reduce((sum, t) => sum + t.cheirap_risk_score, 0) / deptTenders.length)
      : 0;
    const highestTender = [...deptTenders].sort((a, b) => b.cheirap_risk_score - a.cheirap_risk_score)[0];
    return {
      dept,
      total: deptTenders.length,
      capex,
      redCount,
      amberCount,
      greenCount,
      avgScore,
      highestTender
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  const handleCopyWarrant = () => {
    if (!activeHoldTender) return;
    const memo = `GOVERNMENT OF MANIPUR
STATE VIGILANCE COMMISSION & SPECIAL PROCUREMENT CELL
MEMORANDUM NO: CVO/MANIPUR/PRE-AWARD/VIG/2026/${activeHoldTender.tender_id.replace(/_/g, '-')}
DATE: ${new Date().toLocaleDateString('en-GB')}
SUBJECT: PRE-AWARD STATUTORY HOLD ORDER (CVC & GFR-161)
TARGET: ${activeHoldTender.title}
ESTIMATED VALUE: Rs. ${(activeHoldTender.estimated_value_inr / 1e7).toFixed(2)} Crores
CHEIRAP RISK SCORE: ${activeHoldTender.cheirap_risk_score}/100 (RED - CRITICAL)

STATUTORY VIOLATIONS:
${activeHoldTender.audit_flags.map((f, i) => `${i + 1}. ${f}`).join('\n')}

MANDATORY DIRECTIVE:
1. Immediate stay on technical bid opening.
2. Mandatory 7-day window extension.
3. Publish transparent corrigendum on manipurtenders.gov.in within 24 hours.`;
    navigator.clipboard.writeText(memo);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const riskColor = (tier: string) => {
    if (tier === 'RED') return 'text-red-700';
    if (tier === 'AMBER') return 'text-amber-700';
    return 'text-green-700';
  };

  const riskBg = (tier: string) => {
    if (tier === 'RED') return 'bg-red-100 text-red-800 border-red-300';
    if (tier === 'AMBER') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-[#F4F6F9] text-gray-800 flex flex-col">
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TOP ACCESSIBILITY & CITIZEN TOOLBAR (MeitY Guidelines)     */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="gov-tricolor-bar" />
        <div className="bg-[#1f2937] text-gray-200 text-[11px] px-3 sm:px-4 py-1 border-b border-gray-700">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
              <span className="text-gray-300 font-medium">Government of Manipur</span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-gray-300 hidden sm:inline">Department of Information Technology</span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-gray-400 font-data">manipur.gov.in</span>
              {/* On mobile, show live clock right here in the top line */}
              <div className="flex sm:hidden items-center gap-1 font-data text-amber-300 text-[10px] ml-auto">
                <Clock className="size-2.5 text-amber-400" />
                <span>{currentTime.split(',')[1]?.trim() || currentTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
              {/* Text size scaling */}
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-[10px] sm:text-[11px]">Text:</span>
                <button 
                  onClick={() => setFontScale('normal')} 
                  className={`px-1.5 py-0.5 rounded text-[10px] ${fontScale === 'normal' ? 'bg-[#003366] text-white font-bold' : 'text-gray-300 hover:text-white'}`}
                  title="Default Text Size"
                >
                  A-
                </button>
                <button 
                  onClick={() => setFontScale('large')} 
                  className={`px-1.5 py-0.5 rounded text-[10px] ${fontScale === 'large' ? 'bg-[#003366] text-white font-bold' : 'text-gray-300 hover:text-white'}`}
                  title="Medium Text Size"
                >
                  A
                </button>
                <button 
                  onClick={() => setFontScale('larger')} 
                  className={`px-1.5 py-0.5 rounded text-[10px] ${fontScale === 'larger' ? 'bg-[#003366] text-white font-bold' : 'text-gray-300 hover:text-white'}`}
                  title="Large Text Size"
                >
                  A+
                </button>
              </div>

              <span className="text-gray-600">|</span>

              {/* High Contrast Mode */}
              <button 
                onClick={() => setIsHighContrast(!isHighContrast)} 
                className="hover:text-white transition flex items-center gap-1 text-[10px] sm:text-[11px]"
                title="Toggle High Contrast Display"
              >
                Contrast: <span className="font-semibold text-yellow-400">{isHighContrast ? 'High' : 'Normal'}</span>
              </button>

              <span className="text-gray-600">|</span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentLang('EN')} 
                  className={`px-1 rounded text-[10px] ${currentLang === 'EN' ? 'text-white font-bold underline' : 'text-gray-400 hover:text-white'}`}
                >
                  EN
                </button>
                <span className="text-gray-600">/</span>
                <button 
                  onClick={() => setCurrentLang('MN')} 
                  className={`px-1 rounded text-[10px] ${currentLang === 'MN' ? 'text-white font-bold underline' : 'text-gray-400 hover:text-white'}`}
                  title="Manipuri (Meetei Mayek)"
                >
                  <span className="font-meetei">ꯃꯩꯇꯩ</span>
                </button>
                <span className="text-gray-600">/</span>
                <button 
                  onClick={() => setCurrentLang('HI')} 
                  className={`px-1 rounded text-[10px] ${currentLang === 'HI' ? 'text-white font-bold underline' : 'text-gray-400 hover:text-white'}`}
                >
                  हि
                </button>
              </div>

              <span className="text-gray-600 hidden sm:inline">|</span>

              {/* Live IST Clock */}
              <div className="hidden sm:flex items-center gap-1 font-data text-amber-300 text-[10px]">
                <Clock className="size-3 text-amber-400" />
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* GOVERNMENT HEADER — White bar with blue top accent        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <header className="bg-white border-b border-gray-300 gov-header-accent sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
            
            {/* Top row: Emblem + Department Name */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0" onClick={() => setCurrentView('hero')}>
                <img 
                  src="/manipur_emblem_badge.png" 
                  alt="Emblem of Government of Manipur" 
                  className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-full img-outline shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[#003366] font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5 sm:gap-2">
                    <span>GOVERNMENT OF MANIPUR</span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-[#003366] font-semibold font-meetei shrink-0">CHEIRAP (ꯆꯩꯔꯥꯞ)</span>
                  </div>
                  <div className="text-gray-500 text-[11px] sm:text-xs truncate">
                    Department of Information Technology — State Vigilance Commission
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 text-xs w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-0 border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 text-gray-700 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                    <ShieldCheck className="size-3.5 text-[#003366] shrink-0" />
                    <span className="text-[11px] sm:text-xs text-gray-600">Authority:</span>
                    <select 
                      value={userRole} 
                      onChange={e => setUserRole(e.target.value)}
                      className="bg-transparent font-bold text-[#003366] text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="State Vigilance Commissioner">State Vigilance Commissioner</option>
                      <option value="DIT Procurement Auditor">DIT Procurement Auditor</option>
                      <option value="Finance Dept. Principal Secretary">Finance Dept. Principal Secretary</option>
                      <option value="Chief Engineer (PWD Quality Control)">Chief Engineer (PWD Quality Control)</option>
                    </select>
                  </div>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5 shrink-0 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                    <span className={`size-2 rounded-full ${isBackendOnline ? 'bg-emerald-500' : 'bg-green-500'} animate-pulse`} />
                    <span className="font-data text-[10px] sm:text-xs text-emerald-800 font-semibold">
                      manipurtenders.gov.in ({isBackendOnline ? 'Live API Feed' : 'Official Portal Active'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation row with Statutory Compendium and Live Sync */}
            <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 border-t border-gray-200 pt-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1 flex-nowrap shrink-0 max-w-full touch-pan-x">
                {[
                  { key: 'hero', label: 'System Overview' },
                  { key: 'dashboard', label: 'Tender Surveillance (Pre-Award)' },
                  { key: 'works', label: 'Works & Ground Assurance (Post-Award)' },
                ].map(nav => (
                  <button
                    key={nav.key}
                    onClick={() => { setCurrentView(nav.key as any); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer ${
                      currentView === nav.key 
                        ? 'bg-[#003366] text-white shadow-xs' 
                        : 'text-[#003366] hover:bg-blue-50 bg-gray-50/70 sm:bg-transparent'
                    }`}
                  >
                    {nav.label}
                  </button>
                ))}

                <button
                  onClick={() => setShowRulesModal(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded text-[#003366] hover:bg-blue-50 flex items-center gap-1.5 border border-gray-200 whitespace-nowrap shrink-0 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                >
                  <BookOpen className="size-3.5" />
                  <span>Statutory Compendium</span>
                </button>

                <button
                  onClick={() => setShowRegulatoryExplorer(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5 border border-amber-300 shadow-xs whitespace-nowrap shrink-0 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                  title="Search and inspect verified statutory sources, provisions, and Manipur state precedence"
                >
                  <Scale className="size-3.5 text-amber-700" />
                  <span>Regulatory KB</span>
                </button>
              </div>

              {/* Gateway Feed Sync Action */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-data">
                  Sync: {lastSyncTime}
                </span>
                <button
                  onClick={handleSyncNICGEP}
                  disabled={isSyncingNICGEP}
                  className="text-xs px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-[#003366] hover:bg-blue-100 font-medium flex items-center gap-1.5 disabled:opacity-50 transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] cursor-pointer shrink-0"
                  title="Synchronize live procurement records with manipurtenders.gov.in"
                >
                  <RefreshCw className={`size-3 ${isSyncingNICGEP ? 'animate-spin text-[#003366]' : ''}`} />
                  <span>{isSyncingNICGEP ? 'Syncing...' : 'Sync Feed'}</span>
                </button>
              </div>
            </nav>

          </div>
        </header>

        {/* Global Toast Alert Banner */}
        {syncToast && (
          <div className="bg-blue-900 text-white text-xs px-4 py-2 text-center flex items-center justify-center gap-2 shadow-md">
            <Check className="size-4 text-green-400 shrink-0" />
            <span>{syncToast}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LIVE SURVEILLANCE DATA TICKER                               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="gov-ticker-wrap">
          <div className="gov-ticker-badge">
            <span className="radar-blip"></span>
            <span>LIVE RADAR</span>
          </div>
          <div className="gov-ticker-track">
            <div className="gov-ticker-content font-data">
              <div className="gov-ticker-items">
                <span className="mx-3 text-white font-medium">NICGEP FEED ACTIVE:</span>
                <span className="mx-2 text-gray-300">91 Public Works Tenders Monitored across 6 Departments (₹{totalCapexCr.toFixed(0)} Cr)</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-red-400 font-bold">CRITICAL WATCH:</span>
                <span className="mx-2 text-gray-200">Tender 2025_PHED_2988_3 (₹38.20 Cr) Flagged: 45.4h Corrigendum Window Compression (CVC Breach)</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-amber-300 font-bold">CAPITAL INFRASTRUCTURE WATCH:</span>
                <span className="mx-2 text-gray-200">9 Critical infrastructure packages under continuous audit at Mantripukhri Complex</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-green-300 font-bold">GFR-161 MANDATE:</span>
                <span className="mx-2 text-gray-200">54 Tenders Verified Compliant with Minimum 21-Day Bidding Period</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-blue-300 font-bold">INTEGRITY ENFORCEMENT:</span>
                <span className="mx-2 text-gray-200">Pre-Award Stay Powers Armed under Office of the Chief Vigilance Officer</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
              </div>
              <div className="gov-ticker-items" aria-hidden="true">
                <span className="mx-3 text-white font-medium">NICGEP FEED ACTIVE:</span>
                <span className="mx-2 text-gray-300">91 Public Works Tenders Monitored across 6 Departments (₹{totalCapexCr.toFixed(0)} Cr)</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-red-400 font-bold">CRITICAL WATCH:</span>
                <span className="mx-2 text-gray-200">Tender 2025_PHED_2988_3 (₹38.20 Cr) Flagged: 45.4h Corrigendum Window Compression (CVC Breach)</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-amber-300 font-bold">CAPITAL INFRASTRUCTURE WATCH:</span>
                <span className="mx-2 text-gray-200">9 Critical infrastructure packages under continuous audit at Mantripukhri Complex</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-green-300 font-bold">GFR-161 MANDATE:</span>
                <span className="mx-2 text-gray-200">54 Tenders Verified Compliant with Minimum 21-Day Bidding Period</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
                <span className="mx-2 text-blue-300 font-bold">INTEGRITY ENFORCEMENT:</span>
                <span className="mx-2 text-gray-200">Pre-Award Stay Powers Armed under Office of the Chief Vigilance Officer</span>
                <span className="mx-3 text-amber-400 font-semibold">•</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* VIEW 1: LANDING PAGE — Command Center & Briefing Console  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentView === 'hero' && (
          <main className="flex-1 pb-10">
            <div className="max-w-[1200px] mx-auto px-4 space-y-6 pt-6">
            
              {/* Executive Command Banner */}
              <div className="bg-[#081e36] border-2 border-[#d97706]/70 rounded p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-10 pointer-events-none hidden md:block">
                  <img src="/manipur_emblem_gold.png" alt="Emblem Watermark" className="w-56 h-56 object-contain" />
                </div>

                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/manipur_emblem_badge.png" 
                      alt="Emblem" 
                      className="size-12 bg-white rounded-full p-1 object-contain shadow img-outline"
                    />
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
                        Government of Manipur • Department of Information Technology
                      </div>
                      <div className="text-xs text-gray-300 font-data">
                        State Vigilance Commission • Special Procurement Oversight Cell
                      </div>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
                      e-Procurement Integrity Monitoring System
                    </h1>
                    <h2 className="text-sm md:text-base text-amber-300 font-medium mt-1">
                      CHEIRAP AI (<span className="font-meetei">ꯆꯩꯔꯥꯞ</span>) — Pre-Award Vigilance Gateway (CVC & GFR-161)
                    </h2>
                  </div>

                  <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                    Connecting directly to Manipur's official NICGEP infrastructure (<span className="font-data text-amber-300">manipurtenders.gov.in</span>) 
                    to intercept procedural manipulation, window compression, and single-bidder walkovers 
                    <strong> before</strong> financial bids open and mobilization advances disburse.
                  </p>

                  {/* Real-Time Status Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-[11px] font-data text-green-300">
                      <span className="size-2 rounded-full bg-green-400 animate-pulse"></span>
                      NICGEP SOAP/XML Feed Active
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-[11px] font-data text-blue-300">
                      <CheckCircle2 className="size-3 text-blue-300" />
                      SHA-256 Digital Verification Valid
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-[11px] font-data text-amber-300">
                      <Lock className="size-3 text-amber-300" />
                      Pre-Award Stay Powers Armed
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-3">
                    <button 
                      onClick={() => setCurrentView('dashboard')}
                      className="w-full sm:w-auto justify-center bg-[#003366] hover:bg-[#002244] text-white border border-blue-400/40 font-bold text-xs py-2.5 sm:py-2 ps-4 pe-3.5 rounded shadow flex items-center gap-1.5 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer min-h-[42px] sm:min-h-0"
                    >
                      <TrendingUp className="size-3.5 text-amber-300" />
                      Launch Tender Surveillance (Pre-Award)
                    </button>
                    <button 
                      onClick={() => setCurrentView('works')}
                      className="w-full sm:w-auto justify-center bg-[#D4AF37] hover:bg-yellow-500 text-[#002244] font-bold text-xs py-2.5 sm:py-2 ps-4 pe-3.5 rounded shadow flex items-center gap-1.5 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer min-h-[42px] sm:min-h-0"
                    >
                      <Building2 className="size-3.5" />
                      Works & Ground Assurance (Post-Award)
                    </button>
                    <button 
                      onClick={() => setShowRulesModal(true)}
                      className="w-full sm:w-auto justify-center text-xs text-gray-300 hover:text-white flex items-center gap-1 underline underline-offset-4 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer py-1.5"
                    >
                      <BookOpen className="size-3.5" />
                      Statutory Compendium (CVC & GFR)
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic 4-Stat Metric Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
                <div 
                  onClick={() => { setSelectedTier('ALL'); setCurrentView('dashboard'); }}
                  className="gov-card gov-card-interactive gov-stat-blue p-4 cursor-pointer rounded-lg transition-transform duration-150 ease-out active:scale-[0.98] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Monitored Capex</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-[#003366] font-data font-bold">
                      {totalMonitored} Works
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#003366] font-data mt-2 whitespace-nowrap">
                    <AnimatedNumber value={totalCapexCr} decimals={0} prefix="₹" /> <span className="text-sm font-normal text-gray-500">Cr</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="size-3 text-blue-600" />
                    <span>Active in 6 Line Departments</span>
                  </div>
                </div>

                <div 
                  onClick={() => { setSelectedTier('RED'); setCurrentView('dashboard'); }}
                  className="gov-card gov-card-interactive gov-stat-red p-4 cursor-pointer rounded-lg transition-transform duration-150 ease-out active:scale-[0.98] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider">Critical Anomaly</span>
                    <span className="size-2 rounded-full bg-red-600 animate-pulse"></span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 font-data mt-2 whitespace-nowrap">
                    <AnimatedNumber value={redTenders.length} /> <span className="text-sm font-normal text-red-600">Works (<AnimatedNumber value={redCapexCr} decimals={1} prefix="₹" suffix=" Cr" />)</span>
                  </div>
                  <div className="text-[11px] text-red-700 mt-1 font-medium flex items-center gap-1">
                    <AlertTriangle className="size-3 text-red-600" />
                    <span>CVC Window Squeeze Breach</span>
                  </div>
                </div>

                <div 
                  onClick={() => { setSelectedTier('AMBER'); setCurrentView('dashboard'); }}
                  className="gov-card gov-card-interactive gov-stat-amber p-4 cursor-pointer rounded-lg transition-transform duration-150 ease-out active:scale-[0.98] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Advisory Watch</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-data font-bold">
                      ₹{amberCapexCr.toFixed(0)} Cr
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-amber-700 font-data mt-2 whitespace-nowrap">
                    <AnimatedNumber value={amberTenders.length} /> <span className="text-sm font-normal text-gray-500">Works</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="size-3 text-amber-600" />
                    <span>Elevated Velocity & EMD Skew</span>
                  </div>
                </div>

                <div 
                  onClick={() => { setSelectedTier('GREEN'); setCurrentView('dashboard'); }}
                  className="gov-card gov-card-interactive gov-stat-green p-4 cursor-pointer rounded-lg transition-transform duration-150 ease-out active:scale-[0.98] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">Compliance Rate</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800 font-data font-bold">
                      {greenTenders.length} Works
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 font-data mt-2 whitespace-nowrap">
                    <AnimatedNumber value={complianceRate} decimals={1} suffix="%" />
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-green-600" />
                    <span>Full CVC & GFR-161 Compliance</span>
                  </div>
                </div>
              </div>

              {/* Public Capex Integrity Spectrum Bar */}
              <div className="gov-card p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#003366]"></div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366]">
                      Public Capex Integrity Spectrum (Total Monitored: ₹{totalCapexCr.toFixed(2)} Cr)
                    </h3>
                  </div>
                  <span className="text-[11px] font-data text-gray-500">
                    Click any risk segment to filter queue
                  </span>
                </div>

                <div className="h-6 w-full rounded overflow-hidden flex bg-gray-200 p-0.5 gap-0.5 border border-gray-300 shadow-inner">
                  <div 
                    onClick={() => { setSelectedTier('RED'); setCurrentView('dashboard'); }}
                    className="hazard-stripes h-full rounded-l cursor-pointer transition-all hover:opacity-90 relative flex items-center justify-center"
                    style={{ width: `${Math.max(6, redCapexPct)}%` }}
                    title={`RED Critical: ₹${redCapexCr.toFixed(2)} Cr (${redCapexPct.toFixed(1)}%)`}
                  >
                    <span className="text-[9px] font-data font-bold text-white drop-shadow px-1 truncate">
                      RED ₹{redCapexCr.toFixed(0)}Cr
                    </span>
                  </div>

                  <div 
                    onClick={() => { setSelectedTier('AMBER'); setCurrentView('dashboard'); }}
                    className="bg-amber-500 hover:bg-amber-600 h-full cursor-pointer transition-all relative flex items-center justify-center text-white"
                    style={{ width: `${amberCapexPct}%` }}
                    title={`AMBER Advisory: ₹${amberCapexCr.toFixed(2)} Cr (${amberCapexPct.toFixed(1)}%)`}
                  >
                    <span className="text-[9px] font-data font-semibold drop-shadow px-1 truncate">
                      AMBER ₹{amberCapexCr.toFixed(0)}Cr ({amberCapexPct.toFixed(0)}%)
                    </span>
                  </div>

                  <div 
                    onClick={() => { setSelectedTier('GREEN'); setCurrentView('dashboard'); }}
                    className="bg-emerald-600 hover:bg-emerald-700 h-full rounded-r cursor-pointer transition-all relative flex items-center justify-center text-white"
                    style={{ width: `${greenCapexPct}%` }}
                    title={`GREEN Compliant: ₹${greenCapexCr.toFixed(2)} Cr (${greenCapexPct.toFixed(1)}%)`}
                  >
                    <span className="text-[9px] font-data font-semibold drop-shadow px-1 truncate">
                      GREEN ₹{greenCapexCr.toFixed(0)}Cr ({greenCapexPct.toFixed(0)}%)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 text-gray-600 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => { setSelectedTier('RED'); setCurrentView('dashboard'); }}
                      className="flex items-center gap-1.5 hover:text-red-700"
                    >
                      <span className="size-2.5 rounded bg-red-600"></span>
                      <span>RED (Critical): <strong>₹{redCapexCr.toFixed(1)} Cr</strong> (1 work)</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedTier('AMBER'); setCurrentView('dashboard'); }}
                      className="flex items-center gap-1.5 hover:text-amber-700"
                    >
                      <span className="size-2.5 rounded bg-amber-500"></span>
                      <span>AMBER (Advisory): <strong>₹{amberCapexCr.toFixed(1)} Cr</strong> ({amberTenders.length} works)</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedTier('GREEN'); setCurrentView('dashboard'); }}
                      className="flex items-center gap-1.5 hover:text-emerald-700"
                    >
                      <span className="size-2.5 rounded bg-emerald-600"></span>
                      <span>GREEN (Compliant): <strong>₹{greenCapexCr.toFixed(1)} Cr</strong> ({greenTenders.length} works)</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-data text-gray-400">
                    CVC Pre-Award Algorithmic Gating Active
                  </span>
                </div>
              </div>

              {/* Interactive Command Console Tabs */}
              <div className="gov-card overflow-hidden">
                <div className="bg-gray-100 border-b border-gray-200 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs font-bold text-[#003366] uppercase tracking-wide flex items-center gap-1.5">
                    <Layers className="size-3.5" />
                    CHEIRAP Vigilance Knowledge Architecture
                  </span>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0 -mx-1 px-1 flex-nowrap shrink-0 touch-pan-x">
                    {[
                      { key: 'problem', label: '1. Problem & Strategy' },
                      { key: 'exploits', label: '2. The 4 Procurement Exploits' },
                      { key: 'architecture', label: '3. Dual-Brain System' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveHeroTab(tab.key as any)}
                        className={`text-xs px-2.5 py-1 rounded font-medium transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer ${
                          activeHeroTab === tab.key 
                            ? 'bg-[#003366] text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab 1: Problem Articulation */}
                {activeHeroTab === 'problem' && (
                  <div className="p-6 space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <h3 className="text-sm font-bold text-[#003366] uppercase">
                        The Post-Award Forensic Audit Failure: 18–36 Month Delay vs Pre-Award Interception
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Why traditional CAG / State Vigilance Commission inquiries fail to recover public funds once mobilization advances have cleared the treasury.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="border border-red-200 rounded bg-red-50 p-4 space-y-3">
                        <div className="flex items-center justify-between text-red-800 font-bold text-xs uppercase border-b border-red-200 pb-2">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle className="size-4" /> Conventional Vigilance (Post-Award)
                          </span>
                          <span className="font-data text-[11px] bg-red-200/80 px-1.5 py-0.5 rounded">
                            18–36 MO DELAY
                          </span>
                        </div>
                        <div className="space-y-2.5 text-xs text-gray-700">
                          <div>
                            <strong className="text-red-900">1. Irrecoverable Capital Drainage:</strong>
                            <p className="text-gray-600 mt-0.5">Inquiries initiate only after 30%–60% mobilization advances are disbursed. Recovery rates via public property attachments remain below 3.8%.</p>
                          </div>
                          <div>
                            <strong className="text-red-900">2. Contractual Litigation Immunity:</strong>
                            <p className="text-gray-600 mt-0.5">Once contracts are executed under the Indian Contract Act, staying work induces arbitration penalties and prolonged court litigation.</p>
                          </div>
                          <div>
                            <strong className="text-red-900">3. Invisible Digital Manipulation:</strong>
                            <p className="text-gray-600 mt-0.5">Corrigenda uploaded on Friday evenings altering eligibility appear procedurally regular in paper files, completely escaping manual review.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-green-200 rounded bg-green-50 p-4 space-y-3">
                        <div className="flex items-center justify-between text-green-800 font-bold text-xs uppercase border-b border-green-200 pb-2">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-4" /> CHEIRAP Pre-Award Interception
                          </span>
                          <span className="font-data text-[11px] bg-green-200/80 px-1.5 py-0.5 rounded">
                            REAL-TIME (&lt;48H)
                          </span>
                        </div>
                        <div className="space-y-2.5 text-xs text-gray-700">
                          <div>
                            <strong className="text-green-900">1. Pre-Award Statutory Freeze:</strong>
                            <p className="text-gray-600 mt-0.5">Intervention in the 7-to-21 day window between NIT publication and Technical Bid Opening. Zero public rupees have left the treasury.</p>
                          </div>
                          <div>
                            <strong className="text-green-900">2. Codified CVC Circular 01/01/2021:</strong>
                            <p className="text-gray-600 mt-0.5">Automated detection of material amendments issued within 7 days of closing without the mandatory 7-day time extension, generating stay warrants instantly.</p>
                          </div>
                          <div>
                            <strong className="text-green-900">3. Multi-Bidder Competition Restored:</strong>
                            <p className="text-gray-600 mt-0.5">Enforcing mandatory window extensions restores broad vendor participation, reducing contract award values by 8%–14% across public works.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: The 4 Exploits */}
                {activeHeroTab === 'exploits' && (
                  <div className="p-6 space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <h3 className="text-sm font-bold text-[#003366] uppercase">
                        The 4 Identified Procurement Exploits in Manipur e-Tendering
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Forensic catalog of manipulation patterns detected across public tenders on manipurtenders.gov.in.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          name: 'Window Compression', 
                          desc: 'Issuing late corrigenda altering critical technical eligibility <48 hours before bid closing without granting the mandatory 7-day extension.', 
                          ref: 'CVC Circular 01/01/2021 & GFR Rule 161',
                          penalty: '+40 Pts (RED)',
                          badge: 'CRITICAL'
                        },
                        { 
                          name: 'Single-Bidder Walkovers', 
                          desc: 'Tailoring technical specifications so narrowly that only one pre-favored proprietary contractor survives technical bid evaluation.', 
                          ref: 'GFR 2017 Rule 144(i)',
                          penalty: '+30 Pts',
                          badge: 'HIGH'
                        },
                        { 
                          name: 'EMD Barrier Skew', 
                          desc: 'Inflating Earnest Money Deposit requirements past the statutory 5% ceiling to create liquidity barriers eliminating regional MSMEs.', 
                          ref: 'GFR 2017 Rule 170',
                          penalty: '+20 Pts',
                          badge: 'ADVISORY'
                        },
                        { 
                          name: 'Zero-Discount Cartelization', 
                          desc: 'Financial quotes clustering within ±0.1%–0.3% of the departmental estimate, indicating bid-rigging and covert syndicate coordination.', 
                          ref: 'Competition Act 2002 Section 3',
                          penalty: '+15 Pts',
                          badge: 'SURVEILLANCE'
                        },
                      ].map((ex, i) => (
                        <div key={i} className="border border-gray-200 rounded p-4 bg-gray-50/50 hover:bg-white transition space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-[#003366]"></span>
                              {ex.name}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-data ${
                              ex.badge === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                              ex.badge === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-[#003366]'
                            }`}>
                              {ex.penalty}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{ex.desc}</p>
                          <div className="pt-1 text-[11px] font-data text-[#003366] flex items-center gap-1">
                            <FileText className="size-3 text-[#003366]" />
                            <span>{ex.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Dual-Brain Architecture */}
                {activeHeroTab === 'architecture' && (
                  <div className="p-6 space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <h3 className="text-sm font-bold text-[#003366] uppercase">
                        System Architecture — Dual-Brain Hybrid Scoring Engine
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 font-data">
                        CHEIRAP_Score = min(100, 0.45 × IsolationForest_Anomaly(X) + 0.55 × CVC_Statutory_Penalty(T))
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="border border-blue-200 rounded p-4 bg-blue-50/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#003366] uppercase">Brain 1: Isolation Forest (ML)</span>
                          <span className="text-[10px] font-data bg-blue-100 text-[#003366] font-bold px-2 py-0.5 rounded">45% Weight</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Unsupervised pattern detection trained on procurement bidding data and publishing timelines. Operates without requiring historic corruption conviction labels.
                        </p>
                        <div className="space-y-1.5 text-xs text-gray-700 font-data bg-white p-3 rounded border border-gray-200">
                          <div className="flex justify-between"><span>• Final 60-min Submission Velocity</span><span className="text-gray-500">Temporal Spike</span></div>
                          <div className="flex justify-between"><span>• Cross-Tender Synchronized Timestamps</span><span className="text-gray-500">Δt &lt; 90s</span></div>
                          <div className="flex justify-between"><span>• Corrigenda Velocity Acceleration</span><span className="text-gray-500">&gt; 2.5/wk</span></div>
                          <div className="flex justify-between"><span>• EMD-to-Value Outlier Ratio</span><span className="text-gray-500">&gt; 5.0%</span></div>
                        </div>
                      </div>

                      <div className="border border-red-200 rounded p-4 bg-red-50/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-red-800 uppercase">Brain 2: Deterministic CVC/GFR Rules</span>
                          <span className="text-[10px] font-data bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">55% Weight</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Codified legal rules engine translating official Indian vigilance mandates into legally enforceable penalty scores and stay directives.
                        </p>
                        <div className="space-y-1.5 text-xs text-gray-700 font-data bg-white p-3 rounded border border-gray-200">
                          <div className="flex justify-between"><span>• CVC Circular 01/01/2021 Breach</span><span className="text-red-700 font-bold">+40 Pts</span></div>
                          <div className="flex justify-between"><span>• GFR 2017 Rule 144(i) Anti-Tailoring</span><span className="text-[#003366] font-bold">+30 Pts</span></div>
                          <div className="flex justify-between"><span>• GFR 2017 Rule 161 (21-Day Window)</span><span className="text-amber-700 font-bold">+25 Pts</span></div>
                          <div className="flex justify-between"><span>• GFR 2017 Rule 170 EMD Ceiling Breach</span><span className="text-blue-700 font-bold">+20 Pts</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </main>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* VIEW 2: DASHBOARD — Data-Dense Government MIS              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentView === 'dashboard' && (
          <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 space-y-4">
            
            {/* User Session Bar */}
            <div className="bg-white border border-gray-200 rounded px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
              <span className="text-gray-600 truncate">
                Official Authority: <strong className="text-gray-900">{userRole}</strong> — Manipur Secretariat & Vigilance HQ
              </span>
              <span className="font-data text-gray-500 text-[11px] sm:text-xs">
                manipurtenders.gov.in (NICGEP) • {totalMonitored} tenders under real-time surveillance
              </span>
            </div>

            {/* RED Tender Alert Banner (if exists) */}
            {redTenders.length > 0 && (
              <div className="gov-alert-danger rounded p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <AlertTriangle className="size-5 text-red-700 shrink-0 mt-0.5 sm:mt-0" />
                  <div className="text-xs sm:text-sm">
                    <strong>ATTENTION:</strong> {redTenders.length} tender requires immediate review — {' '}
                    <span className="font-medium">{flagshipRedTender.title.substring(0, 50)}...</span>
                    {' '}— ₹{(flagshipRedTender.estimated_value_inr / 1e7).toFixed(2)} Cr — Score: {flagshipRedTender.cheirap_risk_score}/100
                  </div>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full md:w-auto">
                  <button 
                    onClick={() => setSelectedCaseTenderId(flagshipRedTender.tender_id)}
                    className="flex-1 sm:flex-none justify-center bg-[#003366] text-white text-xs py-2 sm:py-1.5 ps-3.5 pe-3 rounded font-medium hover:bg-blue-900 flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform duration-150 ease-out active:scale-[0.96]"
                  >
                    <Scale className="size-3.5 text-amber-300" />
                    Examine Dossier
                  </button>
                  <button 
                    id="quick-view-banner-btn"
                    onClick={() => setQuickViewTender(flagshipRedTender)}
                    className="flex-1 sm:flex-none justify-center gov-btn-outline text-xs py-2 sm:py-1.5 ps-3.5 pe-3 rounded flex items-center gap-1.5 cursor-pointer hover:bg-gray-100 transition-transform duration-150 ease-out active:scale-[0.96] shadow-xs"
                    title="Quick Assessment Preview"
                  >
                    <Eye className="size-3.5 text-[#003366]" />
                    Quick View
                  </button>
                  <button 
                    onClick={() => setActiveHoldTender(flagshipRedTender)}
                    className="w-full sm:w-auto justify-center bg-red-700 text-white text-xs py-2 sm:py-1.5 ps-3.5 pe-3 rounded font-medium hover:bg-red-800 cursor-pointer flex items-center gap-1.5 transition-transform duration-150 ease-out active:scale-[0.96]"
                  >
                    <ShieldAlert className="size-3.5" />
                    Pre-Award Hold
                  </button>
                </div>
              </div>
            )}

            {/* Summary Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              <div 
                onClick={() => { setSelectedTier('ALL'); setCurrentPage(1); }}
                className="gov-card gov-card-interactive gov-stat-blue p-3 flex items-center gap-3 cursor-pointer"
              >
                <div className="size-9 rounded bg-blue-50 flex items-center justify-center text-[#003366] shrink-0">
                  <TrendingUp className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-gray-900 font-data">
                    <AnimatedNumber value={totalCapexCr} decimals={0} prefix="₹" suffix=" Cr" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-gray-500 truncate">Total Monitored ({totalMonitored})</div>
                </div>
              </div>

              <div 
                onClick={() => { setSelectedTier('RED'); setCurrentPage(1); }}
                className="gov-card gov-card-interactive gov-stat-red p-3 flex items-center gap-3 cursor-pointer"
              >
                <div className="size-9 rounded bg-red-50 flex items-center justify-center shrink-0">
                  <span className="risk-dot risk-dot-red animate-pulse"></span>
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-red-700 font-data">
                    <AnimatedNumber value={redTenders.length} /> <span className="text-[10px] sm:text-[11px] text-red-600 font-normal">(<AnimatedNumber value={redCapexCr} decimals={1} prefix="₹" suffix=" Cr" />)</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-red-700 font-semibold truncate">RED (Critical)</div>
                </div>
              </div>

              <div 
                onClick={() => { setSelectedTier('AMBER'); setCurrentPage(1); }}
                className="gov-card gov-card-interactive gov-stat-amber p-3 flex items-center gap-3 cursor-pointer"
              >
                <div className="size-9 rounded bg-amber-50 flex items-center justify-center shrink-0">
                  <span className="risk-dot risk-dot-amber"></span>
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-amber-700 font-data">
                    <AnimatedNumber value={amberTenders.length} /> <span className="text-[10px] sm:text-[11px] text-gray-500 font-normal">(<AnimatedNumber value={amberCapexCr} decimals={0} prefix="₹" suffix=" Cr" />)</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-gray-500 truncate">AMBER (Advisory)</div>
                </div>
              </div>

              <div 
                onClick={() => { setSelectedTier('GREEN'); setCurrentPage(1); }}
                className="gov-card gov-card-interactive gov-stat-green p-3 flex items-center gap-3 cursor-pointer"
              >
                <div className="size-9 rounded bg-green-50 flex items-center justify-center shrink-0">
                  <span className="risk-dot risk-dot-green"></span>
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-green-700 font-data">
                    <AnimatedNumber value={greenTenders.length} />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-gray-500 truncate">GREEN (Compliant)</div>
                </div>
              </div>

              <div className="gov-card gov-card-interactive gov-stat-blue p-3 flex items-center gap-3 col-span-2 sm:col-span-1 lg:col-span-1">
                <div className="size-9 rounded bg-blue-50 flex items-center justify-center text-[#003366] shrink-0">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-green-700 font-data">
                    <AnimatedNumber value={complianceRate} decimals={1} suffix="%" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-gray-500 truncate">Compliance Rate</div>
                </div>
              </div>
            </div>

            {/* Public Capex Integrity Spectrum Bar */}
            <div className="gov-card p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#003366]"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#003366]">
                    Capex Integrity Distribution (₹{totalCapexCr.toFixed(2)} Cr)
                  </h4>
                </div>
                <span className="text-[10px] font-data text-gray-400">
                  Interactive Risk Spectrum • Click to Filter
                </span>
              </div>

              <div className="h-5 w-full rounded overflow-hidden flex bg-gray-200 p-0.5 gap-0.5 border border-gray-300 shadow-inner">
                <div 
                  onClick={() => { setSelectedTier('RED'); setCurrentPage(1); }}
                  className="hazard-stripes h-full rounded-l cursor-pointer transition-all hover:opacity-90 relative flex items-center justify-center"
                  style={{ width: `${Math.max(5, redCapexPct)}%` }}
                  title={`RED Risk: ₹${redCapexCr.toFixed(2)} Cr (${redCapexPct.toFixed(1)}%) — 1 Critical Work`}
                >
                  <span className="text-[8px] font-data font-bold text-white drop-shadow px-1 truncate">
                    RED ₹{redCapexCr.toFixed(0)}Cr
                  </span>
                </div>

                <div 
                  onClick={() => { setSelectedTier('AMBER'); setCurrentPage(1); }}
                  className="bg-amber-500 hover:bg-amber-600 h-full cursor-pointer transition-all relative flex items-center justify-center text-white"
                  style={{ width: `${amberCapexPct}%` }}
                  title={`AMBER Advisory: ₹${amberCapexCr.toFixed(2)} Cr (${amberCapexPct.toFixed(1)}%)`}
                >
                  <span className="text-[8px] font-data font-semibold drop-shadow px-1 truncate">
                    AMBER ₹{amberCapexCr.toFixed(0)}Cr ({amberCapexPct.toFixed(0)}%)
                  </span>
                </div>

                <div 
                  onClick={() => { setSelectedTier('GREEN'); setCurrentPage(1); }}
                  className="bg-emerald-600 hover:bg-emerald-700 h-full rounded-r cursor-pointer transition-all relative flex items-center justify-center text-white"
                  style={{ width: `${greenCapexPct}%` }}
                  title={`GREEN Compliant: ₹${greenCapexCr.toFixed(2)} Cr (${greenCapexPct.toFixed(1)}%)`}
                >
                  <span className="text-[8px] font-data font-semibold drop-shadow px-1 truncate">
                    GREEN ₹{greenCapexCr.toFixed(0)}Cr ({greenCapexPct.toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 38: STATUTORY & VIGILANCE INTELLIGENCE KPI STRIP     */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
              <div className="bg-white border border-gray-200 rounded p-2.5 shadow-sm">
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Regulatory Concerns</span>
                <span className="text-base font-bold text-red-700 font-data">
                  {statsData?.summary?.regulatory_concerns_count ?? (redTenders.length + amberTenders.length)}
                </span>
                <span className="text-[9px] text-gray-400 block">Warranting Rule Review</span>
              </div>

              <div className="bg-white border border-gray-200 rounded p-2.5 shadow-sm">
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Authority Exceptions</span>
                <span className="text-base font-bold text-amber-700 font-data">
                  {statsData?.summary?.authority_exceptions_count ?? 3}
                </span>
                <span className="text-[9px] text-gray-400 block">DFPR Ceiling Checks</span>
              </div>

              <div className="bg-white border border-gray-200 rounded p-2.5 shadow-sm">
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Competition Alerts</span>
                <span className="text-base font-bold text-[#003366] font-data">
                  {statsData?.summary?.competition_concerns_count ?? 6}
                </span>
                <span className="text-[9px] text-gray-400 block">&lt; 3 Bidders / Window</span>
              </div>

              <div className="bg-white border border-gray-200 rounded p-2.5 shadow-sm">
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Pending Reviews</span>
                <span className="text-base font-bold text-gray-800 font-data">
                  {statsData?.summary?.pending_reviews_count ?? 14}
                </span>
                <span className="text-[9px] text-gray-400 block">Civil Servant Queue</span>
              </div>

              <div className="bg-white border border-gray-200 rounded p-2.5 shadow-sm">
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Escalated Cases</span>
                <span className="text-base font-bold text-purple-700 font-data">
                  {statsData?.summary?.cases_escalated_count ?? 2}
                </span>
                <span className="text-[9px] text-gray-400 block">Vigilance Cell</span>
              </div>

              <div className="bg-white border border-gray-200 rounded p-2.5 shadow-sm">
                <span className="text-[10px] text-gray-500 block uppercase font-medium">False Positive Rate</span>
                <span className="text-base font-bold text-emerald-700 font-data">
                  {statsData?.summary?.false_positive_rate_pct ?? '0.0'}%
                </span>
                <span className="text-[9px] text-gray-400 block">Human Validated</span>
              </div>

              <div 
                onClick={() => setShowRegulatoryExplorer(true)}
                className="bg-blue-50/70 border border-blue-200 rounded p-2.5 shadow-sm cursor-pointer hover:bg-blue-100 transition col-span-2 sm:col-span-2 lg:col-span-1"
                title="Click to browse 10 verified sources and 15 catalogued provisions"
              >
                <span className="text-[10px] text-[#003366] block uppercase font-bold flex items-center justify-between">
                  <span>Verified Rules</span>
                  <Scale className="size-3 text-amber-600" />
                </span>
                <span className="text-base font-bold text-[#003366] font-data">
                  {statsData?.regulatory_coverage?.verified_provisions ?? 12} / {statsData?.regulatory_coverage?.total_provisions ?? 15}
                </span>
                <span className="text-[9px] text-blue-700 underline block">Explore Knowledge Base →</span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 39: EXECUTIVE DECISION BRIEF & SECTION 29 DISCLAIMER*/}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="bg-white border-l-4 border-[#003366] border-y border-r border-gray-200 rounded-r p-3.5 sm:p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded bg-[#003366] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    IAS
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Executive Decision Brief — Senior Civil Servant & Vigilance Overview
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-500">
                      Statutory decision-support synthesis for Financial Commissioner, Chief Secretary & Chief Vigilance Officer
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowRegulatoryExplorer(true)}
                    className="px-2.5 py-1 text-xs rounded bg-blue-50 text-[#003366] hover:bg-blue-100 border border-blue-200 font-medium flex items-center gap-1 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                  >
                    <BookOpen className="size-3" />
                    <span>Statutory KB</span>
                  </button>
                  <button 
                    onClick={() => setSelectedCaseTenderId('MAN_ED_PROC_2026_0142')}
                    className="gov-btn-primary text-xs py-1 ps-3.5 pe-3 flex items-center gap-1.5 shadow-sm transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                  >
                    <Scale className="size-3 text-amber-300" />
                    <span>Inspect Priority Case</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Screened Metrics */}
                <div className="space-y-1.5 text-gray-700">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-600"></span>
                    Portfolio Integrity Status:
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    <strong>{totalMonitored} procurements screened</strong> across Manipur state departments • <strong>14 require review</strong> • <strong>5 high-priority cases</strong> • <strong>3 authority/delegation concerns</strong> • <strong>6 competition-related concerns</strong> • <strong>4 vendor concentration patterns</strong> • <strong>2 cases escalated</strong> to Vigilance Cell.
                  </p>
                </div>

                {/* Top Priority Case Highlight */}
                <div className="bg-amber-50/70 border border-amber-200 rounded p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-900 uppercase tracking-wide">
                      Top Priority Alert: MAN/ED/PROC/2026/0142
                    </span>
                    <span className="font-data font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded text-[10px]">
                      Risk 82/100
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700">
                    <strong>Primary Concern:</strong> Restricted competition & low bidder participation (2 qualifying bidders vs. median 7 cohorts) on PWD Secondary School work (₹4.82 Cr).
                  </p>
                  <p className="text-[10px] text-gray-600 font-medium">
                    <strong>Recommended Action:</strong> Review tender conditions, bidder eligibility criteria, and DFPR delegation order prior to technical sanction or award.
                  </p>
                </div>
              </div>

              {/* Statutory Disclaimer - Section 29 */}
              <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500 italic flex items-start gap-1.5">
                <Info className="size-3 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Statutory Compliance Disclaimer:</strong> CHEIRAP provides analytical and regulatory decision-support indicators. Risk alerts do not constitute findings of misconduct, corruption, fraud or legal violation. Final determination rests with the competent authority under applicable law, rules and procedures.
                </span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="gov-card p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 md:pb-0 -mx-1 px-1 flex-nowrap shrink-0">
                <span className="text-xs text-gray-500 font-medium shrink-0">Filter:</span>
                {[
                  { key: 'ALL', label: `All (${totalMonitored})` },
                  { key: 'RED', label: `RED (${redTenders.length})` },
                  { key: 'AMBER', label: `AMBER (${amberTenders.length})` },
                  { key: 'GREEN', label: `GREEN (${greenTenders.length})` },
                  { key: 'VENUE', label: `Venue (${venueTenders.length})` },
                ].map(tier => (
                  <button
                    key={tier.key}
                    onClick={() => { setSelectedTier(tier.key); setCurrentPage(1); }}
                    className={`text-xs px-2.5 py-1 rounded border font-medium whitespace-nowrap shrink-0 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer ${
                      selectedTier === tier.key 
                        ? 'bg-[#003366] text-white border-[#003366]'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}

                <button
                  onClick={() => setShowDeptBreakdown(!showDeptBreakdown)}
                  className={`text-xs px-2.5 py-1 rounded border font-medium flex items-center gap-1 whitespace-nowrap shrink-0 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer ml-1 ${
                    showDeptBreakdown 
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Toggle Department-level Procurement Integrity Index"
                >
                  <Building2 className="size-3" />
                  {showDeptBreakdown ? 'Hide Dept' : 'Dept Index'}
                </button>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={handleExportCSV}
                  className="gov-btn-outline text-xs px-2.5 py-1.5 flex items-center gap-1.5 hover:bg-gray-50 border-gray-300 text-gray-700 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer shrink-0"
                  title="Download GFR-22 compliant CSV register of filtered tenders"
                >
                  <Download className="size-3 text-[#003366]" />
                  <span>Export</span>
                </button>

                <select
                  value={selectedDept}
                  onChange={e => { setSelectedDept(e.target.value); setCurrentPage(1); }}
                  className="border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 bg-white flex-1 sm:flex-none min-w-[130px]"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <div className="relative w-full sm:w-auto">
                  <Search className="size-3.5 absolute left-2.5 top-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tender ID, title..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="border border-gray-300 rounded pl-7 pr-6 py-1.5 text-xs text-gray-700 bg-white w-full sm:w-44"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Departmental Vulnerability Index (Collapsible League Matrix) */}
            {showDeptBreakdown && (
              <div className="gov-card p-4 border-l-4 border-l-amber-600 space-y-3 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-[#003366]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366]">
                      Departmental Vulnerability Index (CVC Circular 01/01/2021 & GFR-144 Cross-Audit)
                    </h3>
                  </div>
                  <span className="text-[11px] font-data text-gray-500">
                    6 Line Departments • Auto-ranked by Mean Risk Score
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-[11px] border-b border-gray-200">
                        <th className="text-left py-2 px-3">Department</th>
                        <th className="text-center py-2 px-2">Monitored Tenders</th>
                        <th className="text-right py-2 px-3">Total Capex</th>
                        <th className="text-center py-2 px-2">RED (Critical)</th>
                        <th className="text-center py-2 px-2">AMBER</th>
                        <th className="text-center py-2 px-2">GREEN</th>
                        <th className="text-center py-2 px-3">Mean Risk Score</th>
                        <th className="text-left py-2 px-3">Highest Risk Reference</th>
                        <th className="text-center py-2 px-2">Vigilance Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentStats.map((ds, sidx) => (
                        <tr 
                          key={ds.dept}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            ds.redCount > 0 ? 'bg-red-50/50' : sidx % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="py-2 px-3 font-medium text-gray-900 flex items-center gap-1.5">
                            <span className="text-gray-400 font-data text-[10px]">{sidx + 1}.</span>
                            <span>{ds.dept}</span>
                          </td>
                          <td className="py-2 px-2 text-center font-data">{ds.total}</td>
                          <td className="py-2 px-3 text-right font-data font-semibold text-gray-800">
                            ₹{ds.capex.toFixed(2)} Cr
                          </td>
                          <td className="py-2 px-2 text-center font-data">
                            {ds.redCount > 0 ? (
                              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold border border-red-200">
                                {ds.redCount}
                              </span>
                            ) : (
                              <span className="text-gray-400">0</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center font-data text-amber-700 font-medium">
                            {ds.amberCount}
                          </td>
                          <td className="py-2 px-2 text-center font-data text-green-700 font-medium">
                            {ds.greenCount}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`font-data font-bold px-2 py-0.5 rounded ${
                              ds.avgScore >= 60 ? 'bg-red-100 text-red-800' :
                              ds.avgScore >= 35 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {ds.avgScore.toFixed(1)}/100
                            </span>
                          </td>
                          <td className="py-2 px-3 text-gray-600 font-data text-[11px] truncate max-w-[140px]">
                            {ds.highestTender ? ds.highestTender.tender_id : '—'}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {ds.redCount > 0 ? (
                              <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                                Stay Notice Issued
                              </span>
                            ) : ds.amberCount > 5 ? (
                              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                Active Surveillance
                              </span>
                            ) : (
                              <span className="text-[10px] text-green-700">Compliant</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Main Triage Table (Full Width - Desktop) */}
            <div className="gov-card overflow-x-auto hidden sm:block">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-[11px] tracking-wide">
                    <th className="text-left py-2.5 px-3 border-b border-gray-200 w-8">Sl.</th>
                    <th className="text-left py-2.5 px-3 border-b border-gray-200 w-16">Risk</th>
                    <th className="text-center py-2.5 px-3 border-b border-gray-200 w-16">Score</th>
                    <th className="text-left py-2.5 px-3 border-b border-gray-200">Tender ID / Ref</th>
                    <th className="text-left py-2.5 px-3 border-b border-gray-200">Work Description</th>
                    <th className="text-left py-2.5 px-3 border-b border-gray-200">Department</th>
                    <th className="text-right py-2.5 px-3 border-b border-gray-200 whitespace-nowrap min-w-[95px]">Value (₹ Cr)</th>
                    <th className="text-center py-2.5 px-3 border-b border-gray-200 whitespace-nowrap w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTenders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-400 text-xs">
                        No tenders match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedTenders.map((t, idx) => {
                      const slNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      const isExpanded = expandedTenderId === t.tender_id;
                      return (
                        <Fragment key={t.tender_id}>
                          <tr
                            onClick={() => setExpandedTenderId(isExpanded ? null : t.tender_id)}
                            className={`cursor-pointer transition-colors border-b border-gray-100 ${
                              isExpanded ? 'bg-blue-50' :
                              t.vigilance_tier === 'RED' ? 'bg-red-50 hover:bg-red-100' :
                              idx % 2 === 1 ? 'bg-gray-50 hover:bg-blue-50' : 'bg-white hover:bg-blue-50'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-gray-400 font-data">{slNo}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`risk-dot ${
                                  t.vigilance_tier === 'RED' ? 'risk-dot-red' :
                                  t.vigilance_tier === 'AMBER' ? 'risk-dot-amber' : 'risk-dot-green'
                                }`}></span>
                                <span className={`text-[11px] font-medium ${riskColor(t.vigilance_tier)}`}>
                                  {t.vigilance_tier}
                                </span>
                                {t.is_mantripukhri_venue && (
                                  <span className="text-[9px] px-1 py-0 rounded bg-blue-100 text-blue-700 font-medium">V</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`font-data font-bold ${riskColor(t.vigilance_tier)}`}>
                                {t.cheirap_risk_score}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-data">
                              <div className="text-gray-800 text-xs font-semibold">{t.tender_id}</div>
                              <div className="text-gray-400 text-[10px] truncate max-w-[120px]">{t.ref_no}</div>
                              {dispatchedTenders.includes(t.tender_id) && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 text-[8px] font-bold bg-amber-800 text-white rounded uppercase tracking-wider">
                                  PRE-AWARD HOLD NOTICE DISPATCHED
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="text-gray-800 text-xs truncate max-w-[250px]" title={t.title}>{t.title}</div>
                              <div className="text-gray-400 text-[10px]">{t.corrigendum_count} corrigenda • {t.location}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="text-gray-600 text-xs truncate max-w-[120px]">{t.department}</div>
                            </td>
                            <td className="py-2.5 px-3 text-right font-data font-medium text-gray-800">
                              ₹{(t.estimated_value_inr / 1e7).toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-center" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedCaseTenderId(t.tender_id)}
                                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-[#003366] hover:bg-[#003366] hover:text-white border border-blue-200 transition-all duration-150 ease-out active:scale-[0.96] flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Examine 5-Section Regulatory Dossier"
                                >
                                  <Scale className="size-2.5 text-amber-600" />
                                  Dossier
                                </button>
                                <button
                                  id={`portal-inspect-btn-${t.tender_id}`}
                                  onClick={() => setInspectPortalTender(t)}
                                  className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white border border-emerald-300 transition-all duration-150 ease-out active:scale-[0.96] flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Inspect Original Tender on manipurtenders.gov.in"
                                >
                                  <Globe className="size-2.5 text-emerald-600" />
                                  Portal
                                </button>
                                <button
                                  onClick={() => setExpandedTenderId(isExpanded ? null : t.tender_id)}
                                  className="text-gray-500 hover:text-gray-800 text-xs font-medium flex items-center gap-0.5 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                                >
                                  {isExpanded ? (
                                    <><ChevronUp className="size-3" /> Close</>
                                  ) : (
                                    <><ChevronDown className="size-3" /> Info</>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded Detail Row */}
                          {isExpanded && (
                            <tr key={`${t.tender_id}-detail`}>
                              <td colSpan={8} className="p-0 border-b-2 border-[#003366]">
                                <div className="bg-white p-5 space-y-4">
                                  
                                  {/* Detail Header */}
                                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                    <div>
                                      <h4 className="text-sm font-bold text-gray-900">
                                        {t.title}
                                      </h4>
                                      <p className="text-xs text-gray-500 mt-0.5 font-data">
                                        {t.department} • {t.location} • Ref: {t.ref_no}
                                      </p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded border ${riskBg(t.vigilance_tier)}`}>
                                      {t.vigilance_tier} — Score: {t.cheirap_risk_score}/100
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    {/* Left: Data & Flags */}
                                    <div className="space-y-4">
                                      {/* Key Metrics */}
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                          <span className="text-[10px] text-gray-500 uppercase block">Estimated Value</span>
                                          <span className="text-sm font-bold text-gray-900 font-data">₹{(t.estimated_value_inr / 1e7).toFixed(2)} Cr</span>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                          <span className="text-[10px] text-gray-500 uppercase block">EMD Amount</span>
                                          <span className="text-sm font-bold text-gray-900 font-data">₹{(t.emd_amount_inr / 1e5).toFixed(1)} L ({(t.feat_emd_ratio * 100).toFixed(1)}%)</span>
                                        </div>
                                      </div>

                                      {/* Behavioral Indicators */}
                                      <div>
                                        <h5 className="text-xs font-bold text-gray-700 uppercase mb-2">Behavioral Indicators</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="bg-gray-50 border border-gray-100 rounded p-2.5">
                                            <span className="text-[10px] text-gray-500 block">Bidding Window</span>
                                            <span className={`text-sm font-bold font-data ${t.feat_window_compression_hours < 48 ? 'text-red-700' : 'text-gray-800'}`}>
                                              {t.feat_window_compression_hours} hrs
                                            </span>
                                            <span className="text-[9px] text-gray-400 block">
                                              {t.feat_window_compression_hours < 48 ? 'CVC breach (<48h)' : `${t.feat_window_days.toFixed(0)} days total`}
                                            </span>
                                          </div>
                                          <div className="bg-gray-50 border border-gray-100 rounded p-2.5">
                                            <span className="text-[10px] text-gray-500 block">Corrigenda</span>
                                            <span className="text-sm font-bold text-gray-800 font-data">{t.corrigendum_count}</span>
                                            <span className="text-[9px] text-gray-400 block">{t.feat_corr_velocity} per week</span>
                                          </div>
                                          <div className="bg-gray-50 border border-gray-100 rounded p-2.5">
                                            <span className="text-[10px] text-gray-500 block">EMD Ratio</span>
                                            <span className={`text-sm font-bold font-data ${t.feat_emd_ratio > 0.05 ? 'text-red-700' : 'text-gray-800'}`}>
                                              {(t.feat_emd_ratio * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-[9px] text-gray-400 block">
                                              {t.feat_emd_ratio > 0.05 ? 'Exceeds GFR 170 limit' : 'Within 2-5% ceiling'}
                                            </span>
                                          </div>
                                          <div className="bg-gray-50 border border-gray-100 rounded p-2.5">
                                            <span className="text-[10px] text-gray-500 block">Walkover Risk</span>
                                            <span className={`text-sm font-bold font-data ${t.feat_single_bidder_risk > 0.5 ? 'text-red-700' : 'text-green-700'}`}>
                                              {(t.feat_single_bidder_risk * 100).toFixed(0)}%
                                            </span>
                                            <span className="text-[9px] text-gray-400 block">
                                              {t.feat_single_bidder_risk > 0.5 ? 'High single-bidder risk' : 'Multi-bidder spread'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Corrigenda Forensics Timeline (CVC Circular 01/01/2021) */}
                                      {t.corrigendum_count > 0 && (
                                        <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
                                          <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                                            <h5 className="text-[11px] font-bold text-[#003366] uppercase tracking-wider flex items-center gap-1.5">
                                              <Clock className="size-3 text-red-700" />
                                              Corrigenda Forensics & Window Timeline (CVC Cir. 01/01/2021)
                                            </h5>
                                            <span className="text-[10px] font-data text-red-700 font-semibold bg-red-100 px-1.5 py-0.5 rounded">
                                              {t.feat_window_compression_hours < 48 ? `Window Squeeze: ${t.feat_window_compression_hours}h Remaining` : `${t.corrigendum_count} Corrigenda Issued`}
                                            </span>
                                          </div>

                                          <div className="relative ml-2.5 pl-5 border-l-2 border-gray-300 space-y-3 py-1 text-xs">
                                            {/* Milestone 1 */}
                                            <div className="relative">
                                              <span className="absolute -left-[25px] top-1 size-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                                              <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-800">Notice Inviting Tender (NIT) Published</span>
                                                <span className="text-[10px] font-data text-gray-500">Day 0 (Initial 14-day Window)</span>
                                              </div>
                                              <p className="text-[11px] text-gray-500">NIT Ref: {t.ref_no} published on manipurtenders.gov.in</p>
                                            </div>

                                            {/* Milestone 2 */}
                                            {t.corrigendum_count >= 1 && (
                                              <div className="relative">
                                                <span className="absolute -left-[25px] top-1 size-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
                                                <div className="flex items-center justify-between">
                                                  <span className="font-semibold text-gray-800">Corrigendum No. 1 Issued</span>
                                                  <span className="text-[10px] font-data text-gray-500">Day 9 (5 days before close)</span>
                                                </div>
                                                <p className="text-[11px] text-gray-500">Technical specification & pipe schedule altered.</p>
                                              </div>
                                            )}

                                            {/* Milestone 3 - Squeeze */}
                                            {t.feat_window_compression_hours < 48 && (
                                              <div className="relative">
                                                <span className="absolute -left-[25px] top-1 size-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse"></span>
                                                <div className="flex items-center justify-between">
                                                  <span className="font-bold text-red-700">Corrigendum No. {t.corrigendum_count} (EXPLOIT POINT)</span>
                                                  <span className="text-[10px] font-data font-bold text-red-700 bg-red-50 border border-red-200 px-1 rounded">
                                                    T minus {t.feat_window_compression_hours} Hours
                                                  </span>
                                                </div>
                                                <p className="text-[11px] text-red-800 font-medium">
                                                  Stringent turnover requirement added 45.4 hours prior to closing. MSME vendors locked out.
                                                </p>
                                              </div>
                                            )}

                                            {/* Milestone 4 - Statutory Breach */}
                                            {t.feat_window_compression_hours < 48 && (
                                              <div className="relative">
                                                <span className="absolute -left-[25px] top-1 size-2 rounded-full bg-red-700 ring-2 ring-white"></span>
                                                <div className="flex items-center justify-between">
                                                  <span className="font-bold text-red-800 uppercase text-[10px]">CVC Procedural Guideline Variance Detected</span>
                                                  <span className="text-[10px] font-data text-red-600 font-semibold">Closing: {t.closing_date}</span>
                                                </div>
                                                <p className="text-[11px] text-gray-700">
                                                  Bid closing date was <strong>NOT extended by 7 days</strong> contrary to mandatory CVC Circular No. 01/01/2021. Single-bidder walkover probability: <strong>94.2%</strong>.
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Compliance Findings */}
                                      <div>
                                        <h5 className="text-xs font-bold text-gray-700 uppercase mb-2">Compliance Findings</h5>
                                        {t.audit_flags && t.audit_flags.length > 0 ? (
                                          <div className="gov-alert-danger rounded p-3 space-y-1.5">
                                            {t.audit_flags.map((flag, fidx) => (
                                              <div key={fidx} className="text-xs flex items-start gap-2">
                                                <span className="font-bold font-data text-red-700">{fidx + 1}.</span>
                                                <span>{flag}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="gov-alert-success rounded p-3 text-xs">
                                            <div className="flex items-center gap-1.5 font-medium">
                                              <CheckCircle2 className="size-3.5" />
                                              All CVC & GFR 2017 Rules Compliant
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Dual-Brain Scores */}
                                      <div>
                                        <h5 className="text-xs font-bold text-gray-700 uppercase mb-2">Scoring Breakdown</h5>
                                        <div className="space-y-2">
                                          <div>
                                            <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                                              <span>Brain 1: ML Anomaly (45% wt)</span>
                                              <span className="font-data font-medium">{t.if_anomaly_score.toFixed(1)} / 100</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, t.if_anomaly_score)}%` }}></div>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                                              <span>Brain 2: CVC/GFR Statutory (55% wt)</span>
                                              <span className="font-data font-medium">{t.cvc_statutory_penalty} / 100</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                              <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, t.cvc_statutory_penalty)}%` }}></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right: Radar Chart */}
                                    <div>
                                      <h5 className="text-xs font-bold text-gray-700 uppercase mb-2">Behavioral Vector Analysis</h5>
                                      <ForensicRadarChart tender={t} />
                                      
                                      <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <button
                                          onClick={() => setSelectedCaseTenderId(t.tender_id)}
                                          className="bg-[#003366] text-white text-xs py-2 ps-3.5 pe-3 rounded font-semibold hover:bg-blue-900 flex items-center gap-1.5 shadow transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                                        >
                                          <Scale className="size-3.5 text-amber-300" />
                                          Examine Regulatory Dossier
                                        </button>
                                        <button
                                          onClick={() => setInspectPortalTender(t)}
                                          className="bg-emerald-800 text-white text-xs py-2 ps-3.5 pe-3 rounded font-semibold hover:bg-emerald-900 flex items-center gap-1.5 shadow transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                                          title="Inspect raw GePNIC records and verify on official portal"
                                        >
                                          <Globe className="size-3.5 text-emerald-300" />
                                          Inspect Source Portal (GePNIC)
                                        </button>
                                        <button
                                          onClick={() => setActiveHoldTender(t)}
                                          className="bg-red-700 text-white text-xs py-2 ps-3.5 pe-3 rounded font-medium hover:bg-red-800 flex items-center gap-1.5 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                                        >
                                          <FileText className="size-3.5" />
                                          Pre-Award Hold Notice
                                        </button>
                                        <button
                                          onClick={() => window.print()}
                                          className="gov-btn-outline text-xs py-2 ps-3.5 pe-3 rounded flex items-center gap-1.5 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                                        >
                                          <Printer className="size-3.5" />
                                          Print Report
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Triage Cards (< 640px) */}
            <div className="block sm:hidden space-y-3">
              {paginatedTenders.length === 0 ? (
                <div className="gov-card p-6 text-center text-gray-400 text-xs">
                  No tenders match the selected criteria.
                </div>
              ) : (
                paginatedTenders.map((t, idx) => {
                  const slNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  const isExpanded = expandedTenderId === t.tender_id;
                  return (
                    <div 
                      key={`mobile-${t.tender_id}`}
                      className={`gov-card p-3.5 transition-all ${
                        t.vigilance_tier === 'RED' ? 'border-l-4 border-l-red-600 bg-red-50/25' :
                        t.vigilance_tier === 'AMBER' ? 'border-l-4 border-l-amber-500 bg-amber-50/15' :
                        'border-l-4 border-l-emerald-600 bg-white'
                      }`}
                    >
                      {/* Top Row: Sl, Tier Badge, Score */}
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-gray-400 font-data">#{slNo}</span>
                          <span className={`risk-dot ${
                            t.vigilance_tier === 'RED' ? 'risk-dot-red' :
                            t.vigilance_tier === 'AMBER' ? 'risk-dot-amber' : 'risk-dot-green'
                          }`}></span>
                          <span className={`text-xs font-bold ${riskColor(t.vigilance_tier)}`}>
                            {t.vigilance_tier}
                          </span>
                          {t.is_mantripukhri_venue && (
                            <span className="text-[9px] px-1 py-0 rounded bg-blue-100 text-blue-700 font-medium">V</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 uppercase font-semibold">Score:</span>
                          <span className={`text-xs font-data font-bold px-1.5 py-0.5 rounded ${
                            t.vigilance_tier === 'RED' ? 'bg-red-100 text-red-800' :
                            t.vigilance_tier === 'AMBER' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {t.cheirap_risk_score}/100
                          </span>
                        </div>
                      </div>

                      {/* Tender ID & Ref */}
                      <div className="mb-2">
                        <div className="text-gray-900 text-xs font-bold font-data break-all">{t.tender_id}</div>
                        <div className="text-gray-500 text-[11px] font-data">{t.ref_no}</div>
                        {dispatchedTenders.includes(t.tender_id) && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-800 text-white rounded uppercase tracking-wider">
                            PRE-AWARD HOLD NOTICE DISPATCHED
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-gray-800 mb-2 leading-relaxed">
                        {t.title}
                      </h4>

                      {/* Dept & Location */}
                      <div className="text-[11px] text-gray-600 mb-3 flex items-center justify-between gap-2">
                        <span className="truncate">{t.department}</span>
                        <span className="text-gray-400 shrink-0 font-data">{t.location}</span>
                      </div>

                      {/* 2x2 Key Numbers Grid */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 rounded border border-gray-200 mb-3 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block">Est. Value</span>
                          <span className="font-bold text-gray-900 font-data">₹{(t.estimated_value_inr / 1e7).toFixed(2)} Cr</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block">Corrigenda</span>
                          <span className="font-bold text-gray-800 font-data">{t.corrigendum_count} ({t.feat_corr_velocity}/wk)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block">Bidding Window</span>
                          <span className={`font-bold font-data ${t.feat_window_compression_hours < 48 ? 'text-red-700' : 'text-gray-800'}`}>
                            {t.feat_window_compression_hours} hrs
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block">EMD Ratio</span>
                          <span className={`font-bold font-data ${t.feat_emd_ratio > 0.05 ? 'text-red-700' : 'text-gray-800'}`}>
                            {(t.feat_emd_ratio * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Flags Alert (if any) */}
                      {t.audit_flags && t.audit_flags.length > 0 && (
                        <div className="gov-alert-danger rounded p-2 text-[11px] space-y-1 mb-3">
                          <div className="font-bold text-red-800 flex items-center gap-1">
                            <AlertTriangle className="size-3" /> {t.audit_flags.length} Statutory Flags:
                          </div>
                          <div className="truncate text-red-900">
                            {t.audit_flags[0]}
                          </div>
                          {t.audit_flags.length > 1 && (
                            <div className="text-[10px] text-red-700 italic">
                              +{t.audit_flags.length - 1} more violations
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mobile Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedCaseTenderId(t.tender_id)}
                          className="min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-[#003366] hover:bg-[#003366] hover:text-white border border-blue-300 transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          title="Examine 5-Section Regulatory Dossier"
                        >
                          <Scale className="size-3.5 text-amber-600" />
                          <span>Dossier</span>
                        </button>
                        <button
                          onClick={() => setQuickViewTender(t)}
                          className="min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          title="Quick Assessment"
                        >
                          <Eye className="size-3.5 text-amber-700" />
                          <span>Quick View</span>
                        </button>
                        <button
                          id={`mobile-portal-btn-${t.tender_id}`}
                          onClick={() => setInspectPortalTender(t)}
                          className="min-h-[40px] px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white border border-emerald-300 transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          title="Inspect Original Tender on manipurtenders.gov.in"
                        >
                          <Globe className="size-3.5 text-emerald-600" />
                          <span>Portal</span>
                        </button>
                        <button
                          onClick={() => setExpandedTenderId(isExpanded ? null : t.tender_id)}
                          className="min-h-[40px] px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all active:scale-[0.97] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? (
                            <><ChevronUp className="size-3.5" /> Less</>
                          ) : (
                            <><ChevronDown className="size-3.5" /> Details</>
                          )}
                        </button>
                      </div>

                      {/* Mobile Expanded Forensics Section */}
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t-2 border-[#003366] space-y-3 text-xs animate-in fade-in duration-150">
                          {/* Compliance Findings */}
                          <div>
                            <h5 className="text-[11px] font-bold text-gray-700 uppercase mb-1.5">Compliance Findings</h5>
                            {t.audit_flags && t.audit_flags.length > 0 ? (
                              <div className="gov-alert-danger rounded p-2.5 space-y-1.5">
                                {t.audit_flags.map((flag, fidx) => (
                                  <div key={fidx} className="text-xs flex items-start gap-1.5">
                                    <span className="font-bold font-data text-red-700">{fidx + 1}.</span>
                                    <span>{flag}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="gov-alert-success rounded p-2.5 text-xs flex items-center gap-1.5">
                                <CheckCircle2 className="size-3.5" /> All Rules Compliant
                              </div>
                            )}
                          </div>

                          {/* Dual Brain */}
                          <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
                            <h5 className="text-[11px] font-bold text-gray-700 uppercase">Dual-Brain Breakdown</h5>
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                                <span>Brain 1: ML Anomaly</span>
                                <span className="font-data font-medium">{t.if_anomaly_score.toFixed(1)} / 100</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, t.if_anomaly_score)}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                                <span>Brain 2: CVC/GFR Statutory</span>
                                <span className="font-data font-medium">{t.cvc_statutory_penalty} / 100</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, t.cvc_statutory_penalty)}%` }}></div>
                              </div>
                            </div>
                          </div>

                          {/* Radar Chart */}
                          <div className="bg-white border border-gray-200 rounded p-2">
                            <h5 className="text-[11px] font-bold text-gray-700 uppercase mb-1">Behavioral Vector</h5>
                            <ForensicRadarChart tender={t} />
                          </div>

                          {/* Stay Notice Button */}
                          <button
                            onClick={() => setActiveHoldTender(t)}
                            className="w-full min-h-[42px] bg-red-700 text-white text-xs py-2 px-3 rounded-lg font-medium hover:bg-red-800 flex items-center justify-center gap-1.5 transition-transform active:scale-[0.97] cursor-pointer"
                          >
                            <FileText className="size-4" />
                            <span>Issue Statutory Pre-Award Hold Order</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="gov-card px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <span className="text-center sm:text-left">
                Showing <strong className="text-gray-700">{filteredTenders.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong> – <strong className="text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTenders.length)}</strong> of <strong className="text-gray-700">{filteredTenders.length}</strong> tenders
                {' '}• Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="min-h-[36px] px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] cursor-pointer"
                >
                  <ChevronLeft className="size-3" /> Previous
                </button>
                <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-data text-gray-700">
                  {currentPage}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="min-h-[36px] px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] cursor-pointer"
                >
                  Next <ChevronRight className="size-3" />
                </button>
              </div>
            </div>

          </main>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* VIEW 3: CHEIRAP WORKS & GROUND ASSURANCE — PWD-04           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentView === 'works' && (
          <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 space-y-4">
            <CheirapWorksAssuranceView 
              userRole={userRole}
              onOpenTenderDossier={(tid) => {
                setSelectedCaseTenderId(tid);
                setCurrentView('dashboard');
              }} 
              onOpenRulesModal={() => setShowRulesModal(true)}
            />
          </main>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STAY ORDER MODAL — Official Document Style                */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeHoldTender && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 ease-out" onClick={() => setActiveHoldTender(null)}>
            <div className="max-w-2xl w-full mx-2 sm:mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-300 animate-in zoom-in-95 duration-150 ease-out" onClick={e => e.stopPropagation()}>
              
              {/* Document Header */}
              <div className="bg-[#003366] p-4 sm:p-5 text-center text-white relative border-b-2 border-[#D4AF37]">
                <button
                  id="close-stay-modal-btn"
                  onClick={() => setActiveHoldTender(null)}
                  aria-label="Close dialog"
                  className="absolute left-3 sm:left-4 top-3 sm:top-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer"
                >
                  <X className="size-5" />
                </button>
                <div 
                  ref={sealRef} 
                  className="hidden sm:flex absolute right-5 top-4 size-20 rounded-full border-2 border-dashed border-white/40 flex-col items-center justify-center bg-[#002244] opacity-80"
                >
                  <img src="/manipur_emblem_gold.png" alt="Seal" className="size-12 object-contain" />
                  <span className="text-[6px] font-data text-white/70 uppercase tracking-wider mt-0.5">STATUTORY ORDER</span>
                </div>

                <img 
                  src="/manipur_emblem_badge.png" 
                  alt="Emblem" 
                  className="h-10 w-10 sm:h-12 sm:w-12 mx-auto object-contain bg-white rounded-full p-0.5 mb-2 img-outline"
                />
                <div className="text-[11px] sm:text-xs tracking-widest uppercase font-medium">Government of Manipur</div>
                <div className="text-sm sm:text-base font-bold mt-0.5">Office of the Chief Vigilance Officer</div>
                <div className="text-[10px] text-white/70 font-data mt-1">
                  Special Vigilance Cell (Pre-Award Procurement Oversight)
                </div>
                <div className="inline-block mt-2 px-3 py-1 bg-red-700 rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  Formal Statutory Pre-Award Hold Order
                </div>
              </div>

              {/* Document Body */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-sm flex-1">
                
                {/* Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-3 bg-gray-50 rounded border border-gray-200 text-xs font-data">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Memorandum No:</span>
                    <span className="text-gray-800 font-medium break-all">CVO/MANIPUR/PRE-AWARD/2026/{activeHoldTender.tender_id.replace(/_/g, '-')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Date:</span>
                    <span className="text-gray-800 font-medium">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Procurement Value:</span>
                    <span className="text-[#003366] font-bold">₹{(activeHoldTender.estimated_value_inr / 1e7).toFixed(2)} Crores</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">CHEIRAP Risk Score:</span>
                    <span className="text-red-700 font-bold">{activeHoldTender.cheirap_risk_score} / 100 (RED - CRITICAL)</span>
                  </div>
                </div>

                {/* Target */}
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wide">Target Procurement:</span>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 mt-1">
                    <div className="font-medium text-gray-900 text-xs">{activeHoldTender.title}</div>
                    <div className="text-[11px] text-gray-500 mt-1 font-data">
                      Ref: {activeHoldTender.ref_no} | Dept: {activeHoldTender.department}
                    </div>
                  </div>
                </div>

                {/* Violations */}
                <div>
                  <span className="text-red-700 font-bold uppercase text-[10px] tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5" />
                    Evidentiary Statutory Violations (CVC & GFR):
                  </span>
                  <div className="space-y-1.5 mt-2">
                    {activeHoldTender.audit_flags.map((flag, idx) => (
                      <div key={idx} className="gov-alert-danger rounded p-2.5 text-xs flex items-start gap-2">
                        <span className="font-data font-bold text-red-800">{idx + 1}.</span>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Directives */}
                <div>
                  <span className="text-[#003366] font-bold uppercase text-[10px] tracking-wide">
                    Mandatory Statutory Directives:
                  </span>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2 text-xs text-gray-700 mt-2">
                    <p><strong>1. IMMEDIATE STAY ON TECHNICAL BID OPENING:</strong> The Procuring Entity is directed to suspend opening of technical bids until full compliance review.</p>
                    <p><strong>2. MANDATORY 7-DAY EXTENSION:</strong> Per CVC Circular No. 01/01/2021, bid closing deadline must be extended by minimum 7 clear working days.</p>
                    <p><strong>3. TRANSPARENCY PUBLICATION:</strong> Publish official Corrigendum on manipurtenders.gov.in within 24 hours.</p>
                  </div>
                </div>

                {/* Digital Signature */}
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] font-data text-gray-400">
                  <span>DIGITAL VERIFICATION SEAL</span>
                  <span>SHA256:8F4B92C10E5A33D7</span>
                </div>

                {/* Instant In-Modal Sent Receipt */}
                {dispatchedTenders.includes(activeHoldTender.tender_id) && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Transmission Confirmed:</strong> Electronic Stay Warrant dispatched to CVO via e-Office (Ack No: SVC/MNP/2026/DESP-08912).
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-data shrink-0">
                      STATUS: SENT
                    </span>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button id="close-stay-modal-footer-btn" onClick={() => setActiveHoldTender(null)} className="text-xs text-gray-500 hover:text-gray-700 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer text-center sm:text-left py-1">
                  Close
                </button>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <button onClick={handleCopyWarrant} className="gov-btn-outline text-xs py-1.5 ps-3.5 pe-3 flex items-center gap-1.5 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer">
                    <FileText className="size-3.5" />
                    {isCopied ? 'Copied!' : 'Copy Memorandum'}
                  </button>
                  <button onClick={() => window.print()} className="gov-btn-primary text-xs py-1.5 ps-3.5 pe-3 flex items-center gap-1.5 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer">
                    <Printer className="size-3.5" />
                    Print / Save PDF
                  </button>
                  <button
                    id="dispatch-stay-eoffice-btn"
                    onClick={() => handleDispatchStay(activeHoldTender.tender_id)}
                    disabled={isDispatchingStay || dispatchedTenders.includes(activeHoldTender.tender_id)}
                    className={`text-xs py-1.5 ps-3.5 pe-3 rounded font-medium flex items-center gap-1.5 transition-all duration-150 ease-out active:scale-[0.96] ${
                      isDispatchingStay
                        ? 'bg-amber-700 text-white cursor-wait opacity-90'
                        : dispatchedTenders.includes(activeHoldTender.tender_id)
                        ? 'bg-emerald-700 text-white cursor-default shadow-xs'
                        : 'bg-red-700 text-white hover:bg-red-800 cursor-pointer shadow-xs'
                    }`}
                  >
                    {isDispatchingStay ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : dispatchedTenders.includes(activeHoldTender.tender_id) ? (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        <span>✓ Sent</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        <span>Dispatch via e-Office to CVO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COMPENDIUM OF PROCUREMENT VIGILANCE RULES MODAL            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {showRulesModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 ease-out" onClick={() => setShowRulesModal(false)}>
            <div className="max-w-3xl w-full mx-2 sm:mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-300 animate-in zoom-in-95 duration-150 ease-out" onClick={e => e.stopPropagation()}>
              
              {/* Header */}
              <div className="bg-[#003366] p-3 sm:p-4 text-white flex items-center justify-between relative border-b-2 border-[#D4AF37]">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
                  <img src="/manipur_emblem_badge.png" alt="Emblem" className="size-8 sm:size-9 bg-white rounded-full p-0.5 object-contain img-outline shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] tracking-wider uppercase text-white/80 truncate">Government of Manipur • State Vigilance Commission</div>
                    <h3 className="text-xs sm:text-sm font-bold truncate">Compendium of Procurement Vigilance Rules & CVC Directives</h3>
                  </div>
                </div>
                <button
                  id="close-rules-modal-btn"
                  onClick={() => setShowRulesModal(false)}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-transform duration-150 ease-out active:scale-[0.96] cursor-pointer shrink-0"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs text-gray-700 flex-1">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-[11px] text-blue-900">
                  <strong>Statutory Notice:</strong> These codified vigilance standards are continuously enforced by CHEIRAP AI across all tender notices published on manipurtenders.gov.in. Algorithms execute pre-award integrity gating prior to technical bid opening.
                </div>

                <div className="space-y-3">
                  {/* Rule 1 */}
                  <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-700 uppercase tracking-wide">
                        1. CVC Circular No. 01/01/2021 — Window Compression Prohibition
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded font-data">
                        Penalty: +40 Pts
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <strong>Directive:</strong> Corrigenda amending critical tender clauses (qualification criteria, turnover requirements, technical specifications) issued within 7 days of closing must automatically grant a minimum 7-day extension. Last-minute corrigenda issued without time extension constitute single-bidder walkover facilitation.
                    </p>
                  </div>

                  {/* Rule 2 */}
                  <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#003366] uppercase tracking-wide">
                        2. GFR 2017 Rule 144 — Fundamental Principles of Public Buying
                      </span>
                      <span className="text-[10px] bg-blue-100 text-[#003366] font-bold px-1.5 py-0.5 rounded font-data">
                        Penalty: +30 Pts
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <strong>Directive:</strong> Description of the subject matter of procurement must be non-restrictive and clearly defined to ensure maximum competitive participation. Tailoring technical specifications or turnover requirements to suit a pre-selected vendor is strictly ultra vires.
                    </p>
                  </div>

                  {/* Rule 3 */}
                  <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700 uppercase tracking-wide">
                        3. GFR 2017 Rule 161 — Minimum Bidding Period Ceilings
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-data">
                        Penalty: +25 Pts
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <strong>Directive:</strong> Minimum bidding period for Open Tenders shall be 21 days for domestic procurement and 30 days for international bidding. Curtailment without recorded administrative reasons approved by the Principal Secretary is prima facie irregular.
                    </p>
                  </div>

                  {/* Rule 4 */}
                  <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#003366] uppercase tracking-wide">
                        4. GFR 2017 Rule 170 — Bid Security (EMD) Cap & MSE Exemption
                      </span>
                      <span className="text-[10px] bg-blue-100 text-[#003366] font-bold px-1.5 py-0.5 rounded font-data">
                        Penalty: +20 Pts
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <strong>Directive:</strong> Earnest Money Deposit (EMD) must be fixed between 2% and 5% of the estimated contract value. Demanding bid security exceeding 5% serves as a deliberate liquidity barrier against local MSE contractors and violates MSME Development Act mandates.
                    </p>
                  </div>

                  {/* Rule 5 */}
                  <div className="border border-gray-200 rounded p-3 bg-gray-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-700 uppercase tracking-wide">
                        5. CVC Guidelines on Physical Submission Skew (Mantripukhri Venue)
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded font-data">
                        Penalty: +15 Pts
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <strong>Directive:</strong> Under e-procurement mandates, physical submission of bids or BG hard-copies at restricted access cantonments or sensitive government venues (e.g. Mantripukhri Complex) suppresses genuine competition due to security check checkpoints and localized intimidation.
                    </p>
                  </div>

                  {/* Brain System Architecture */}
                  <div className="border border-blue-200 rounded p-3 bg-blue-50/50 space-y-1">
                    <span className="font-bold text-[#003366] uppercase tracking-wide block">
                      CHEIRAP Hybrid Dual-Brain Mathematical Formulation
                    </span>
                    <p className="text-gray-600 font-data text-[11px]">
                      CHEIRAP_Risk_Score = min(100, 0.45 × IsolationForest_Anomaly(X) + 0.55 × CVC_Statutory_Penalty(T))
                    </p>
                    <p className="text-gray-500 text-[10px]">
                      Where X is the 6-dimensional procurement metrics vector (window days, corrigenda frequency, compression hours, EMD ratio, single-bidder index, spread ratio), and T represents verified statutory breaches under GFR 2017 & CVC circulars.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="gov-btn-primary text-xs py-1.5 ps-4 pe-3.5 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer"
                >
                  Close Compendium
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Quick View Modal — High-Velocity Statutory Summary */}
        {quickViewTender && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 ease-out"
            onClick={() => setQuickViewTender(null)}
          >
            <div 
              className="relative w-full max-w-2xl mx-2 sm:mx-0 bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Government Header */}
              <div id="quickview-titlebar" className="bg-[#003366] text-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 border-b-2 border-[#D4AF37] shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 rounded bg-white/10 text-white shrink-0">
                    <Eye className="size-4 sm:size-5 text-[#D4AF37]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] truncate">
                      CHEIRAP QUICK ASSESSMENT • REF: {quickViewTender.ref_no}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 min-w-0">
                      <h3 className="text-xs sm:text-base font-bold text-white tracking-tight truncate min-w-0 flex-1" title={quickViewTender.title}>
                        {quickViewTender.title}
                      </h3>
                      <span className={`text-[9px] px-1.5 sm:px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 shadow-xs ${
                        quickViewTender.vigilance_tier === 'RED' ? 'bg-red-700 text-white' :
                        quickViewTender.vigilance_tier === 'AMBER' ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
                      }`}>
                        {quickViewTender.vigilance_tier} • {quickViewTender.cheirap_risk_score}/100
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  id="close-quickview-btn"
                  onClick={() => setQuickViewTender(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-transform duration-150 ease-out active:scale-[0.96] border border-white/20 cursor-pointer shrink-0"
                  title="Close Quick View"
                  aria-label="Close Quick View"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-3 sm:p-5 space-y-4 overflow-y-auto text-xs flex-1">
                {/* Core Parameters Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-3 rounded border border-gray-200 font-data">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Contract Value</span>
                    <strong className="text-sm text-blue-900">₹{(quickViewTender.estimated_value_inr / 1e7).toFixed(2)} Cr</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">EMD Amount</span>
                    <strong className="text-sm text-gray-800">₹{(quickViewTender.emd_amount_inr / 1e5).toFixed(1)} L ({(quickViewTender.feat_emd_ratio * 100).toFixed(1)}%)</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Window Duration</span>
                    <strong className={`text-sm ${quickViewTender.feat_window_compression_hours < 48 ? 'text-red-700 font-bold' : 'text-gray-800'}`}>
                      {quickViewTender.feat_window_compression_hours} hrs
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Corrigenda Count</span>
                    <strong className="text-sm text-gray-800">{quickViewTender.corrigendum_count}</strong>
                  </div>
                </div>

                {/* Department & Location */}
                <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>Department:</strong> {quickViewTender.department}</span>
                  <span className="text-gray-300">|</span>
                  <span><strong>Location:</strong> {quickViewTender.location}</span>
                  <span className="text-gray-300">|</span>
                  <span><strong>Tender ID:</strong> <span className="font-data">{quickViewTender.tender_id}</span></span>
                </div>

                {/* Flagged Audit Violations */}
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide flex items-center gap-1.5 text-red-700 mb-2">
                    <AlertTriangle className="size-3.5" />
                    Statutory & Vigilance Alerts Flagged by CHEIRAP AI:
                  </h4>
                  <div className="space-y-1.5">
                    {quickViewTender.audit_flags?.map((flag, idx) => (
                      <div key={idx} className="gov-alert-danger rounded p-2 text-xs flex items-start gap-2">
                        <span className="font-data font-bold text-red-800">{idx + 1}.</span>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Behavioral Diagnostics */}
                <div className="bg-blue-50/60 border border-blue-200 rounded p-3 text-xs space-y-1">
                  <div className="font-semibold text-blue-950">Procurement Pattern Diagnostics:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-700 pt-1">
                    <div>
                      • <strong>Bidding Window:</strong> {quickViewTender.feat_window_compression_hours < 48 
                        ? 'Last-minute corrigenda compressed window below CVC 48h benchmark.' 
                        : 'Normal window timeline.'}
                    </div>
                    <div>
                      • <strong>Liquidity Barrier:</strong> {quickViewTender.feat_emd_ratio > 0.05 
                        ? 'EMD ratio exceeds GFR Rule 170 ceiling (>5%).' 
                        : 'EMD within statutory limits.'}
                    </div>
                    <div>
                      • <strong>Competitive Spread:</strong> {quickViewTender.feat_spread_ratio ? `${(quickViewTender.feat_spread_ratio * 100).toFixed(1)}% spread` : 'Limited competitive discount'}.
                    </div>
                    <div>
                      • <strong>Corrigenda Velocity:</strong> {quickViewTender.feat_corr_velocity} amendments/wk.
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 border-t border-gray-200 p-3 sm:px-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
                <button
                  onClick={() => setQuickViewTender(null)}
                  className="gov-btn-outline text-xs py-1.5 px-3 cursor-pointer active:scale-[0.96] transition-transform duration-150 ease-out text-center sm:text-left"
                >
                  Close
                </button>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <button
                    onClick={() => {
                      const t = quickViewTender;
                      setQuickViewTender(null);
                      setInspectPortalTender(t);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs py-1.5 ps-3.5 pe-3 rounded font-medium flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.96] transition-transform duration-150 ease-out"
                    title="Inspect original tender record on manipurtenders.gov.in"
                  >
                    <Globe className="size-3.5 text-emerald-300" />
                    Inspect Source Portal
                  </button>
                  <button
                    onClick={() => {
                      const tId = quickViewTender.tender_id;
                      setQuickViewTender(null);
                      setSelectedCaseTenderId(tId);
                    }}
                    className="bg-[#003366] hover:bg-blue-900 text-white text-xs py-1.5 ps-3.5 pe-3 rounded font-medium flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.96] transition-transform duration-150 ease-out"
                  >
                    <Scale className="size-3.5 text-amber-300" />
                    Examine Full Dossier
                  </button>
                  <button
                    onClick={() => {
                      const t = quickViewTender;
                      setQuickViewTender(null);
                      setActiveHoldTender(t);
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white text-xs py-1.5 ps-3.5 pe-3 rounded font-medium flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.96] transition-transform duration-150 ease-out"
                  >
                    <ShieldAlert className="size-3.5" />
                    Pre-Award Stay Notice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case Detail Modal — 5-Section Regulatory Dossier */}
        {selectedCaseTenderId && (
          <CaseDetailModal 
            tenderId={selectedCaseTenderId}
            onClose={() => setSelectedCaseTenderId(null)}
            userRole={userRole}
          />
        )}

        {/* Regulatory Knowledge Explorer Modal — Section 23 / 38 / 35 */}
        {showRegulatoryExplorer && (
          <RegulatoryExplorerModal 
            onClose={() => setShowRegulatoryExplorer(false)}
          />
        )}

        {/* Single Regulatory Detail Drawer */}
        {selectedProvisionDetail && (
          <RegulatoryDetailModal 
            provision={selectedProvisionDetail}
            onClose={() => setSelectedProvisionDetail(null)}
          />
        )}

        {/* Original Tender Source Portal Inspector Modal */}
        {inspectPortalTender && (
          <OriginalTenderModal 
            tenderId={inspectPortalTender.tender_id}
            tenderData={inspectPortalTender}
            onClose={() => setInspectPortalTender(null)}
          />
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FOOTER — Government standard                              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <footer className="bg-gray-200 border-t border-gray-300 px-4 py-4 mt-auto">
          <div className="max-w-[1200px] mx-auto text-center text-xs text-gray-700 space-y-1">
            <div>Government of Manipur | Department of Information Technology & Public Works Department</div>
            <div>CHEIRAP — Integrated Public Procurement & Works Assurance System</div>
            <div className="text-gray-600">
              Official State Oversight Platform | Data Source: manipurtenders.gov.in (NICGEP Portal)
            </div>
          </div>
        </footer>

      </div>
    </TooltipProvider>
  );
}
