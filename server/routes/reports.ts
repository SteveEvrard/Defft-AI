import { Router } from "express";
import { z } from "zod";
import { sendReportEmail } from "../services/emailReport.js";
import { generatePostMeetingReport } from "../services/postMeetingReport.js";

const router = Router();

const requestSchema = z.object({
  notes: z
    .string()
    .trim()
    .min(1, { message: "Notes are required." })
    .refine((value) => value.length >= 40, {
      message: "Add a bit more detail so we can prepare the brief.",
    })
    .max(6000, { message: "Please shorten the summary to under 6,000 characters." }),
});

router.post("/post-meeting", async (req, res, next) => {
  try {
    const { notes } = requestSchema.parse(req.body ?? {});
    const report = await generatePostMeetingReport(notes);
    const { recipient } = await sendReportEmail({
      fileName: report.fileName,
      fileBuffer: report.fileBuffer,
      notes,
    });

    res.status(200).json({
      message: `Report emailed to ${recipient}.`,
      recipient,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message ?? "Invalid request.";
      return res.status(400).json({ message });
    }

    if (error instanceof Error && error.message === "OPENAI_API_KEY is not configured") {
      return res.status(500).json({ message: "Server is missing the OpenAI API key." });
    }

    next(error);
  }
});

export default router;

