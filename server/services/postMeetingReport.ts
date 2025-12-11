import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { z } from "zod";
import { getOpenAIClient } from "../lib/openai-client.js";
import type { ContextPreview } from "./contextPreview.js";

const SolutionTableRow = z.object({
  layer: z.string(),
  component: z.string(),
  materialSpec: z.string(),
  purpose: z.string(),
});

const ProductSpecRow = z.object({
  product: z.string(),
  spec: z.string(),
  manufacturers: z.string(),
});

const EprImpactRow = z.object({
  solution: z.string(),
  materialWeight: z.string(),
  eprImpact: z.string(),
  notes: z.string(),
});

const SolutionSchema = z.object({
  title: z.string(),
  snapshot: z.array(z.string()).min(1),
  layerStructure: z.array(SolutionTableRow).min(1),
  productSpecs: z.array(ProductSpecRow).min(1),
  expectedOutcome: z.array(z.string()).min(1),
});

const ReportSchema = z.object({
  reportTitle: z.string(),
  application: z.string(),
  currentFilm: z.string(),
  executiveSummary: z.array(z.string()).min(1),
  currentState: z.array(z.string()).min(1),
  solutions: z.array(SolutionSchema).min(1),
  eprImpact: z.array(EprImpactRow).min(1),
  nextStepsChecklist: z.array(z.string()).min(1),
  nextStepsAdditional: z.array(z.string()).min(1),
});

type StructuredReport = z.infer<typeof ReportSchema>;

const responseShapeDescription = JSON.stringify(
  {
    reportTitle: "string",
    application: "string",
    currentFilm: "string",
    executiveSummary: ["string"],
    currentState: ["string"],
    solutions: [
      {
        title: "string",
        snapshot: ["string"],
        layerStructure: [{ layer: "string", component: "string", materialSpec: "string", purpose: "string" }],
        productSpecs: [{ product: "string", spec: "string", manufacturers: "string" }],
        expectedOutcome: ["string"],
      },
    ],
    eprImpact: [{ solution: "string", materialWeight: "string", eprImpact: "string", notes: "string" }],
    nextStepsChecklist: ["string"],
    nextStepsAdditional: ["string"],
  },
  null,
  2
);

type HeadingLevelValue = (typeof HeadingLevel)[keyof typeof HeadingLevel];

export async function generatePostMeetingReport(notes: string, context?: ContextPreview) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const sanitizedNotes = notes.trim().slice(0, 5000);
  const structured = await buildStructuredBrief(sanitizedNotes, context);
  const buffer = await createWordDocument(structured, sanitizedNotes);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return {
    fileName: `post-meeting-brief-${timestamp}.docx`,
    fileBuffer: buffer,
  };
}

