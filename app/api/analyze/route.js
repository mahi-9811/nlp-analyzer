import { analyzeText } from "@/lib/analyzer-service";
import { saveAnalysis } from "@/lib/analysis-store";
import { getErrorStatus } from "@/lib/errors/provider-error";

export async function POST(request) {
  try {
    const body = await request.json();
    const { analysis, run } = await analyzeText(body?.text, {
      provider: body?.provider,
      model: body?.model,
      promptVersion: body?.promptVersion,
    });
    const record = await saveAnalysis({
      text: body.text.trim(),
      analysis,
      metadata: run,
    });

    return Response.json(record, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error while analyzing text.";

    const status = getErrorStatus(error) ?? (/required|fewer/.test(message) ? 400 : 502);

    return Response.json({ error: message }, { status });
  }
}
