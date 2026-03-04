export async function POST(request) {
  const { text } = await request.json();

  const prompt = `Analyze the following text and return ONLY a JSON object.
No explanation, no markdown, no backticks. Just raw JSON.

{
  "sentiment": "positive" or "negative" or "neutral" or "mixed",
  "sentimentScore": a number from -1.0 (very negative) to 1.0 (very positive),
  "tone": ["array", "of", "2-3", "tones"],
  "keyThemes": ["array", "of", "3-5", "themes"],
  "entities": ["people, places, or organizations mentioned"],
  "summary": "one sentence that summarizes the text"
}

Text to analyze:
"${text}"`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  const rawText = data.response;

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json({ error: "Could not parse response" }, { status: 500 });
  }

  const cleaned = jsonMatch[0]
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");

  const result = JSON.parse(cleaned);

  // Log so we can see exactly what Llama returned
  console.log("LLAMA RESPONSE:", JSON.stringify(result, null, 2));

  return Response.json(result);
}