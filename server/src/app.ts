import express, { Application } from "express";
import cors from "cors";
import healthRoute from "./routes/health.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app: Application = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/health", healthRoute);

export default app;