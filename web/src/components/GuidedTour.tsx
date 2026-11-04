import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Sparkles,
  ToggleRight,
} from 'lucide-react';

export interface TourStep {
  id: string;
  page: 'home' | 'explore' | 'detail';
  targetSelector: string;
  badge: string;
  title: string;
  description: string;
  actionHint?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    page: 'home',
    targetSelector: '.site-header .brand-lockup',
    badge: 'Civic Mission',
    title: 'Welcome to CHEIRAP',
    description:
      'CHEIRAP translates complex e-procurement data into plain-language civic intelligence. Track how public funds are deployed, verify notice integrity, and exercise legal citizen oversight.',
    actionHint: 'Next: Explore Live Tenders',
  },
  {
    id: 'states',
    page: 'explore',
    targetSelector: '.explore-quick-chips',
    badge: 'Multi-State Ingestion',
    title: 'Dual-State Live Procurement Datasets',
    description:
      'Filter and compare 188 civic tenders across Manipur (92 records via manipurtenders.gov.in) and Maharashtra (96 live records via mahatenders.gov.in, covering MCGM/BMC, MMRDA, PWD, and Public Health).',
    actionHint: 'Next: Social Impact Domains',
  },
  {
    id: 'sdg_domains',
    page: 'explore',
    targetSelector: '.explore-quick-chips',
    badge: 'Social Impact & SDGs',
    title: 'Civic Need & SDG Categorization',
    description:
      'Procurements are mapped to UN Sustainable Development Goals: Clean Water (SDG 6), Healthcare & Hospitals (SDG 3), Roads & Transit (SDG 9 & 11), Education (SDG 4), and Energy & Public Safety (SDG 7 & 16).',
    actionHint: 'Next: Risk Vigilance Signals',
  },
  {
    id: 'vigilance',
    page: 'explore',
    targetSelector: '.explore-toolbar-actions',
    badge: 'Vigilance Engine',
    title: 'Algorithmic Risk Scoring & Signals',
    description:
      'CHEIRAP audits notice timelines, corrigenda frequency, and bid-security outliers to surface records warranting citizen scrutiny before contracts close.',
    actionHint: 'Next: 1-Click Statutory RTI',
  },
  {
    id: 'rti_action',
    page: 'detail',
    targetSelector: '.citizen-action-card.inquiry-card',
    badge: 'Legal Accountability',
    title: 'Statutory Form A RTI Generator',
    description:
      'Exercise legal oversight under Section 6(1) of the RTI Act, 2005. Generate an auto-filled, printable Form A application citing CVC guidelines with one click.',
    actionHint: 'Finish Walkthrough',
  },
];

interface GuidedTourProps {
  active: boolean;
  onToggle: (state: boolean) => void;
  currentPage: 'home' | 'explore';
  hasSelectedTender: boolean;
  onNavigatePage: (page: 'home' | 'explore') => void;
  onSelectSampleTender: () => void;
  onCloseTender: () => void;
}

