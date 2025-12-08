# Defft-AI

## LLM-backed post-meeting workflow
- Capture written or transcribed notes on `PostMeeting.tsx`, then move through the three-step wizard.
- Step 3 now calls `/api/reports/post-meeting` which invokes the OpenAI Responses API and generates an editable `.docx` brief.
- The backend ensures payload validation with `zod`, builds a structured JSON report (with a fallback when the LLM fails), and renders a Word document via `docx`.
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
| `OPENAI_API_KEY` | Yes | API key used by the backend to call the ChatGPT Responses API. |
| `OPENAI_MODEL` | No | Optional override for the LLM (defaults to `gpt-4.1-mini`). |
| `ALLOWED_ORIGINS` | No | Comma-separated list of origins permitted by CORS (defaults to allowing all origins in development). |
| `VITE_API_BASE_URL` | No | Client-side override for the API server base URL. Leave empty in production so relative `/api` calls work. |

## API surface
- `POST /api/reports/post-meeting`
  - Body: `{ "notes": "your detailed meeting summary" }`
  - Validates inputs, sends them to OpenAI, produces a structured set of insights, and returns a Word document (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`) ready for editing.