async function buildStructuredBrief(notes: string, context?: ContextPreview): Promise<StructuredReport> {
  try {
    const client = getOpenAIClient();
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

    const response = await client.responses.create({
      model,
      temperature: 0.25,
      input: [
        {
          role: "system",
          content: `You are a packaging solutions consultant generating a stretch film optimization report. Return valid JSON ONLY (no prose, no markdown). Use the shape shown (values are placeholders only, DO NOT reuse them):\n${responseShapeDescription}\n\nGuidance:\n- Use ONLY the meeting summary for content; do not copy any example text.\n- Always produce 3 solutions (A/B/C) with concise titles tied to the summary.\n- Keep bullets short and action-oriented (max ~18 words).\n- Layer structure must have 3 rows: Primary, Secondary, Tertiary.\n- Product specs table must include product, spec, manufacturers.\n- EPR impact rows should align to the solutions.\n- Next steps: checklist items (short) and additional recommended steps (short).\n- Do NOT include markdown, quotes, or extra text beyond the JSON.`,
        },
        {
          role: "user",
          content:
            context && (context.chips?.length || context.priorities?.length || context.playbooks?.length)
              ? `Meeting summary:\n"""${notes}"""\n\nUser-curated packaging signals and priorities (authoritative; prefer these over your own extractions):\n${JSON.stringify(
                  context,
                  null,
                  2
                )}`
              : `Meeting summary:\n"""${notes}"""`,
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
  const truncated = notes.length > 320 ? `${notes.slice(0, 320)}…` : notes || "Captured summary unavailable.";
  return {
    reportTitle: "Stretch Film Optimization Report",
    application: "Stretch Film Optimization",
    currentFilm: "Current film not specified",
    executiveSummary: [
      `Captured summary: ${truncated}`,
      "Three optimized film options proposed based on captured notes.",
    ],
    currentState: [
      truncated,
      "Key risks and drivers derived from the provided summary.",
    ],
    solutions: [
      {
        title: "Solution A",
        snapshot: ["Tailored to primary needs from the summary.", "Emphasizes compatibility and stability."],
        layerStructure: [
          { layer: "Primary", component: "Stretch Film", materialSpec: "TBD", purpose: "Align to puncture/tear needs" },
          { layer: "Secondary", component: "Application", materialSpec: "TBD", purpose: "Match machine/throughput requirements" },
          { layer: "Tertiary", component: "Wrap Pattern", materialSpec: "TBD", purpose: "Containment consistency" },
        ],
        productSpecs: [{ product: "Film", spec: "TBD", manufacturers: "TBD" }],
        expectedOutcome: ["Improved performance tailored to summary.", "Baseline option to compare against."],
      },
      {
        title: "Solution B",
        snapshot: ["Balances gauge reduction and containment.", "Targets EPR and weight reduction if noted."],
        layerStructure: [
          { layer: "Primary", component: "Stretch Film", materialSpec: "TBD", purpose: "Gauge/weight optimization" },
          { layer: "Secondary", component: "Application", materialSpec: "TBD", purpose: "Force-to-wrap alignment" },
          { layer: "Tertiary", component: "Wrap Pattern", materialSpec: "TBD", purpose: "Economy and break reduction" },
        ],
        productSpecs: [{ product: "Film", spec: "TBD", manufacturers: "TBD" }],
        expectedOutcome: ["Material savings where applicable.", "Supports EPR and stability goals."],
      },
      {
        title: "Solution C",
        snapshot: ["Aggressive optimization for EPR and performance.", "Assumes readiness for material change."],
        layerStructure: [
          { layer: "Primary", component: "Stretch Film", materialSpec: "TBD", purpose: "High-performance resin profile" },
          { layer: "Secondary", component: "Application", materialSpec: "TBD", purpose: "Engineered for down-gauge" },
          { layer: "Tertiary", component: "Wrap Pattern", materialSpec: "TBD", purpose: "Prevent puncture starts" },
        ],
        productSpecs: [{ product: "Film", spec: "TBD", manufacturers: "TBD" }],
        expectedOutcome: ["Strongest EPR impact if applicable.", "Maintains performance while reducing weight."],
      },
    ],
    eprImpact: [
      { solution: "Solution A", materialWeight: "TBD", eprImpact: "TBD", notes: "Derived from summary" },
      { solution: "Solution B", materialWeight: "TBD", eprImpact: "TBD", notes: "Derived from summary" },
      { solution: "Solution C", materialWeight: "TBD", eprImpact: "TBD", notes: "Derived from summary" },
    ],
    nextStepsChecklist: [
      "Validate assumptions from captured summary",
      "Confirm load weight/type and machine settings",
      "Assess environmental conditions and containment targets",
      "Align on EPR and performance objectives",
    ],
    nextStepsAdditional: [
      "Run trials for the proposed films under identical conditions",
      "Capture film weight per load for EPR savings",
      "Request vendor samples for head-to-head comparison",
    ],
  };
}

async function createWordDocument(report: StructuredReport, notes: string) {
  const doc = new Document({
    creator: "Defft.ai",
    description: "Generated packaging solutions report based on captured summary.",
    title: report.reportTitle,
    sections: [
      {
        properties: {},
        children: [
          createHeading(report.reportTitle, HeadingLevel.TITLE),
          createBodyParagraph(`Generated ${new Date().toLocaleString()}`),
          createBodyParagraph("Customer: ____________    Location: ____________    Prepared For: ____________"),
          createBodyParagraph("Prepared By: DEFFT.ai"),
          createBodyParagraph(`Application: ${report.application}`),
          createBodyParagraph(`Current Film: ${report.currentFilm}`),
          createHeading("1. Executive Summary", HeadingLevel.HEADING_2),
          ...report.executiveSummary.map(createBulletParagraph),
          createHeading("2. Current State", HeadingLevel.HEADING_2),
          ...report.currentState.map(createBulletParagraph),
          ...renderSolutions(report.solutions),
          createHeading("6. EPR Impact Analysis", HeadingLevel.HEADING_2),
          createEprTable(report.eprImpact),
          createHeading("7. Next Steps", HeadingLevel.HEADING_2),
          createHeading("A. Validation Checklist", HeadingLevel.HEADING_3),
          ...report.nextStepsChecklist.map((item) => createChecklistLine(item)),
          createHeading("B. Additional Recommended Steps", HeadingLevel.HEADING_3),
          ...report.nextStepsAdditional.map(createBulletParagraph),
          createHeading("Appendix: Raw Notes", HeadingLevel.HEADING_2),
          createBodyParagraph(notes || "No notes were captured."),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function createHeading(text: string, level: HeadingLevelValue = HeadingLevel.HEADING_2) {
  const isTitle = level === HeadingLevel.TITLE;
  const isSection = level === HeadingLevel.HEADING_2;

  return new Paragraph({
    heading: level,
    alignment: isTitle ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: isTitle
      ? { before: 200, after: 200 }
      : { before: 200, after: isSection ? 140 : 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: isTitle ? 40 : isSection ? 28 : 24,
        color: isTitle ? "000000" : "1F4E79", // dark blue for section headings
      }),
    ],
  });
}

function createBodyParagraph(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22, // 11pt
      }),
    ],
    spacing: { after: 180 },
  });
}

function createBulletParagraph(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
      }),
    ],
    bullet: { level: 0 },
    spacing: { after: 80 },
  });
}

