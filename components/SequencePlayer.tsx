'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Video = {
  videoId: string;
  title: string;
  role: string;
  watchFor: string;
  durationMinutes: number;
};

type Sequence = {
  problemId: string;
  title: string;
  tagline: string;
  totalMinutes: number;
  videos: Video[];
};

export function SequencePlayer({
  sequence,
  currentIndex,
  onNext,
  onBackToSelection,
}: {
  sequence: Sequence;
  currentIndex: number;
  onNext: () => void;
  onBackToSelection?: () => void;
}) {
  const current = sequence.videos[currentIndex];
  const isLast = currentIndex === sequence.videos.length - 1;
  const progress = ((currentIndex + 1) / sequence.videos.length) * 100;
  const containerRef = useRef<HTMLElement>(null);
  const prevIndexRef = useRef(currentIndex);

  // Initial entrance animation
  useEffect(() => {
    if (!containerRef.current || prevIndexRef.current !== 0) return;

    const section = containerRef.current.querySelector('section');
    if (!section) return;

    gsap.fromTo(
      section,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out'
      }
    );
  }, []);

  // Animate video transitions
  useEffect(() => {
    if (prevIndexRef.current === currentIndex) return;
    prevIndexRef.current = currentIndex;

    if (!containerRef.current) return;
    const videoContainer = containerRef.current.querySelector('.aspect-video');
    const infoCard = containerRef.current.querySelector('.border-2.border-slate-200');
    
    if (videoContainer) {
      gsap.fromTo(
        videoContainer,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }

    if (infoCard) {
      gsap.fromTo(
        infoCard,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );
    }
  }, [currentIndex]);

  const embedUrl = `https://www.youtube.com/embed/${current.videoId}?rel=0&modestbranding=1`;

  return (
    <main ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col items-center px-4 py-4 sm:py-8 relative">
      {/* Back to Selection Link */}
      {onBackToSelection && (
        <button 
          onClick={onBackToSelection} 
          className="absolute top-8 left-8 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Choose a different problem
        </button>
      )}
      
      <section className="w-full max-w-4xl space-y-4 sm:space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase tracking-wide font-medium">
              Step {currentIndex + 1} of {sequence.videos.length}
            </span>
            <span className="text-xs sm:text-sm">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Title section */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{sequence.title}</h1>
          <p className="text-xs sm:text-sm text-slate-600">{sequence.tagline}</p>
          <p className="text-xs text-slate-500 italic">Watch this sequence. Apply it next week. That&apos;s it.</p>
        </div>

        {/* Video player */}
        <div className="aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl border-2 border-slate-200 shadow-xl bg-slate-900">
          <iframe
            key={current.videoId}
            className="w-full h-full"
            src={embedUrl}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Current video info */}
        <div className="border-2 border-slate-200 rounded-xl p-4 sm:p-5 bg-white">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">
            Watch for this
          </p>
          <p className="text-sm sm:text-base text-slate-900 leading-relaxed">{current.watchFor}</p>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs sm:text-sm font-medium text-slate-700 break-words">{current.title}</p>
            <p className="text-xs text-slate-500 mt-1">{current.durationMinutes} minutes</p>
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          className="w-full py-3 sm:py-4 rounded-xl bg-slate-900 text-white text-sm sm:text-base font-semibold hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] touch-manipulation"
        >
          {isLast ? "Finish sequence" : "Next video in sequence →"}
        </button>

        {/* Upcoming videos preview (if not last) */}
        {!isLast && (
          <div className="border-2 border-slate-200 rounded-xl p-4 sm:p-5 bg-white">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-3">
              Coming up
            </p>
            <div className="space-y-2">
              {sequence.videos.slice(currentIndex + 1, currentIndex + 3).map((v, idx) => (
                <div key={v.videoId} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className="text-slate-400 flex-shrink-0">{currentIndex + 2 + idx}.</span>
                  <span className="text-slate-600 break-words">{v.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

