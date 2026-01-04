'use client';

import { useState, useEffect, useRef } from 'react';
import SwipeCard from './SwipeCard';
import SwipeButtons from './SwipeButtons';
import { animateCardEntrance } from '@/lib/swipeAnimations';

interface Problem {
  id: string;
  title: string;
  discomfort: string;
  promise: string;
}

interface SwipeStackProps {
  problems: Problem[];
  onProblemSelected: (problem: Problem) => void;
}

export default function SwipeStack({ problems, onProblemSelected }: SwipeStackProps) {
  // #region agent log
  try {
    console.log('[DEBUG] SwipeStack component mounting', { problemsCount: problems?.length, problemsDefined: !!problems });
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeStack.tsx:20',message:'SwipeStack component mounting',data:{problemsCount:problems?.length,problemsDefined:!!problems},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch((e)=>console.error('[DEBUG] Fetch error:',e));
  } catch(e) {
    console.error('[DEBUG] SwipeStack mount error:', e);
  }
  // #endregion
  
  const [remainingProblems, setRemainingProblems] = useState<Problem[]>(problems);
  const [hasAnimated, setHasAnimated] = useState(false);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  
  // #region agent log
  try {
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeStack.tsx:25',message:'SwipeStack state initialized',data:{remainingProblemsCount:remainingProblems?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  } catch(e) {}
  // #endregion

  // Animate cards on initial load
  useEffect(() => {
    if (hasAnimated || !stackContainerRef.current) return;

    const cards = stackContainerRef.current.querySelectorAll('.swipe-card-container > div');
    
    if (cards.length > 0) {
      animateCardEntrance({
        elements: Array.from(cards) as HTMLElement[],
        onComplete: () => {
          setHasAnimated(true);
        }
      });
    }
  }, [hasAnimated, remainingProblems.length]);

  const handleSwipeRight = () => {
    if (remainingProblems.length === 0) return;

    const selectedProblem = remainingProblems[0];
    
    // Notify parent component
    onProblemSelected(selectedProblem);
  };

  const handleSwipeLeft = () => {
    if (remainingProblems.length === 0) return;

    // Move to back of stack (infinite loop)
    setRemainingProblems(prev => [...prev.slice(1), prev[0]]);
  };

  const handleLeftButtonClick = () => {
    if (remainingProblems.length === 0) return;

    // Get the front card element and trigger its swipe method
    const frontCard = stackContainerRef.current?.querySelector('.swipe-card-container > div');
    if (frontCard && (frontCard as any).triggerSwipe) {
      (frontCard as any).triggerSwipe('left');
    }
  };

  const handleRightButtonClick = () => {
    if (remainingProblems.length === 0) return;

    // Get the front card element and trigger its swipe method
    const frontCard = stackContainerRef.current?.querySelector('.swipe-card-container > div');
    if (frontCard && (frontCard as any).triggerSwipe) {
      (frontCard as any).triggerSwipe('right');
    }
  };

  // No longer needed - cards loop infinitely
  const isLastCard = false;

  const handleRestart = () => {
    setRemainingProblems(problems);
    setHasAnimated(false);
  };

  // #region agent log
  try {
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SwipeStack.tsx:122',message:'SwipeStack about to render',data:{remainingProblemsCount:remainingProblems?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  } catch(e) {}
  // #endregion

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Instructions */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pick Your Problem
        </h1>
        <p className="text-gray-600">
          Swipe right or tap ✓ to select • Swipe left or tap ✕ to skip
        </p>
      </div>

      {/* Card Stack Container */}
      <div 
        ref={stackContainerRef}
        className="swipe-card-container relative w-full max-w-md h-[360px] mb-4"
      >
        {remainingProblems.slice(0, 4).map((problem, index) => (
          <SwipeCard
            key={problem.id}
            problem={problem}
            index={index}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            isLast={isLastCard}
            totalCards={remainingProblems.length}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <SwipeButtons
        onLeftClick={handleLeftButtonClick}
        onRightClick={handleRightButtonClick}
        onRestart={handleRestart}
        isLastCard={isLastCard}
      />

      {/* LinkedIn Link */}
      <div className="mt-8 text-sm text-gray-500">
        <a 
          href="http://www.linkedin.com/in/sreesaiganesh/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 hover:text-gray-700 transition-colors group"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span className="group-hover:underline">Connect with me on LinkedIn.</span>
        </a>
      </div>
    </div>
  );
}

