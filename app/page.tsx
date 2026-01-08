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
  const [stage, setStage] = useState<"pick" | "intro" | "play">("pick");
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const problems = problemsData as Problem[];
  const sequences = sequencesData as Record<string, Sequence>;

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
