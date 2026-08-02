import { Request, Response } from "express";
import { generateInsight, getUserInsights } from "../services/insight.service";

export async function getInsightsHandler(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const insights = await getUserInsights(userId);
    res.json(insights);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
}

export async function generateInsightHandler(req: Request, res: Response) {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { cadence = "weekly", customPrompt } = req.body || {};
    const insight = await generateInsight(userId, cadence, customPrompt);
    res.json(insight);
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
}