"use client";

import { useState } from "react";

export default function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyze() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Is Ollama running?");
    }

    setLoading(false);
  }

  const toArray = (val) => (Array.isArray(val) ? val : [val]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">

        <h1 className="text-4xl font-bold mb-2">NLP Text Analyzer 🧠</h1>
        <p className="text-gray-400 mb-8">Powered by Llama 3.2 — running locally on your machine</p>

        <textarea
          className="w-full h-48 p-4 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-blue-500 text-base"
          placeholder="Paste any text here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);  // clear old result
            setError(null);   // clear old errors
          }}
        />

        <button
          onClick={analyze}
          disabled={loading || !text.trim()}
          className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
        >
          {loading ? "Analyzing..." : "Analyze Text →"}
        </button>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {result && (
          <div className="mt-8 space-y-4">

            {/* Sentiment */}
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Sentiment</p>
              <p className="text-2xl font-bold capitalize">{result.sentiment}</p>
              <p className="text-gray-400 text-sm mt-1">Score: {result.sentimentScore}</p>
            </div>

            {/* Tone */}
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Tone</p>
              <div className="flex flex-wrap gap-2">
                {toArray(result.tone).map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">{t}</span>
                ))}
              </div>
            </div>

            {/* Key Themes */}
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Key Themes</p>
              <div className="flex flex-wrap gap-2">
                {toArray(result.keyThemes).map((theme, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-900 text-purple-200 rounded-full text-sm">{theme}</span>
                ))}
              </div>
            </div>

            {/* Entities */}
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Entities</p>
              <div className="flex flex-wrap gap-2">
                {toArray(result.entities).map((e, i) => (
                  <span key={i} className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-sm">{e}</span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Summary</p>
              <p className="text-white">{result.summary}</p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}