# Defft-AI

## AI-backed post-meeting workflow
- Capture written or transcribed notes on `PostMeeting.tsx`, then move through the three-step wizard.
- Step 3 now calls `/api/reports/post-meeting` which invokes the model via the Responses API and generates an editable `.docx` packaging report.
- The backend ensures payload validation with `zod`, builds a structured JSON report focused on packaging solutions (with a fallback when the model fails), and renders a Word document via `docx`.
- The UI provides optimistic validation (minimum note length), loading/error states, and automatically downloads the returned file for internal review.

## Running the stack locally
1. `pnpm install`
2. Create a `.env` file (or export the variables another way) and add the environment variables listed below.
3. Start the API server: `pnpm run server:dev`
4. In a second terminal, start the client: `pnpm run dev`
5. When developing on different ports, set `VITE_API_BASE_URL=http://localhost:3000` so the client talks to the Express server.

For production builds run `pnpm run build` followed by `pnpm run start`, which bundles the Vite client and the Express server together.

## Environment variables
| Name | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | API key used by the backend to call the Responses API. |
| `OPENAI_MODEL` | No | Optional override for the model (defaults to `gpt-4.1-mini`). |
| `ALLOWED_ORIGINS` | No | Comma-separated list of origins permitted by CORS (defaults to allowing all origins in development). |
| `VITE_API_BASE_URL` | No | Client-side override for the API server base URL. Leave empty in production so relative `/api` calls work. |
| `SMTP_HOST` | Yes | SMTP server hostname (e.g., `smtp.gmail.com`, `smtp.office365.com`, `smtp.sendgrid.net`). |
| `SMTP_PORT` | Yes | SMTP server port (typically `587` for STARTTLS or `465` for SSL). |
| `SMTP_USER` | Yes | Email address or username for SMTP authentication. |
| `SMTP_PASSWORD` | Yes | Password for SMTP authentication. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833). |
| `REPORT_RECIPIENT_EMAIL` | No | Email address where reports are sent. |
| `REPORT_SENDER_EMAIL` | No | Email address shown as the sender (defaults to `SMTP_USER` or `reports@defft.ai`). |

## API surface
- `POST /api/reports/post-meeting`
  - Body: `{ "notes": "your detailed meeting summary" }`
  - Validates inputs, sends them to the model, produces a structured set of insights, and returns a Word document (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`) ready for editing.
