import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MotionPage = 'home' | 'explore' | 'detail';

const getElements = (root: HTMLElement, selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));

/**
 * Tactile hover delegation: gentle spring lift on cards and interactive elements across all pages
 */
const addHoverDelegation = (root: HTMLElement) => {
  const selector =
    '.story-card, .record-layer, .question-grid button, .deadline-item, .snapshot-metric, .tender-stat-card, .tender-meta-pill, .brief-takeaway-card, .gepnic-teaser-card, .detail-section, .understand-grid > div, .coverage-item, .gepnic-card, .cover-box, .tender-row, .source-card, .dossier-quick-facts > div, .state-directory-row, .how-steps > div, .method-grid > div, .adapter-health > div';

  const onPointerOver = (event: PointerEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(selector);
    if (!target || !root.contains(target) || target.contains(event.relatedTarget as Node | null)) return;
    gsap.to(target, { y: -3, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
  };

  const onPointerOut = (event: PointerEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(selector);
    if (!target || !root.contains(target)) return;
    gsap.to(target, { y: 0, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
  };

  root.addEventListener('pointerover', onPointerOver);
  root.addEventListener('pointerout', onPointerOut);

  return () => {
    root.removeEventListener('pointerover', onPointerOver);
    root.removeEventListener('pointerout', onPointerOut);
  };
};

/**
 * Tactile button press feedback (:active scale 0.965)
 */
const addButtonPressDelegation = (root: HTMLElement) => {
  const selector =
    '.primary-button, .secondary-button, .header-cta, .saved-filter, .hero-search button, .tender-back-btn, .tender-tab-btn, .gepnic-tab-btn, .tender-btn-new-window, .teaser-action-btn, .portal-audit-link, .tab-btn-pill, .nav-link, .icon-button, .brand-lockup, .breadcrumb-link';

  const onPointerDown = (event: PointerEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(selector);
    if (!target || !root.contains(target)) return;
    gsap.to(target, { scale: 0.965, duration: 0.11, ease: 'power2.out', overwrite: 'auto' });
  };

  const restore = (event: PointerEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(selector);
    if (!target || !root.contains(target)) return;
    gsap.to(target, { scale: 1, duration: 0.16, ease: 'power2.out', overwrite: 'auto' });
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointerup', restore);
  root.addEventListener('pointercancel', restore);
  root.addEventListener('pointerleave', restore, true);

  return () => {
    root.removeEventListener('pointerdown', onPointerDown);
    root.removeEventListener('pointerup', restore);
    root.removeEventListener('pointercancel', restore);
    root.removeEventListener('pointerleave', restore, true);
  };
};

/**
 * 3D Floating Perspective Tilt with quickTo smoothing
 */
const addHeroTilt = (root: HTMLElement) => {
  const visual = root.querySelector<HTMLElement>('.hero-visual');
  const card = root.querySelector<HTMLElement>('.hero-record-card');
  if (!visual || !card) return () => {};

  gsap.set(card, { transformPerspective: 1200, transformStyle: 'preserve-3d' });

  const xTo = gsap.quickTo(card, 'x', { duration: 0.38, ease: 'power2.out' });
  const yTo = gsap.quickTo(card, 'y', { duration: 0.38, ease: 'power2.out' });
  const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.38, ease: 'power2.out' });
  const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.38, ease: 'power2.out' });
  const rotationTo = gsap.quickTo(card, 'rotation', { duration: 0.38, ease: 'power2.out' });

  const onPointerMove = (event: PointerEvent) => {
    const bounds = visual.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;

    xTo(px * 18);
    yTo(py * 12);
    rotateXTo(-py * 16);
    rotateYTo(px * 20);
    rotationTo(-3 + px * 3);
  };

  const onPointerEnter = () => {
    gsap.to(card, {
      scale: 1.025,
      boxShadow: '0 34px 85px rgba(21, 51, 91, 0.25)',
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const onPointerLeave = () => {
    xTo(0);
    yTo(0);
    rotateXTo(0);
    rotateYTo(0);
    rotationTo(-3);
    gsap.to(card, {
      scale: 1,
      boxShadow: '0 26px 70px rgba(37, 66, 101, 0.18)',
      duration: 0.36,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  visual.addEventListener('pointermove', onPointerMove);
  visual.addEventListener('pointerenter', onPointerEnter);
  visual.addEventListener('pointerleave', onPointerLeave);

  return () => {
    visual.removeEventListener('pointermove', onPointerMove);
    visual.removeEventListener('pointerenter', onPointerEnter);
    visual.removeEventListener('pointerleave', onPointerLeave);
  };
};

/**
 * Scroll-Driven Number Tickers for procurement snapshot metrics
 */
const animateNumberCounters = (root: HTMLElement) => {
  const snapshotLeadStrong = root.querySelector<HTMLElement>('.snapshot-lead > strong');
  const metricElements = getElements(root, '.snapshot-metric strong');
  const snapshotBars = getElements(root, '.snapshot-bars b');

  // Total procurement spend counter
  if (snapshotLeadStrong) {
    const initialText = snapshotLeadStrong.textContent || '';
    const match = initialText.match(/[\d,.]+/);
    if (match) {
      const rawNumber = parseFloat(match[0].replace(/,/g, ''));
      const prefix = initialText.slice(0, match.index);
      const suffix = initialText.slice((match.index || 0) + match[0].length);
      const counter = { val: 0 };

      ScrollTrigger.create({
        trigger: snapshotLeadStrong,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: rawNumber,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              snapshotLeadStrong.textContent = `${prefix}${Math.round(counter.val).toLocaleString('en-IN')}${suffix}`;
            },
          });
        },
      });
    }
  }

  // Snapshot metric tiles (notices, departments, districts, signals)
  metricElements.forEach((el) => {
    const targetVal = parseInt(el.textContent || '', 10);
    if (!isNaN(targetVal)) {
      const counter = { count: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            count: targetVal,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(counter.count).toString();
            },
          });
        },
      });
    }
  });

  // Animated progress bar expansion
  if (snapshotBars.length) {
    snapshotBars.forEach((bar) => {
      const targetWidth = bar.style.width || '100%';
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: targetWidth,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 92%',
            once: true,
          },
        }
      );
    });
  }
};

