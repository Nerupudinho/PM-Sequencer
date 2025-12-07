type Problem = {
  id: string;
  title: string;
  discomfort: string;
  promise: string;
};

export function ProblemPicker({
  problems,
  onSelectProblem,
}: {
  problems: Problem[];
  onSelectProblem: (id: string) => void;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 py-8 sm:py-12">
      <header className="max-w-2xl text-center space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 px-2">
          What do you want to get better at this week?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto px-2">
          You've already tried AI tools. Pick a question that's been on your mind — we'll walk through one focused, practical sequence (≈60 minutes).
        </p>
      </header>

      <section className="grid gap-3 sm:gap-4 w-full max-w-3xl">
        {problems.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProblem(p.id)}
            className="group text-left border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-slate-400 hover:shadow-xl transition-all duration-200 bg-white hover:bg-slate-50 active:scale-[0.98] touch-manipulation"
          >
            <h2 className="font-semibold text-base sm:text-lg text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
              {p.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-3 leading-relaxed italic">
              {p.discomfort}
            </p>
            <p className="text-xs font-medium text-slate-500">
              → {p.promise}
            </p>
          </button>
        ))}
      </section>

      <footer className="max-w-2xl text-center mt-4">
        <p className="text-xs text-slate-500">
          No theory. No long courses. Just one practical sequence.
        </p>
      </footer>
    </main>
  );
}

