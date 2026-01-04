"use client";

import { useState } from "react";
import problemsData from "@/data/problems.json";
import sequencesData from "@/data/sequences.json";
import SwipeStack from "@/components/SwipeStack";
import { SequenceIntro } from "@/components/SequenceIntro";
import { SequencePlayer } from "@/components/SequencePlayer";

type Problem = {
  id: string;
  title: string;
  discomfort: string;
  promise: string;
};

type Sequence = {
  problemId: string;
  title: string;
  tagline: string;
  totalMinutes: number;
  videos: Array<{
    videoId: string;
    title: string;
    role: string;
    watchFor: string;
    durationMinutes: number;
  }>;
};

export default function Home() {
  // #region agent log
  try {
    console.log('[DEBUG] Home component rendering');
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:31',message:'Home component rendering',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((e)=>console.error('[DEBUG] Fetch error:',e));
  } catch(e) {
    console.error('[DEBUG] Home component error:', e);
  }
  // #endregion
  
  const [stage, setStage] = useState<"pick" | "intro" | "play">("pick");
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // #region agent log
  try {
    console.log('[DEBUG] Loading data files', { problemsDataLength: problemsData?.length, sequencesDataKeys: sequencesData ? Object.keys(sequencesData).length : 'null' });
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:36',message:'Loading data files',data:{problemsDataLength:problemsData?.length,sequencesDataKeys:sequencesData ? Object.keys(sequencesData).length : 'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((e)=>console.error('[DEBUG] Fetch error:',e));
  } catch(e) {
    console.error('[DEBUG] Data loading error:', e);
  }
  // #endregion
  
  const problems = problemsData as Problem[];
  const sequences = sequencesData as Record<string, Sequence>;
  
  // #region agent log
  try {
    console.log('[DEBUG] Data loaded and parsed', { problemsCount: problems?.length, sequencesCount: sequences ? Object.keys(sequences).length : 0, stage });
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:38',message:'Data loaded and parsed',data:{problemsCount:problems?.length,sequencesCount:sequences ? Object.keys(sequences).length : 0,stage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((e)=>console.error('[DEBUG] Fetch error:',e));
  } catch(e) {
    console.error('[DEBUG] Data parsing error:', e);
  }
  // #endregion

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblemId(problem.id);
    // Check if we have a sequence for this problem
    if (sequences[problem.id]) {
      setStage("intro");
    } else {
      // Later: show "coming soon"
      alert("This path is coming soon. For now, try one of the available problems.");
    }
  };

  const handleCommitSequence = () => {
    setStage("play");
    setCurrentIndex(0);
  };

  const handleNextVideo = () => {
    if (selectedProblemId && sequences[selectedProblemId]) {
      const sequence = sequences[selectedProblemId];
      if (currentIndex < sequence.videos.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // Finished sequence
        alert("You finished the sequence — nice work! 🎉");
        // Reset to beginning
        setStage("pick");
        setSelectedProblemId(null);
        setCurrentIndex(0);
      }
    }
  };

  const handleBackToSelection = () => {
    setStage("pick");
    setSelectedProblemId(null);
    setCurrentIndex(0);
  };

  if (stage === "pick") {
    // #region agent log
    try {
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:77',message:'Rendering SwipeStack',data:{problemsCount:problems?.length,stage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    } catch(e) {}
    // #endregion
    
    return (
      <SwipeStack
        problems={problems}
        onProblemSelected={handleSelectProblem}
      />
    );
  }

  if (stage === "intro" && selectedProblemId && sequences[selectedProblemId]) {
    const problem = problems.find((p) => p.id === selectedProblemId);
    const sequence = sequences[selectedProblemId];
    
    if (!problem) {
      return <div>Problem not found</div>;
    }

  return (
      <SequenceIntro
        problem={problem}
        sequence={sequence}
        onCommit={handleCommitSequence}
        onBackToSelection={handleBackToSelection}
      />
    );
  }

  if (stage === "play" && selectedProblemId && sequences[selectedProblemId]) {
    const sequence = sequences[selectedProblemId];
    return (
      <SequencePlayer
        sequence={sequence}
        currentIndex={currentIndex}
        onNext={handleNextVideo}
        onBackToSelection={handleBackToSelection}
      />
    );
  }

  return null;
}
