"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AnalysisResult from "@/components/AnalysisResult";
import { formatTimestamp } from "@/lib/formatters";

function getInitialProvider(providers) {
  return providers.find((provider) => provider.available) ?? providers[0] ?? null;
}

export default function Analyzer({ initialHistory = [], initialProviders = [] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(initialHistory);
  const [providers] = useState(initialProviders);
  const initialProvider = getInitialProvider(initialProviders);
  const [selectedProvider, setSelectedProvider] = useState(initialProvider?.id ?? "");
  const [selectedModel, setSelectedModel] = useState(initialProvider?.defaultModel ?? "");
  const maxLength = 6000;
  const trimmedText = text.trim();
  const providerConfig =
    providers.find((provider) => provider.id === selectedProvider) ?? initialProvider;
  const modelOptions = providerConfig?.models ?? [];

  async function refreshHistory() {
    try {
      const response = await fetch("/api/analyses");
      const data = await response.json();
      setHistory(Array.isArray(data.analyses) ? data.analyses.slice(0, 6) : []);
    } catch {
      // Keep the last known history if refresh fails.
    }
  }

  async function analyze() {
    if (!trimmedText) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmedText,
          provider: selectedProvider,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data);
      await refreshHistory();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Is Ollama running?");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#020617,_#020617_35%,_#0f172a)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1.3fr)_380px]">
        <section>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Local LLM Workflow</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white">
            Analyze text, persist results, and build a real AI application.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            This version saves every analysis, exposes a reusable API layer, and surfaces
            model output in a format you can inspect later.
          </p>

          <div className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="provider">
                  Provider
                </label>
                <select
                  id="provider"
                  value={selectedProvider}
                  onChange={(event) => {
                    const nextProvider = providers.find(
                      (provider) => provider.id === event.target.value,
                    );
                    setSelectedProvider(event.target.value);
                    setSelectedModel(nextProvider?.defaultModel ?? "");
                    setResult(null);
                    setError(null);
                  }}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id} disabled={!provider.available}>
                      {provider.label}
                      {!provider.available ? " (not configured)" : ""}
                    </option>
                  ))}
                </select>
                {providerConfig?.description ? (
                  <p className="mt-2 text-xs leading-6 text-slate-400">{providerConfig.description}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="model">
                  Model
                </label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(event) => {
                    setSelectedModel(event.target.value);
                    setResult(null);
                    setError(null);
                  }}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
                >
                  {modelOptions.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Persist provider and model metadata with each run so outputs can be compared later.
                </p>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between gap-4">
              <label htmlFor="analysis-text" className="text-sm font-medium text-slate-200">
                Source text
              </label>
              <span className="text-sm text-slate-400">
                {text.length}/{maxLength}
              </span>
            </div>
        <textarea
          id="analysis-text"
          maxLength={maxLength}
          className="h-64 w-full resize-none rounded-2xl border border-slate-800 bg-slate-900 p-4 text-base text-white outline-none transition focus:border-cyan-500"
          placeholder="Paste any text here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
            setError(null);
          }}
        />

        <button
          onClick={analyze}
          disabled={loading || !trimmedText || !selectedProvider || !selectedModel}
          className="mt-4 w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze and Save"}
        </button>

            {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
          </div>

          <div className="mt-8">
            {result ? (
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Latest saved result
                  </p>
                  <Link
                    href={`/analyses/${result.id}`}
                    className="text-sm text-cyan-300 transition hover:text-cyan-200"
                  >
                    Open detail page
                  </Link>
                </div>
                <AnalysisResult result={result.analysis} metadata={result.metadata} />
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-sm leading-7 text-slate-400">
                Saved results will appear here after the model returns a structured analysis.
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">History</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Recent analyses</h2>
            </div>
            <Link href="/analyses" className="text-sm text-slate-300 transition hover:text-white">
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 p-5 text-sm text-slate-400">
                No saved analyses yet.
              </div>
            ) : (
              history.map((item) => (
                <Link
                  key={item.id}
                  href={`/analyses/${item.id}`}
                  className="block rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-cyan-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-6 text-slate-200">{item.preview}</p>
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200">
                      {item.analysis.sentiment}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.metadata?.provider ?? "unknown"} / {item.metadata?.model ?? "unknown"}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    {formatTimestamp(item.createdAt)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
