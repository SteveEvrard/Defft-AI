import nodemailer, { type Transporter } from "nodemailer";

const DEFAULT_RECIPIENT = "steve@defft.ai";

type SendReportEmailParams = {
  fileName: string;
  fileBuffer: Buffer;
  notes: string;
};

let cachedTransporter: Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // Required environment variables
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !password) {
    throw new Error(
      "Email configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD environment variables."
    );
  }

  const portNumber = Number(port);
  if (isNaN(portNumber)) {
    throw new Error(`Invalid SMTP_PORT: ${port}. Must be a number.`);
  }

  // Port 465 uses SSL, other ports typically use STARTTLS
  const secure = portNumber === 465;

  cachedTransporter = nodemailer.createTransport({
    host,
    port: portNumber,
    secure,
    auth: {
      user,
      pass: password,
    },
    // For ports other than 465, require TLS
    ...(portNumber !== 465 && { requireTLS: true }),
  });

  return cachedTransporter;
}

export async function sendReportEmail(params: SendReportEmailParams) {
  const transporter = getTransporter();

  const to = process.env.REPORT_RECIPIENT_EMAIL?.trim() || DEFAULT_RECIPIENT;
  const from = process.env.REPORT_SENDER_EMAIL || process.env.SMTP_USER || "reports@defft.ai";

  const preview = params.notes.length > 280 ? `${params.notes.slice(0, 280)}…` : params.notes || "No notes captured.";

  await transporter.sendMail({
    from,
    to,
    subject: `Defft Post-Meeting Brief – ${new Date().toLocaleDateString()}`,
    text: [
      "Hi team,",
      "",
      "Attached is the Word brief generated from the latest captured meeting summary.",
      "",
      "Notes preview:",
      preview,
      "",
      "— Defft Automations",
    ].join("\n"),
    attachments: [
      {
        filename: params.fileName,
        content: params.fileBuffer,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ],
  });

  return { recipient: to };
}

