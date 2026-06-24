import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import plansRoutes from "./routes/plans";
import meRoutes from "./routes/me";
import creditsRoutes from "./routes/credits";
import adminRoutes from "./routes/admin";
import { requireAuth } from "./middleware/requireAuth";
import { requireAdmin } from "./middleware/requireAdmin";

const app = express();

// Trust Railway/Render reverse proxy so rate limiter sees real IPs
app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json({ limit: "16kb" }));

// Rate limiter scoped to /api/plans (the expensive OpenAI calls)
const planLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: "Too many requests. Please wait a few minutes and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global lighter rate limit on all /api routes
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  message: { error: "Too many requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", globalLimiter);

// Health check — no auth required, used by Railway/Render
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", requireAuth, planLimiter, plansRoutes);
app.use("/api/me", requireAuth, meRoutes);
app.use("/api/credits", requireAuth, creditsRoutes);
app.use("/api/admin", requireAuth, requireAdmin, adminRoutes);

// 404 for unknown /api routes
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = parseInt(process.env.PORT ?? "3001", 10);
const server = app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} (${process.env.NODE_ENV ?? "development"})`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled rejection:", reason);
});

export default app;
