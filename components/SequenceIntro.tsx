'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Problem = {
  id: string;
  title: string;
  discomfort: string;
  promise: string;
};

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

export function SequenceIntro({
  problem,
  sequence,
  onCommit,
  onBackToSelection,
}: {
  problem: Problem;
  sequence: Sequence;
  onCommit: () => void;
  onBackToSelection?: () => void;
}) {
  const totalMinutes = sequence.totalMinutes;
  const containerRef = useRef<HTMLElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;

    const section = containerRef.current.querySelector('section');
    if (!section) return;

    // Fade in and slide up animation
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

  return (
    <main ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative">
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
      
      <section className="max-w-2xl w-full space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            {problem.title}
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            {sequence.tagline}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A curated sequence for mid–senior PMs. No browsing. No decision fatigue. Just watch, learn, and apply it Monday morning.
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
            <span>{totalMinutes} minutes total</span>
            <span className="hidden sm:inline">•</span>
            <span>{sequence.videos.length} videos in order</span>
            <span className="hidden sm:inline">•</span>
            <span>No setup required</span>
          </div>
        </div>

        <div className="border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">
            What you&apos;ll watch
          </h3>
          {sequence.videos.map((v, idx) => (
            <div key={v.videoId} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-700">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-900 mb-1 break-words">{v.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{v.watchFor}</p>
                <p className="text-xs text-slate-400 mt-1">{v.durationMinutes} min</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onCommit}
          className="w-full py-3 sm:py-4 rounded-xl bg-slate-900 text-white text-sm sm:text-base font-semibold hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] touch-manipulation"
        >
          Start the {totalMinutes}-minute sequence
        </button>
      </section>
    </main>
  );
}

