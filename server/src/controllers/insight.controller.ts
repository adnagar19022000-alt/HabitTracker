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
    let message = error.message || "Failed to generate insight";
    
    // Check if the error is a raw AI service error (e.g. 503 UNAVAILABLE, 429 Resource Exhausted)
    if (message.includes("503") || message.includes("UNAVAILABLE") || message.includes("overloaded")) {
      message = "AI service is temporarily unavailable. Please try again later.";
    } else if (message.includes("429") || message.includes("quota")) {
      message = "AI service is currently busy. Please try again in a few minutes.";
    }
    
    // Determine appropriate status code
    const status = message.includes("unavailable") || message.includes("busy") ? 503 : 400;
    
    res.status(status).json({ error: { message } });
  }
}