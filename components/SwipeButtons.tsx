'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SwipeButtonsProps {
  onLeftClick: () => void;
  onRightClick: () => void;
  onRestart?: () => void;
  isLastCard?: boolean; // Keep for backwards compatibility but ignore
}

export default function SwipeButtons({ 
  onLeftClick, 
  onRightClick 
}: SwipeButtonsProps) {
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!leftButtonRef.current || !rightButtonRef.current) return;

    const leftBtn = leftButtonRef.current;
    const rightBtn = rightButtonRef.current;

    // Hover animations for left button
    const setupLeftButtonAnimations = () => {
      leftBtn.addEventListener('mouseenter', () => {
        gsap.to(leftBtn, {
          scale: 1.2,
          duration: 0.3,
          ease: 'back.out(1.7)',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
        });
      });

      leftBtn.addEventListener('mouseleave', () => {
        gsap.to(leftBtn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        });
      });

      leftBtn.addEventListener('mousedown', () => {
        gsap.to(leftBtn, {
          scale: 0.9,
          duration: 0.1
        });
      });

      leftBtn.addEventListener('mouseup', () => {
        gsap.to(leftBtn, {
          scale: 1.2,
          duration: 0.1
        });
      });
    };

    // Hover animations for right button
    const setupRightButtonAnimations = () => {
      rightBtn.addEventListener('mouseenter', () => {
        gsap.to(rightBtn, {
          scale: 1.2,
          duration: 0.3,
          ease: 'back.out(1.7)',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
        });
      });

      rightBtn.addEventListener('mouseleave', () => {
        gsap.to(rightBtn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        });
      });

      rightBtn.addEventListener('mousedown', () => {
        gsap.to(rightBtn, {
          scale: 0.9,
          duration: 0.1
        });
      });

      rightBtn.addEventListener('mouseup', () => {
        gsap.to(rightBtn, {
          scale: 1.2,
          duration: 0.1
        });
      });
    };

    setupLeftButtonAnimations();
    setupRightButtonAnimations();

    // Note: No cleanup needed as GSAP handles it internally
  }, []);

  const handleLeftClick = () => {
    if (leftButtonRef.current) {
      // Quick scale animation
      gsap.timeline()
        .to(leftButtonRef.current, { scale: 0.9, duration: 0.1 })
        .to(leftButtonRef.current, { scale: 1, duration: 0.1 });
    }
    
    onLeftClick();
  };

  const handleRightClick = () => {
    if (rightButtonRef.current) {
      // Quick scale animation
      gsap.timeline()
        .to(rightButtonRef.current, { scale: 0.9, duration: 0.1 })
        .to(rightButtonRef.current, { scale: 1, duration: 0.1 });
    }
    
    onRightClick();
  };

  return (
    <div className="flex justify-center items-center gap-12 mt-4">
      {/* Left Button (X - Reject) */}
      <button
        ref={leftButtonRef}
        onClick={handleLeftClick}
        className="
          w-16 h-16 rounded-full 
          bg-red-500 text-white 
          flex items-center justify-center
          text-3xl font-bold
          shadow-lg
          transition-colors
          hover:bg-red-600 active:bg-red-700
        "
        aria-label="Skip this problem"
        title="Skip this problem"
      >
        ✕
      </button>

      {/* Right Button (✓ - Accept) */}
      <button
        ref={rightButtonRef}
        onClick={handleRightClick}
        className="
          w-16 h-16 rounded-full 
          bg-green-500 text-white 
          flex items-center justify-center
          text-3xl font-bold
          shadow-lg
          hover:bg-green-600 active:bg-green-700
          transition-colors
        "
        aria-label="Choose this problem"
        title="Choose this problem"
      >
        ✓
      </button>
    </div>
  );
}

