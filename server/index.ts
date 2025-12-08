import cors, { type CorsOptions } from "cors";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import reportsRouter from "./routes/reports.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORS_ERROR = "NotAllowedByCORS";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const isProduction = process.env.NODE_ENV === "production";
  const allowedOrigins: string[] =
    process.env.ALLOWED_ORIGINS?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(CORS_ERROR));
    },
  };

  app.use(cors(corsOptions));

  app.use(express.json({ limit: "1mb" }));
  app.use("/api/reports", reportsRouter);

  if (isProduction) {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    app.get("/", (_req, res) => {
      res.json({ status: "ok" });
    });
  }

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof Error && error.message === CORS_ERROR) {
      return res.status(403).json({ message: "Origin not allowed." });
    }

    console.error(error);
    return res.status(500).json({ message: "Unexpected server error." });
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  console.error("Server failed to start", error);
  process.exitCode = 1;
});
