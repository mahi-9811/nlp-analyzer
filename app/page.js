import Link from "next/link";
import Analyzer from "@/components/Analyzer";
import { listAnalyses } from "@/lib/analysis-store";
import { listProviderOptions } from "@/lib/providers";

export const metadata = {
  title: "NLP Text Analyzer",
  description: "Analyze text with a local Ollama model and save your results.",
};

export default async function Home() {
  const analyses = await listAnalyses();
  const providers = listProviderOptions();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Analyzer initialHistory={analyses.slice(0, 6)} initialProviders={providers} />
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/experiments"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Benchmark experiments
          </Link>
          <Link
            href="/datasets"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            View datasets
          </Link>
        </div>
      </div>
    </main>
  );
}
