'use client';

// #region agent log
try {
  console.log('[DEBUG] SwipeCard module loading');
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:1',message:'SwipeCard module loading',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((e)=>console.error('[DEBUG] Fetch error:',e));
} catch(e) {
  console.error('[DEBUG] SwipeCard module load error:', e);
}
// #endregion

import { useEffect, useRef, useCallback } from 'react';

// #region agent log
try {
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:8',message:'Importing gsap',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
} catch(e) {}
// #endregion

import gsap from 'gsap';

// #region agent log
try {
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:10',message:'GSAP imported successfully',data:{gsapDefined:!!gsap},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
} catch(e) {}
// #endregion

import { 
  throwCard, 
  snapBack, 
  calculateRotation, 
  shouldCommitSwipe, 
  getSwipeDirection 
} from '@/lib/swipeAnimations';

// Draggable plugin reference
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Draggable: any = null;

interface Problem {
  id: string;
  title: string;
  discomfort: string;
  promise: string;
}

interface SwipeCardProps {
  problem: Problem;
  index: number;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isLast: boolean;
  totalCards: number;
}

export default function SwipeCard({
  problem,
  index,
  onSwipeRight,
  onSwipeLeft,
  isLast
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draggableRef = useRef<any[]>([]);
  const isSwipingRef = useRef(false);

  // Calculate visual properties based on position in stack
  const getStackStyle = useCallback(() => {
    const baseScale = 1 - (index * 0.05);
    const baseY = index * 20;
    const zIndex = 10 - index;

    return {
      scale: baseScale,
      y: baseY,
      zIndex: zIndex,
      opacity: index < 4 ? 1 : 0, // Only show top 4 cards
    };
  }, [index]);

  useEffect(() => {
    // #region agent log
    try {
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:79',message:'SwipeCard useEffect running',data:{index,hasCardRef:!!cardRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    } catch(e) {}
    // #endregion
    
    if (!cardRef.current || index !== 0) return; // Only make front card draggable

    const card = cardRef.current;
    const stackStyle = getStackStyle();
    
    // Set initial position
    try {
      gsap.set(card, {
        scale: stackStyle.scale,
        y: stackStyle.y,
        zIndex: stackStyle.zIndex,
        x: 0,
        rotation: 0
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:92',message:'GSAP set successful',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch(e) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:95',message:'GSAP set error',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    }

    // Load and use Draggable plugin
    const setupDraggable = async () => {
      // #region agent log
      try {
        fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:98',message:'Loading Draggable plugin',data:{draggableExists:!!Draggable},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      } catch(e) {}
      // #endregion
      
      if (!Draggable) {
        try {
          const draggableModule = await import('gsap/Draggable');
          Draggable = draggableModule.Draggable;
          if (Draggable) {
            gsap.registerPlugin(Draggable);
          }
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:101',message:'Draggable imported and registered',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
        } catch(e) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeCard.tsx:104',message:'Draggable import error',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          return;
        }
      }

      // Create draggable instance
      const draggable = Draggable.create(card, {
      type: 'x,y',
      bounds: { minX: -window.innerWidth, maxX: window.innerWidth, minY: -100, maxY: 100 },
      inertia: true,
      onDrag: function(this: { x: number }) {
        if (isSwipingRef.current) return;
        
        // Apply rotation based on horizontal position
        const rotation = calculateRotation(this.x);
        gsap.set(card, { rotation });
      },
      onDragEnd: function(this: { x: number }) {
        if (isSwipingRef.current) return;

        const xPos = this.x;

        // Check if we've passed the threshold
        if (shouldCommitSwipe(xPos)) {
          isSwipingRef.current = true;
          const direction = getSwipeDirection(xPos);

          // Commit the swipe
          throwCard({
            element: card,
            direction,
            onComplete: () => {
              isSwipingRef.current = false;
              if (direction === 'right') {
                onSwipeRight();
              } else {
                onSwipeLeft();
              }
            }
          });
        } else {
          // Snap back to center
          snapBack({ element: card });
        }
      }
      })[0];

      draggableRef.current = [draggable];

      return () => {
        // Cleanup draggable instance
        if (draggable) {
          draggable.kill();
        }
      };
    };

    setupDraggable();

    // Cleanup function
    return () => {
      if (draggableRef.current[0]) {
        draggableRef.current[0].kill();
      }
    };
  }, [index, isLast, onSwipeRight, onSwipeLeft, getStackStyle]);

  // Update position when index changes (card moves up in stack)
  useEffect(() => {
    if (!cardRef.current || index === 0) return;

    const card = cardRef.current;
    const stackStyle = getStackStyle();

    gsap.to(card, {
      scale: stackStyle.scale,
      y: stackStyle.y,
      zIndex: stackStyle.zIndex,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
  }, [index, getStackStyle]);

  // Trigger swipe from external button click
  const triggerSwipe = (direction: 'left' | 'right') => {
    if (isSwipingRef.current || !cardRef.current || index !== 0) return;

    isSwipingRef.current = true;
    throwCard({
      element: cardRef.current,
      direction,
      onComplete: () => {
        isSwipingRef.current = false;
        if (direction === 'right') {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
    });
  };

  // Expose trigger method via ref (we'll handle this in SwipeStack)
  useEffect(() => {
    if (cardRef.current && index === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cardRef.current as any).triggerSwipe = triggerSwipe;
    }
  }, [index, isLast, triggerSwipe]);

  const stackStyle = getStackStyle();

  return (
    <div
      ref={cardRef}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md cursor-grab active:cursor-grabbing"
      style={{
        zIndex: stackStyle.zIndex,
        touchAction: 'none' // Prevent default touch behaviors
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
        {/* Problem Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
          {problem.title}
        </h2>

        {/* Discomfort Section */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-black mb-2">
            Do you relate to this?
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            {problem.discomfort}
          </p>
        </div>

        {/* Promise Section */}
        <div>
          <div className="text-sm font-semibold text-green-600 mb-2">
            Swipe right to learn
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            {problem.promise}
          </p>
        </div>
      </div>
    </div>
  );
}

