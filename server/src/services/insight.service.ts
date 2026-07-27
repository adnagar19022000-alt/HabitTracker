import { GoogleGenAI } from "@google/genai";
import { Habit } from "../models/habit.model";
import { Entry } from "../models/entry.model";
import { Insight } from "../models/insight.model";

// Initialize the Gemini AI client using your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateWeeklyInsight(userId: string) {
  // 1. Calculate the date range for the last 7 days
  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodEnd.getDate() - 7);

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

  const prompt = `
    You are an encouraging habit-tracking coach. 
    Look at your client's data for the last 7 days:
    - Active Habits: \n${habitSummary}
    - Total times they checked in to a habit this week: ${entryCount}
    
    Write a short, highly motivating 2-paragraph summary of their week. 
    In the first paragraph, praise their effort. 
    In the second paragraph, give them a gentle, actionable tip to keep their momentum going next week.
    Do not use generic AI greetings, just give the insight directly.
  `;

  // 4. Send the prompt to Gemini 2.5 Flash
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const aiContent = response.text || "Keep up the great work!";

  // 5. Save the generated insight to the database
  const newInsight = await Insight.create({
    userId,
    periodStart,
    periodEnd,
    cadence: "weekly",
    content: aiContent,
  });

  return newInsight;
}

export async function getUserInsights(userId: string) {
  // Fetch all past insights, newest first
  return await Insight.find({ userId }).sort({ createdAt: -1 }).lean();
}