export function GuidedTour({
  active,
  onToggle,
  currentPage,
  hasSelectedTender,
  onNavigatePage,
  onSelectSampleTender,
  onCloseTender,
}: GuidedTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Align active page with tour step
  useEffect(() => {
    if (!active || !step) return;

    if (step.page === 'home' && (currentPage !== 'home' || hasSelectedTender)) {
      onCloseTender();
      onNavigatePage('home');
    } else if (step.page === 'explore' && (currentPage !== 'explore' || hasSelectedTender)) {
      onCloseTender();
      onNavigatePage('explore');
    } else if (step.page === 'detail' && !hasSelectedTender) {
      onSelectSampleTender();
    }
  }, [active, step, currentPage, hasSelectedTender, onNavigatePage, onSelectSampleTender, onCloseTender]);

  // Calculate spotlight coordinates & card positioning
  const updatePositions = useCallback(() => {
    if (!active || !step) return;

    const el = document.querySelector(step.targetSelector) as HTMLElement | null;
    if (!el) {
      // Fallback: center in viewport if selector not found
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setSpotlightRect(null);
      setCardPos({
        top: Math.max(20, Math.round(vh / 2 - 160)),
        left: Math.max(16, Math.round(vw / 2 - Math.min(vw - 32, 420) / 2)),
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    const padding = 8;
    const top = Math.max(0, rect.top - padding);
    const left = Math.max(0, rect.left - padding);
    const width = rect.width + padding * 2;
    const height = rect.height + padding * 2;

    setSpotlightRect({ top, left, width, height });

    // Determine card position
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cardWidth = Math.min(vw - 32, 420);
    const cardHeight = 240; // estimated

    let targetLeft = left + width / 2 - cardWidth / 2;
    // Keep horizontally in bounds
    if (targetLeft < 16) targetLeft = 16;
    if (targetLeft + cardWidth > vw - 16) targetLeft = vw - 16 - cardWidth;

    let targetTop = top + height + 14;
    // If not enough room below, place above
    if (targetTop + cardHeight > vh - 20) {
      targetTop = Math.max(20, top - cardHeight - 14);
    }

    setCardPos({ top: Math.round(targetTop), left: Math.round(targetLeft) });
  }, [active, step]);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(updatePositions, 150);
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [active, currentStepIndex, updatePositions]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle(false);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          onToggle(false);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, currentStepIndex, onToggle]);

  if (!active || !step) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onToggle(false);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="tour-portal-root" role="dialog" aria-modal="true" aria-label="Guided Walkthrough">
      {/* Dark backdrop with cutout spotlight */}
      <div className="tour-backdrop" onClick={() => onToggle(false)}>
        {spotlightRect && (
          <div
            className="tour-spotlight-box"
            style={{
              top: `${spotlightRect.top}px`,
              left: `${spotlightRect.left}px`,
              width: `${spotlightRect.width}px`,
              height: `${spotlightRect.height}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {/* Floating Tour Tooltip Card */}
      <div
        ref={cardRef}
        className="tour-card"
        style={{
          top: cardPos ? `${cardPos.top}px` : '50%',
          left: cardPos ? `${cardPos.left}px` : '50%',
          transform: cardPos ? 'none' : 'translate(-50%, -50%)',
        }}
      >
        <div className="tour-card-header">
          <div className="tour-badge-row">
            <span className="tour-step-pill">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <span className="tour-category-tag">{step.badge}</span>
          </div>

          <div className="tour-header-controls">
            <button
              type="button"
              className="tour-toggle-switch-btn"
              onClick={() => onToggle(false)}
              title="Toggle guided walkthrough off"
              aria-label="Toggle tour off"
            >
              <span>Tour:</span>
              <strong>ON</strong>
              <ToggleRight size={18} className="tour-toggle-icon-on" />
            </button>
            <button
              type="button"
              className="tour-close-btn"
              onClick={() => onToggle(false)}
              aria-label="Close walkthrough"
              title="Close walkthrough (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="tour-card-body">
          <h3 className="tour-step-title">{step.title}</h3>
          <p className="tour-step-desc">{step.description}</p>
        </div>

        <div className="tour-card-footer">
          <div className="tour-dots" aria-hidden="true">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`tour-dot ${idx === currentStepIndex ? 'tour-dot-active' : ''} ${
                  idx < currentStepIndex ? 'tour-dot-done' : ''
                }`}
                onClick={() => setCurrentStepIndex(idx)}
              />
            ))}
          </div>

          <div className="tour-actions">
            {!isFirstStep && (
              <button type="button" className="tour-btn-secondary" onClick={handlePrev}>
                <ArrowLeft size={13} /> Back
              </button>
            )}
            <button type="button" className="tour-btn-primary" onClick={handleNext}>
              {isLastStep ? (
                <>
                  <CheckCircle2 size={14} /> Finish Tour
                </>
              ) : (
                <>
                  {step.actionHint || 'Next'} <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FirstVisitTourBanner({ onStart, onDismiss }: { onStart: () => void; onDismiss: () => void }) {
  return (
    <div className="tour-first-visit-toast" role="status" aria-live="polite">
      <div className="tour-toast-inner">
        <div className="tour-toast-icon">
          <Compass size={22} />
        </div>
        <div className="tour-toast-content">
          <div className="tour-toast-header">
            <strong>First time visiting CHEIRAP?</strong>
            <span className="tour-toast-pill">Guided Tour</span>
          </div>
          <p>
            Explore how CHEIRAP audits public tenders across Maharashtra & Manipur, categorizes community impact
            by SDG, and generates statutory Form A RTI applications in 1-click.
          </p>
          <div className="tour-toast-actions">
            <button type="button" className="tour-toast-btn-start" onClick={onStart}>
              <Sparkles size={14} /> Take 60-Sec Tour
            </button>
            <button type="button" className="tour-toast-btn-skip" onClick={onDismiss}>
              Maybe Later
            </button>
          </div>
        </div>
        <button
          type="button"
          className="tour-toast-btn-close"
          onClick={onDismiss}
          aria-label="Dismiss first-time guide prompt"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
