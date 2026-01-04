import gsap from 'gsap';

export interface SwipeAnimationOptions {
  element: HTMLElement;
  direction: 'left' | 'right';
  onComplete?: () => void;
}

export interface SnapBackOptions {
  element: HTMLElement;
  onComplete?: () => void;
}

export interface ShakeOptions {
  element: HTMLElement;
  onComplete?: () => void;
}

export interface StackAdvanceOptions {
  elements: HTMLElement[];
  onComplete?: () => void;
}

export interface CardEntranceOptions {
  elements: HTMLElement[];
  onComplete?: () => void;
}

/**
 * Animate card flying off screen (swipe left or right)
 */
export const throwCard = ({ element, direction, onComplete }: SwipeAnimationOptions) => {
  const xTarget = direction === 'right' 
    ? window.innerWidth * 1.5 
    : -window.innerWidth * 1.5;
  
  const rotation = direction === 'right' ? 30 : -30;

  gsap.to(element, {
    x: xTarget,
    rotation: rotation,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: onComplete
  });
};

/**
 * Snap card back to center with elastic bounce
 */
export const snapBack = ({ element, onComplete }: SnapBackOptions) => {
  gsap.to(element, {
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0.5,
    ease: 'elastic.out(1, 0.3)',
    onComplete: onComplete
  });
};

/**
 * Shake animation for disabled actions (e.g., trying to skip last card)
 */
export const shakeCard = ({ element, onComplete }: ShakeOptions) => {
  const timeline = gsap.timeline({ onComplete });
  
  timeline
    .to(element, { x: -20, duration: 0.1 })
    .to(element, { x: 20, duration: 0.1 })
    .to(element, { x: -20, duration: 0.1 })
    .to(element, { x: 0, duration: 0.1 });
};

/**
 * Animate remaining cards moving up in stack after top card is removed
 */
export const advanceStack = ({ elements, onComplete }: StackAdvanceOptions) => {
  gsap.to(elements, {
    scale: '+=0.05',
    y: '-=20',
    ease: 'back.out(1.7)',
    duration: 0.4,
    stagger: 0.05,
    onComplete: onComplete
  });
};

/**
 * Initial card entrance animation - cascade from above
 */
export const animateCardEntrance = ({ elements, onComplete }: CardEntranceOptions) => {
  gsap.from(elements, {
    y: -500,
    rotation: -10,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    duration: 0.8,
    onComplete: onComplete
  });
};

/**
 * Calculate rotation based on drag position
 */
export const calculateRotation = (xPosition: number, maxRotation: number = 20): number => {
  return (xPosition / window.innerWidth) * maxRotation;
};

/**
 * Check if drag should commit to swipe (based on threshold)
 */
export const shouldCommitSwipe = (xPosition: number, threshold: number = 150): boolean => {
  return Math.abs(xPosition) > threshold;
};

/**
 * Determine swipe direction from x position
 */
export const getSwipeDirection = (xPosition: number): 'left' | 'right' => {
  return xPosition > 0 ? 'right' : 'left';
};



