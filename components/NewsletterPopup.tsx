'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const POPUP_DISMISSED_KEY = 'newsletter-popup-dismissed';
const POPUP_DELAY_MS = 5000; // 5 seconds (reduced for testing)
const SCROLL_THRESHOLD = 0.3; // Show after 30% scroll (reduced for testing)

interface NewsletterPopupProps {
  substackUrl?: string;
}

export default function NewsletterPopup({ substackUrl }: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // #region agent log - State changes
  useEffect(() => {
    console.log('[NewsletterPopup] State changed:', { isVisible, isDismissed });
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:15',message:'State changed',data:{isVisible,isDismissed},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  }, [isVisible, isDismissed]);
  // #endregion
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const hasScrolledRef = useRef(false);

  // #region agent log - Component mount
  useEffect(() => {
    console.log('[NewsletterPopup] Component mounted');
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:14',message:'Component mounted',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, []);
  // #endregion

  // Check if popup was previously dismissed
  useEffect(() => {
    // #region agent log - localStorage check
    try {
      const dismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
      console.log('[NewsletterPopup] localStorage check:', { dismissed, key: POPUP_DISMISSED_KEY });
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:26',message:'localStorage check',data:{dismissed,key:POPUP_DISMISSED_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      if (dismissed === 'true') {
        console.log('[NewsletterPopup] Popup was previously dismissed, setting isDismissed=true');
        fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:28',message:'Popup dismissed in localStorage',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        setIsDismissed(true);
        return;
      }
    } catch (error) {
      // localStorage not available (private browsing, etc.)
      console.warn('localStorage not available:', error);
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:32',message:'localStorage error',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      console.log('[NewsletterPopup] Mouse leave event:', { clientY: e.clientY, isDismissed, isVisible });
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:37',message:'Mouse leave event',data:{clientY:e.clientY,isDismissed,isVisible},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      if (e.clientY <= 0 && !isDismissed && !isVisible) {
        console.log('[NewsletterPopup] Exit intent detected, setting isVisible=true');
        fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:39',message:'Exit intent triggered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        setIsVisible(true);
      }
    };

    // Scroll-based trigger
    const handleScroll = () => {
      if (hasScrolledRef.current) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollPercent = scrollHeight > windowHeight ? scrollY / (scrollHeight - windowHeight) : 0;
      console.log('[NewsletterPopup] Scroll event:', { scrollPercent, threshold: SCROLL_THRESHOLD, isDismissed, isVisible });
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:44',message:'Scroll event',data:{scrollPercent,threshold:SCROLL_THRESHOLD,isDismissed,isVisible},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      if (scrollPercent >= SCROLL_THRESHOLD && !isDismissed && !isVisible) {
        console.log('[NewsletterPopup] Scroll threshold reached, setting isVisible=true');
        fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:50',message:'Scroll threshold triggered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        hasScrolledRef.current = true;
        setIsVisible(true);
      }
    };

    // Time-based trigger (fallback)
    console.log('[NewsletterPopup] Setting timer for', POPUP_DELAY_MS, 'ms');
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:56',message:'Timer set',data:{delayMs:POPUP_DELAY_MS,isDismissed,isVisible},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    const timer = setTimeout(() => {
      console.log('[NewsletterPopup] Timer fired:', { isDismissed, isVisible });
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:57',message:'Timer fired',data:{isDismissed,isVisible},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      if (!isDismissed && !isVisible) {
        console.log('[NewsletterPopup] Timer triggered, setting isVisible=true');
        fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:59',message:'Timer triggered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        setIsVisible(true);
      }
    }, POPUP_DELAY_MS);

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDismissed, isVisible]);

  const handleClose = useCallback((savePreference: boolean = false) => {
    console.log('[NewsletterPopup] handleClose called:', { savePreference });
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:101',message:'handleClose called',data:{savePreference},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
    if (!popupRef.current || !overlayRef.current) {
      console.log('[NewsletterPopup] handleClose early return - refs missing');
      return;
    }

    const popup = popupRef.current;
    const overlay = overlayRef.current;

    // Animate out
    gsap.to([popup, overlay], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        console.log('[NewsletterPopup] Animation complete, setting isDismissed=true');
        fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:115',message:'Setting isDismissed=true in handleClose',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
        setIsVisible(false);
        setIsDismissed(true);

        if (savePreference) {
          try {
            localStorage.setItem(POPUP_DISMISSED_KEY, 'true');
          } catch (error) {
            console.warn('Failed to save preference:', error);
          }
        }

        // Return focus to previous element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      },
    });
  }, []);

  // Keyboard support (ESC key)
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, handleClose]);

  // Focus management
  useEffect(() => {
    if (!isVisible || !modalRef.current) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Move focus to modal
    const firstFocusable = modalRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isVisible]);

  // Animate popup entrance
  useEffect(() => {
    if (!isVisible) return;
    
    // Use a small timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      console.log('[NewsletterPopup] Animation useEffect running:', { isVisible, hasPopupRef: !!popupRef.current, hasOverlayRef: !!overlayRef.current });
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:203',message:'Animation useEffect running',data:{isVisible,hasPopupRef:!!popupRef.current,hasOverlayRef:!!overlayRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      
      if (!popupRef.current || !overlayRef.current) {
        console.log('[NewsletterPopup] Animation useEffect early return - refs not ready');
        fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:206',message:'Animation early return - refs missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
        return;
      }

      const popup = popupRef.current;
      const overlay = overlayRef.current;

      console.log('[NewsletterPopup] Starting GSAP animation');
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:212',message:'Starting GSAP animation',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});

      // Set initial state - only animate scale and y, not opacity (CSS handles opacity)
      gsap.set(popup, {
        scale: 0.9,
        y: 20,
      });

      // Animate in - opacity is handled by CSS, GSAP only animates transform
      gsap.to(popup, {
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.1,
        onComplete: () => {
          console.log('[NewsletterPopup] GSAP animation complete');
          fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:233',message:'GSAP animation complete',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
        },
      });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [isVisible]);


  // #region agent log - Render check
  useEffect(() => {
    console.log('[NewsletterPopup] Render check:', { isDismissed, isVisible, willRender: !(isDismissed || !isVisible) });
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:195',message:'Render check',data:{isDismissed,isVisible,willRender:!(isDismissed || !isVisible)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  }, [isDismissed, isVisible]);
  // #endregion

  if (isDismissed || !isVisible) {
    console.log('[NewsletterPopup] Returning null:', { isDismissed, isVisible });
    return null;
  }

  return (
    <>
      {/* Overlay - softer opacity */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        style={{ opacity: 1 }}
        onClick={(e) => {
          console.log('[NewsletterPopup] Overlay clicked');
          fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsletterPopup.tsx:225',message:'Overlay clicked',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
          handleClose(false);
        }}
        aria-hidden="true"
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        style={{ opacity: 1 }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-heading"
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full pointer-events-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - larger and higher contrast */}
          <button
            onClick={() => handleClose(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded"
            aria-label="Close newsletter popup"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Heading */}
            <h2 id="newsletter-heading" className="text-3xl font-bold text-slate-900 mb-6">
              Want to build something like this?
            </h2>

            {/* Substack embed iframe */}
            <div className="mb-6">
              <iframe 
                src="https://sreesaiganesh.substack.com/embed" 
                width="100%" 
                height="320" 
                style={{border: '1px solid #EEE', background: 'white'}} 
                frameBorder="0" 
                scrolling="no"
              />
            </div>

            {/* No thanks button */}
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => handleClose(false)}
                className="px-6 py-2 text-base font-medium text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded-lg transition-colors"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}