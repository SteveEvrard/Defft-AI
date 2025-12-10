import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const DEFAULT_RECIPIENT = "steve@defft.ai";

type SendReportEmailParams = {
  fileName: string;
  fileBuffer: Buffer;
  notes: string;
};

let cachedTransporter: Transporter | null = null;

const REQUIRED_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_OAUTH_CLIENT_ID",
  "SMTP_OAUTH_CLIENT_SECRET",
  "SMTP_OAUTH_REFRESH_TOKEN",
] as const;

function ensureMailerConfig() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Email transport is missing: ${missing.join(", ")}`);
  }
}

function getBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  ensureMailerConfig();

  const host = process.env.SMTP_HOST as string;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = getBoolean(process.env.SMTP_SECURE, port === 465);
  const user = process.env.SMTP_USER as string;
  const clientId = process.env.SMTP_OAUTH_CLIENT_ID as string;
  const clientSecret = process.env.SMTP_OAUTH_CLIENT_SECRET as string;
  const refreshToken = process.env.SMTP_OAUTH_REFRESH_TOKEN as string;
  const accessToken = process.env.SMTP_OAUTH_ACCESS_TOKEN;
  const expiresRaw = process.env.SMTP_OAUTH_ACCESS_TOKEN_EXPIRES;
  const expires = expiresRaw ? Number(expiresRaw) : undefined;

  const auth: SMTPTransport.Options["auth"] = {
    type: "OAuth2",
    user,
    clientId,
    clientSecret,
    refreshToken,
  };

  if (accessToken) {
    auth.accessToken = accessToken;
  }
  if (expires !== undefined && Number.isFinite(expires)) {
    auth.expires = expires;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
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