function createChecklistLine(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `☐ ${text}`,
        size: 22,
      }),
    ],
    spacing: { after: 80 },
  });
}

function createTable(headers: string[], rows: string[][]) {
  const columnCount = headers.length;
  const defaultColumnWidth = 2400; // twips per column (approx. quarter page for 4 cols)
  const columnWidths = Array(columnCount).fill(defaultColumnWidth);

  const tableRows = [
    new TableRow({
      children: headers.map((h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  size: 22,
                  color: "1F4E79",
                }),
              ],
            }),
          ],
          shading: { fill: "F3F4F6" },
        })
      ),
    }),
    ...rows.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cell,
                        size: 22,
                      }),
                    ],
                  }),
                ],
              })
          ),
        })
    ),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
    },
    rows: tableRows,
  });
}

function renderSolutions(solutions: z.infer<typeof SolutionSchema>[]): (Paragraph | Table)[] {
  const children: (Paragraph | Table)[] = [];

  solutions.forEach((solution, idx) => {
    children.push(createHeading(`${idx + 3}. ${solution.title}`, HeadingLevel.HEADING_2));
    children.push(createHeading("Snapshot", HeadingLevel.HEADING_3));
    solution.snapshot.forEach((item: string) => children.push(createBulletParagraph(item)));

    children.push(createHeading("Layer Structure", HeadingLevel.HEADING_3));
    children.push(
      createTable(
        ["Layer", "Component", "Material/Spec", "Purpose"],
        solution.layerStructure.map((row) => [row.layer, row.component, row.materialSpec, row.purpose])
      )
    );

    children.push(createHeading("Product Specs and Manufacturer(s)", HeadingLevel.HEADING_3));
    children.push(
      createTable(
        ["Product", "Spec", "Manufacturers"],
        solution.productSpecs.map((row) => [row.product, row.spec, row.manufacturers])
      )
    );

    children.push(createHeading("Expected Outcome", HeadingLevel.HEADING_3));
    solution.expectedOutcome.forEach((item: string) => children.push(createBulletParagraph(item)));
  });

  return children;
}

function createEprTable(rows: z.infer<typeof EprImpactRow>[]) {
  return createTable(
    ["Solution", "Material Weight", "EPR Impact", "Notes"],
    rows.map((row) => [row.solution, row.materialWeight, row.eprImpact, row.notes])
  );
}

