import React, { useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  Building
} from 'lucide-react';

export interface RegulatoryProvisionDetail {
  id: string;
  source_id: string;
  chapter?: string;
  section?: string;
  rule_number: string;
  paragraph_number?: string;
  clause_number?: string;
  title: string;
  provision_text: string;
  summary: string;
  regulatory_principle: string;
  applicability: string;
  effective_from: string;
  effective_to?: string | null;
  source_page?: string;
  official_reference: string;
  verification_status: 'VERIFIED' | 'PROVISIONALLY_MAPPED' | 'CONTEXTUAL' | 'NOT_APPLICABLE' | 'OUTDATED' | 'REQUIRES_VERIFICATION' | string;
  severity_if_violated: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  review_required: boolean;
  related_risk_codes?: string[];
  source_title?: string;
  source_short?: string;
  source_jurisdiction?: string;
  source_authority?: string;
  official_url?: string;
}

interface RegulatoryDetailModalProps {
  provision: RegulatoryProvisionDetail | null;
  onClose: () => void;
}

export const RegulatoryDetailModal: React.FC<RegulatoryDetailModalProps> = ({ provision, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    // Capture phase listener ensures this modal intercepts and consumes Escape first
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  if (!provision) return null;

  const isVerified = provision.verification_status === 'VERIFIED';
  const requiresVerification = provision.verification_status === 'REQUIRES_VERIFICATION';

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-black/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Government Header */}
        <div className="bg-[#003366] text-white px-5 py-4 flex items-center justify-between border-b-2 border-[#D4AF37] shrink-0">
          <div className="flex items-center gap-3 pr-3">
            <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
              <Scale className="size-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  {provision.source_jurisdiction || 'CENTRAL / STATE'} REGULATORY PROVISION
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isVerified ? 'bg-emerald-600 text-white' :
                  requiresVerification ? 'bg-amber-500 text-white' : 'bg-blue-800 text-white'
                }`}>
                  {isVerified ? (
                    <><CheckCircle2 className="size-2.5" /> VERIFIED CITATION</>
                  ) : requiresVerification ? (
                    <><AlertTriangle className="size-2.5" /> REQUIRES VERIFICATION</>
                  ) : (
                    <><HelpCircle className="size-2.5" /> {provision.verification_status}</>
                  )}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5 line-clamp-2">
                {provision.rule_number}: {provision.title}
              </h3>
            </div>
          </div>
          <button 
            id="close-regulatory-detail-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-all duration-150 ease-out active:scale-[0.96] border border-white/20 cursor-pointer shrink-0"
            title="Close Provision"
            aria-label="Close Provision"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Unverified Warning Banner if applicable */}
          {requiresVerification && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="size-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Statutory Verification Notice:</strong>
                <p className="mt-0.5">
                  This provision is marked as <em>REQUIRES VERIFICATION</em>. In strict compliance with CHEIRAP governance mandates, this citation has not been confirmed from a final published gazette order and must not be treated as a confirmed statutory violation.
                </p>
              </div>
            </div>
          )}

          {/* Source & Authority Metadata */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-200 rounded p-3 text-xs">
            <div>
              <span className="text-gray-500 text-[10px] uppercase font-bold block">Authoritative Source</span>
              <span className="font-semibold text-gray-900 block mt-0.5">
                {provision.source_title || provision.source_short || 'General Financial Rules, 2017'}
              </span>
              <span className="text-gray-500 text-[11px] block mt-0.5">
                {provision.source_authority || 'Ministry of Finance / Govt of Manipur'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] uppercase font-bold block">Official Citation</span>
              <span className="font-data font-bold text-blue-900 block mt-0.5">
                {provision.official_reference}
              </span>
              <span className="text-gray-500 text-[11px] block mt-0.5">
                {provision.source_page || 'Gazette Compilation'}
              </span>
            </div>
          </div>

          {/* Authoritative Provision Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-[#003366]" />
                Authoritative Provision Text
              </h4>
              <span className="text-[10px] text-gray-400 font-data">Effective: {provision.effective_from}</span>
            </div>
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded text-gray-800 font-serif leading-relaxed text-[13px] italic">
              "{provision.provision_text}"
            </div>
          </div>

          {/* Plain-Language Governance Interpretation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="size-3.5 text-emerald-700" />
              Governance Interpretation & Principle
            </h4>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-gray-700 text-xs leading-normal">
              <div className="mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Core Regulatory Principle:</span>
                <span className="ml-2 font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-800 text-[10px]">
                  {provision.regulatory_principle}
                </span>
              </div>
              <p>{provision.summary}</p>
            </div>
          </div>

          {/* Applicability & Enforcement Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Applicability Scope</span>
              <p className="text-gray-800 mt-1">{provision.applicability}</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Related CHEIRAP Risk Codes</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {provision.related_risk_codes && provision.related_risk_codes.length > 0 ? (
                  provision.related_risk_codes.map((code) => (
                    <span key={code} className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-data font-bold text-[10px]">
                      {code}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-[11px]">General public procurement oversight</span>
                )}
              </div>
            </div>
          </div>

          {/* Governance Notice */}
          <div className="p-3 bg-gray-100 border border-gray-300 rounded text-[11px] text-gray-600">
            <strong>Decision-Support Notice:</strong> CHEIRAP references authoritative statutory instructions to assist reviewing officers. Citations do not represent automated legal adjudications. The Competent Authority must examine the official tender records and recorded files under applicable law.
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Building className="size-3.5" />
            <span>State Vigilance Commission / Finance Dept, Govt. of Manipur</span>
          </div>
          <div className="flex items-center gap-2">
            {provision.official_url && (
              <a 
                href={provision.official_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-100 flex items-center gap-1"
              >
                Official Gazette <ExternalLink className="size-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#003366] text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
            >
              Close Citation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
