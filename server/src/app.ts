import express, { Application } from "express";
import cors from "cors";
import healthRoute from "./routes/health.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import habitRoute from "./routes/habit.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./functions/docs/swagger";
const app: Application = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use("/health", healthRoute);
app.use("/api/habits", habitRoute);

export default app;