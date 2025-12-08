import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { z } from "zod";
import { getOpenAIClient } from "../lib/openai-client.js";

const ReportSchema = z.object({
  executiveSummary: z.string(),
  situationOverview: z.string(),
  packagingSignals: z
    .array(
      z.object({
        label: z.string(),
        detail: z.string(),
      })
    )
    .min(1),
  recommendations: z
    .array(
      z.object({
        title: z.string(),
        rationale: z.string(),
        impact: z.string(),
      })
    )
    .min(1),
  riskWatchouts: z
    .array(
      z.object({
        risk: z.string(),
        mitigation: z.string(),
      })
    )
    .min(1),
  nextSteps: z
    .array(
      z.object({
        owner: z.string(),
        action: z.string(),
        due: z.string(),
      })
    )
    .min(1),
});

type StructuredReport = z.infer<typeof ReportSchema>;

const responseShapeDescription = JSON.stringify(
  {
    executiveSummary: "string",
    situationOverview: "string",
    packagingSignals: [{ label: "string", detail: "string" }],
    recommendations: [{ title: "string", rationale: "string", impact: "string" }],
    riskWatchouts: [{ risk: "string", mitigation: "string" }],
    nextSteps: [{ owner: "string", action: "string", due: "string" }],
  },
  null,
  2
);

type HeadingLevelValue = (typeof HeadingLevel)[keyof typeof HeadingLevel];

export async function generatePostMeetingReport(notes: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const sanitizedNotes = notes.trim().slice(0, 5000);
  const structured = await buildStructuredBrief(sanitizedNotes);
  const buffer = await createWordDocument(structured, sanitizedNotes);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return {
    fileName: `post-meeting-brief-${timestamp}.docx`,
    fileBuffer: buffer,
  };
}

async function buildStructuredBrief(notes: string): Promise<StructuredReport> {
  try {
    const client = getOpenAIClient();
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

    const response = await client.responses.create({
      model,
      temperature: 0.3,
      input: [
        {
          role: "system",
          content: `You are a post-meeting analyst for a packaging solutions team. Return thoughtful, specific insights the team can edit together. Respond with valid JSON only (no prose) and follow this shape:\n${responseShapeDescription}`,
        },
        {
          role: "user",
          content: `Meeting summary:\n"""${notes}"""`,
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

    const parsed = ReportSchema.safeParse(JSON.parse(rawPayload));
    if (!parsed.success) {
      throw new Error("AI response failed schema validation");
    }

    return parsed.data;
  } catch (error) {
    console.error("Failed to build structured brief", error);
    return buildFallbackBrief(notes);
  }
}

function buildFallbackBrief(notes: string): StructuredReport {
  const truncated = notes.length > 320 ? `${notes.slice(0, 320)}…` : notes;

  return {
    executiveSummary: `Captured opportunity: ${truncated || "context unavailable"}.`,
    situationOverview:
      "The customer is looking for guidance on cold-chain assurance, freight efficiency, and sustainable packaging upgrades.",
    packagingSignals: [
      { label: "Customer voice", detail: truncated || "Need to confirm meeting summary." },
      { label: "Supply chain goal", detail: "Stabilize temperature and reduce damage risk during parcel transit." },
      { label: "Commercial target", detail: "Unlock faster follow-up sequencing with a ready-to-edit briefing doc." },
    ],
    recommendations: [
      {
        title: "Validate lane + payload assumptions",
        rationale: "Confirm packout type, coolant duration, and carrier service to align kit to real constraints.",
        impact: "Ensures right-sizing of materials and prevents over-engineering the solution.",
      },
      {
        title: "Pair insulation with cost modeling",
        rationale: "Overlay dim-weight impact with FedEx/UPS rate tables to show savings or overruns.",
        impact: "Provides finance-backed justification for moving forward.",
      },
      {
        title: "Pre-select supplier bench",
        rationale: "Shortlist two qualified cold chain partners and a rapid prototyping option.",
        impact: "Keeps the customer engagement focused and compresses sourcing timelines.",
      },
    ],
    riskWatchouts: [
      {
        risk: "Insufficient detail on thermal profile",
        mitigation: "Request validation samples or lab data before finalizing recommendations.",
      },
      {
        risk: "Delayed action items",
        mitigation: "Assign owners and due dates immediately following distribution of the brief.",
      },
    ],
    nextSteps: [
      { owner: "Account Lead", action: "Confirm payload, coolant, and carrier constraints with customer", due: "Next 2 business days" },
      { owner: "Packaging SME", action: "Draft kit comparison with pros/cons and cost", due: "End of week" },
      { owner: "Ops Enablement", action: "Line up supplier calls and sample requests", due: "Early next week" },
    ],
  };
}

async function createWordDocument(report: StructuredReport, notes: string) {
  const doc = new Document({
    creator: "Defft.ai",
    description: "Generated post-meeting briefing based on captured summary.",
    title: "Defft Post-Meeting Brief",
    sections: [
      {
        properties: {},
        children: [
          createHeading("Defft Post-Meeting Brief", HeadingLevel.TITLE),
          createBodyParagraph(`Generated ${new Date().toLocaleString()}`),
          createHeading("Executive Summary"),
          createBodyParagraph(report.executiveSummary),
          createHeading("Situation Overview"),
          createBodyParagraph(report.situationOverview),
          createHeading("Customer Signals"),
          ...report.packagingSignals.map((signal) => createBulletParagraph(`${signal.label}: ${signal.detail}`)),
          createHeading("Recommended Plays"),
          ...report.recommendations.map((rec) =>
            createBulletParagraph(`${rec.title} — ${rec.rationale} (Impact: ${rec.impact})`)
          ),
          createHeading("Risks & Watchouts"),
          ...report.riskWatchouts.map((risk) => createBulletParagraph(`${risk.risk} — ${risk.mitigation}`)),
          createHeading("Next Steps"),
          ...report.nextSteps.map((step) =>
            createBulletParagraph(`${step.owner}: ${step.action} (Due: ${step.due})`)
          ),
          createHeading("Raw Notes"),
          createBodyParagraph(notes || "No notes were captured."),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function createHeading(text: string, level: HeadingLevelValue = HeadingLevel.HEADING_2) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 200, after: 120 },
  });
}

function createBodyParagraph(text: string) {
  return new Paragraph({
    children: [new TextRun({ text })],
    spacing: { after: 160 },
  });
}

function createBulletParagraph(text: string) {
  return new Paragraph({
    children: [new TextRun(text)],
    bullet: { level: 0 },
    spacing: { after: 80 },
  });
}

