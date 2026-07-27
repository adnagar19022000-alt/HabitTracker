import { Request, Response } from "express";
import { generateWeeklyInsight, getUserInsights } from "../services/insight.service";

export async function getInsightsHandler(req: Request, res: Response) {
  try {
    // The user's ID is automatically attached to the request by Better Auth
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
    const insight = await generateWeeklyInsight(userId);
    res.json(insight);
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
}