import { GoogleGenAI } from "@google/genai";
import { Habit } from "../models/habit.model";
import { Entry } from "../models/entry.model";
import { Insight } from "../models/insight.model";

// Initialize the Gemini AI client using your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInsight(
  userId: string,
  cadence: "daily" | "weekly" | "monthly" | "custom",
  customPrompt?: string
) {
  // 1. Calculate the date range based on the requested cadence
  const periodEnd = new Date();
  const periodStart = new Date();
  
  if (cadence === "daily") periodStart.setDate(periodEnd.getDate() - 1);
  else if (cadence === "monthly") periodStart.setDate(periodEnd.getDate() - 30);
  else periodStart.setDate(periodEnd.getDate() - 7); // Default to 7 days for weekly/custom

  // 2. Fetch the user's habits and recent check-ins
  const habits = await Habit.find({ userId, archived: false }).lean();
  const entries = await Entry.find({
    userId,
    date: { $gte: periodStart, $lte: periodEnd }
  }).lean();

  if (habits.length === 0) {
    throw new Error("You need to create some habits before generating insights!");
  }

  // 3. Prepare the data for the AI to read
  const habitSummary = habits.map(h => `- ${h.title} (${h.category})`).join("\n");
  const entryCount = entries.length;

  // 4. Build the dynamic prompt
  let prompt = `
    You are an encouraging habit-tracking coach. 
    Look at your client's data for their requested time period:
    - Active Habits: \n${habitSummary}
    - Total check-ins during this period: ${entryCount}
  `;

  if (customPrompt && customPrompt.trim() !== "") {
    // If the user asked a specific question
    prompt += `\n\nThe client has asked you a specific question: "${customPrompt}"\n`;
    prompt += `Write a helpful, direct response to their question based on their habit data. Do not use generic AI greetings. Keep it under 3 paragraphs.`;
  } else {
    // Standard periodic review
    prompt += `\n\nWrite a short, highly motivating 2-paragraph summary of their progress. 
    In the first paragraph, praise their effort. 
    In the second paragraph, give them a gentle, actionable tip.
    Do not use generic AI greetings.`;
  }

  // 5. Send the prompt to Gemini
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const aiContent = response.text || "Keep up the great work!";

  // 6. Save the generated insight
  const newInsight = await Insight.create({
    userId,
    periodStart,
    periodEnd,
    cadence,
    content: aiContent,
  });

  return newInsight;
}

export async function getUserInsights(userId: string) {
  // Fetch all past insights, newest first
  return await Insight.find({ userId }).sort({ createdAt: -1 }).lean();
}