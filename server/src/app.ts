import express, { Application } from "express";
import cors from "cors";
import healthRoute from "./routes/health.route";

const app: Application = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

app.use("/health", healthRoute);

export default app;