export function useCheirapMotion(rootRef: RefObject<HTMLElement | null>, activePage: MotionPage) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Use official gsap.context for React cleanup and scoped execution
    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 981;
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      // 1. Scroll-Driven Reading Progress Bar
      const progressBar = root.querySelector<HTMLElement>('.scroll-progress-bar');
      if (progressBar) {
        gsap.fromTo(
          progressBar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.15,
            },
          }
        );
      }

      if (activePage === 'home') {
        // 2. Orchestrated Hero Intro Timeline
        const heroCopy = root.querySelector<HTMLElement>('.hero-copy');
        const heroVisual = root.querySelector<HTMLElement>('.hero-visual');
        const heroSection = root.querySelector<HTMLElement>('.hero-section');

        if (heroCopy && heroVisual) {
          const intro = gsap.timeline({ defaults: { duration: 0.58, ease: 'power3.out' } });
          intro.addLabel('intro');
          intro.from(heroCopy.querySelector('.eyebrow'), { opacity: 0, y: 16 }, 'intro');
          intro.from(heroCopy.querySelector('h1'), { opacity: 0, y: 28, duration: 0.72 }, 'intro+=0.06');
          intro.from(heroCopy.querySelector('p'), { opacity: 0, y: 18 }, '-=0.38');
          intro.from(heroCopy.querySelector('.hero-search'), { opacity: 0, y: 14, scale: 0.98 }, '-=0.32');
          intro.from(heroCopy.querySelector('.hero-notes'), { opacity: 0, y: 10 }, '-=0.3');
          intro.from(
            heroVisual.querySelector('.hero-record-card'),
            { opacity: 0, y: 28, rotation: -4, scale: 0.96, duration: 0.72 },
            'intro+=0.1'
          );
          intro.from(heroVisual.querySelector('.hero-emblem'), { opacity: 0, scale: 0.7, duration: 0.5 }, '-=0.38');

          // Desktop parallax depth scrub
          if (isDesktop && heroSection) {
            gsap.to(heroVisual, {
              y: 72,
              rotation: 1.2,
              ease: 'none',
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });
          }
        }

        // 3. Scroll-Driven Number Tickers
        animateNumberCounters(root);

        // 4. Batch Staggered Reveals on Scroll
        const revealTargets = getElements(
          root,
          '.snapshot-metric, .snapshot-note, .question-grid button, .story-card, .how-steps > div, .method-grid > div, .state-directory-row, .adapter-health > div'
        );
        if (revealTargets.length) {
          ScrollTrigger.batch(revealTargets, {
            start: 'top 90%',
            once: true,
            interval: 0.06,
            batchMax: 5,
            onEnter: (elements) =>
              gsap.from(elements, {
                opacity: 0,
                y: 24,
                scale: 0.98,
                duration: 0.54,
                ease: 'power3.out',
                stagger: 0.07,
                overwrite: 'auto',
              }),
          });
        }

        // 5. Scroll-Driven Transparency Chain sequence
        const layerSection = root.querySelector<HTMLElement>('.record-layers-section');
        const layers = getElements(root, '.record-layer');
        if (layerSection && layers.length) {
          const layerTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: layerSection,
              start: 'top 78%',
              end: 'bottom 48%',
              scrub: 0.8,
            },
          });
          layers.forEach((layer, index) => {
            layerTimeline.from(
              layer,
              { opacity: 0.25, y: 20, scale: 0.98, duration: 0.32, ease: 'power2.out' },
              index * 0.18
            );
          });
        }

        if (hasFinePointer) {
          addHeroTilt(root);
        }
      } else if (activePage === 'explore') {
        // Explore View Animations
        const exploreHeading = root.querySelector<HTMLElement>('.explore-heading');
        const toolbar = root.querySelector<HTMLElement>('.explore-toolbar');
        const signalStrip = root.querySelector<HTMLElement>('.explore-signal-strip');

        if (exploreHeading) {
          gsap.from(exploreHeading.children, {
            opacity: 0,
            y: 18,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
          });
        }
        if (toolbar) {
          gsap.from(toolbar, {
            opacity: 0,
            y: 16,
            scale: 0.98,
            duration: 0.54,
            delay: 0.08,
            ease: 'power3.out',
          });
        }
        if (signalStrip) {
          gsap.from(signalStrip, {
            opacity: 0,
            y: 14,
            duration: 0.48,
            delay: 0.14,
            ease: 'power3.out',
          });
          gsap.from(signalStrip.querySelectorAll('b'), {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.72,
            delay: 0.25,
            stagger: 0.1,
            ease: 'power2.out',
          });
        }

        // Staggered Tender Rows (fade only - no vertical translation to prevent card overlap)
        const rows = getElements(root, '.tender-row');
        if (rows.length) {
          ScrollTrigger.batch(rows, {
            start: 'top 95%',
            once: true,
            interval: 0.04,
            batchMax: 8,
            onEnter: (elements) =>
              gsap.from(elements, {
                opacity: 0,
                duration: 0.35,
                ease: 'power2.out',
                stagger: 0.04,
                overwrite: 'auto',
                clearProps: 'opacity,transform',
              }),
          });
        }
      } else if (activePage === 'detail') {
        // Whole-Window Tender Inspection View Animations:
        // Top navbar, hero header, stat cards and tabs are managed directly inside TenderDetail
        // to coordinate with live ticker counters and sub-tab switches.
        // Scroll reveals for long detail sections
        const detailSections = getElements(
          root,
          '.detail-section, .gepnic-teaser-card, .source-card, .coverage-item'
        );
        if (detailSections.length) {
          ScrollTrigger.batch(detailSections, {
            start: 'top 92%',
            once: true,
            interval: 0.05,
            batchMax: 4,
            onEnter: (elements) =>
              gsap.fromTo(
                elements,
                { opacity: 0, y: 18 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.45,
                  ease: 'power2.out',
                  stagger: 0.06,
                  overwrite: 'auto',
                  clearProps: 'opacity,transform',
                }
              ),
          });
        }
      }

      // 6. Tactile micro-interactions for pointer
      addHoverDelegation(root);
      addButtonPressDelegation(root);

      // Force recalculation after React render
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, root);

    return () => ctx.revert();
  }, [activePage, rootRef]);
}
