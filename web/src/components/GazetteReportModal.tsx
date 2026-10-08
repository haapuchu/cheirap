import React, { useEffect, useState } from 'react';
import { GazetteIntegrityReport } from './GazetteIntegrityReport';
import { X, Printer, Loader2 } from 'lucide-react';

export interface GazetteReportModalProps {
  tenderId: string;
  tender?: any;
  onClose: () => void;
}

export const GazetteReportModal: React.FC<GazetteReportModalProps> = ({
  tenderId,
  tender,
  onClose
}) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Robust capture-phase keydown handler to gracefully intercept Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/tenders/${tenderId}/report`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setReportData(data);
        }
      } catch (err) {
        console.error('Failed to load Gazette report data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReport();
    return () => { isMounted = false; };
  }, [tenderId]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="gazette-modal-title"
        className="relative bg-gray-100 rounded-xl max-w-5xl w-full my-auto shadow-2xl flex flex-col max-h-[94vh] z-10 border border-gray-300 overflow-hidden"
      >
        
        {/* Modal Top Control Bar */}
        <div className="no-print bg-[#003366] text-white px-5 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span id="gazette-modal-title" className="font-bold text-xs uppercase tracking-wider font-sans">
              The Manipur Gazette • Pre-Award Integrity Assessment Report (PIAR)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ease-out active:scale-[0.96] cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <Printer className="size-3.5" />
              <span>Print View</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-all duration-150 ease-out active:scale-[0.96] cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label="Close Gazette modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-3">
              <Loader2 className="size-8 animate-spin text-[#003366]" />
              <p className="text-xs font-data">Compiling official 14-section Gazette report from NICGEP official records...</p>
            </div>
          ) : (
            <GazetteIntegrityReport 
              reportData={reportData} 
              tender={tender} 
              onClose={onClose} 
              isStandalone={true} 
            />
          )}
        </div>

      </div>
    </div>
  );
};
