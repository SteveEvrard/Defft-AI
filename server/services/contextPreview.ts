import { z } from "zod";
import { getOpenAIClient } from "../lib/openai-client.js";

const ContextSchema = z.object({
  chips: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(2)
    .max(6),
  priorities: z.array(z.string()).default([]),
  playbooks: z.array(z.string()).default([]),
});

export type ContextPreview = z.infer<typeof ContextSchema>;

const contextShapeDescription = JSON.stringify(
  {
    chips: [{ label: "string", value: "string" }],
    priorities: ["string"],
    playbooks: ["string"],
  },
  null,
  2
);

export async function generateContextPreview(notes: string): Promise<ContextPreview> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const sanitizedNotes = notes.trim().slice(0, 3000);

  try {
    const client = getOpenAIClient();
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

    const response = await client.responses.create({
      model,
      temperature: 0.2,
      input: [
        {
          role: "system",
          content: `You are a packaging-opportunity triage assistant. Return JSON only (no prose, no markdown) in this exact shape:\n${contextShapeDescription}\n\nHard rules:\n- Always return 2–6 chips. Never fewer than 2, never more than 6.\n- Each chip must be grounded in the notes; infer concise, actionable handles (e.g., "Cold chain", "Carrier", "Lane", "Volume", "Sustainability", "Compliance").\n- Avoid generic fallbacks like "context unavailable" or "add more detail". If info is sparse, infer the most likely handles from what is present.\n- Priorities: 2–5 crisp bullets of what matters most.\n- Playbooks: 2–5 internal plays to run next.\n- Keep wording tight and editable by a sales rep.`,
        },
        {
          role: "user",
          content: `Meeting summary:\n"""${sanitizedNotes || "No notes provided."}"""`,
        },
      ],
    });

    const rawPayload =
      response.output
        ?.flatMap((item: any) => item.content ?? [])
        .map((part: any) => ("text" in part ? part.text : ""))
        .join("")
        .trim() ?? "";

    if (!rawPayload) {
      throw new Error("No content returned from OpenAI");
    }

    const parsed = ContextSchema.safeParse(JSON.parse(rawPayload));
    if (!parsed.success) {
      throw new Error("AI response failed schema validation");
    }

    return parsed.data;
  } catch (error) {
    console.error("Failed to build context preview", error);
    return buildFallbackContext(sanitizedNotes);
  }
}

function buildFallbackContext(notes: string): ContextPreview {
  const trimmed = notes.trim();
  const snippet = trimmed ? (trimmed.length > 120 ? `${trimmed.slice(0, 120)}…` : trimmed) : "Provided summary was empty.";

  return {
    chips: [
      { label: "Primary signal", value: snippet },
      { label: "Next step", value: "Confirm payload, temperature, lane, and volume with the customer." },
    ],
    priorities: ["Validate payload + thermal requirements", "Align on lanes, volume, and carrier constraints"],
    playbooks: ["Confirm details with customer", "Draft provisional packout options"],
  };
}


