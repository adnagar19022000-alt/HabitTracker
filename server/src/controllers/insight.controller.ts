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
    
    // Extract the new fields sent by the frontend
    const { cadence = "weekly", customPrompt } = req.body;
    
    // Pass them to our new upgraded service function
    const insight = await generateInsight(userId, cadence, customPrompt);
    
    res.json(insight);
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
}