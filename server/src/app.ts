import express, { Application } from "express";
import cors from "cors";
import healthRoute from "./routes/health.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import habitRoute from "./routes/habit.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./functions/docs/swagger";
import entryStandaloneRoute from "./routes/entryStandalone.route";
import dashboardRoute from "./routes/dashboard.route";
import authMeRoute from "./routes/auth.me.route";
import adminRoute from "./routes/admin.route";
const app: Application = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use("/api/auth/me", express.json());
app.use("/api/auth/password", express.json());
app.use("/api/auth", authMeRoute);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/health", healthRoute);
app.use("/api/habits", habitRoute);
app.use("/api/entries", entryStandaloneRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/admin", adminRoute);
export default app;