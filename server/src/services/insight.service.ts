import { GoogleGenAI } from "@google/genai";
import { Habit } from "../models/habit.model";
import { Entry } from "../models/entry.model";
import { Insight } from "../models/insight.model";

// Initialize the Gemini AI client using your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInsight(
  userId: string,
  cadence: "daily" | "weekly" | "monthly" | "custom" = "weekly",
  customPrompt?: string
) {
  // 1. Calculate the date range based on cadence
  const periodEnd = new Date();
  const periodStart = new Date();

  switch (cadence) {
    case "daily":
      periodStart.setDate(periodEnd.getDate() - 1);
      break;
    case "weekly":
      periodStart.setDate(periodEnd.getDate() - 7);
      break;
    case "monthly":
      periodStart.setMonth(periodEnd.getMonth() - 1);
      break;
    case "custom":
      // For custom questions, look at the last 30 days of data
      periodStart.setDate(periodEnd.getDate() - 30);
      break;
  }

  // 2. Fetch the user's habits and recent check-ins
  const habits = await Habit.find({ userId, archived: false }).lean();
  const entries = await Entry.find({
    userId,
    date: { $gte: periodStart, $lte: periodEnd },
  }).lean();

  if (habits.length === 0) {
    throw new Error("You need to create some habits before generating insights!");
  }

  // 3. Prepare the data for the AI to read
  const habitSummary = habits.map((h) => `- ${h.title} (${h.category})`).join("\n");
  const entryCount = entries.length;

  // 4. Build the prompt based on cadence
  let prompt: string;

  if (cadence === "custom" && customPrompt) {
    prompt = `
      You are a helpful habit-tracking coach. Your client has asked you a question.
      Here is their habit data from the last 30 days:
      - Active Habits:\n${habitSummary}
      - Total check-ins in the last 30 days: ${entryCount}

      Their question: "${customPrompt}"

      Answer their question directly and helpfully based on their data.
      Be specific and actionable. Do not use generic AI greetings.
    `;
  } else {
    const periodLabel =
      cadence === "daily" ? "today" : cadence === "weekly" ? "the last 7 days" : "the last month";

    prompt = `
      You are an encouraging habit-tracking coach.
      Look at your client's data for ${periodLabel}:
      - Active Habits:\n${habitSummary}
      - Total times they checked in to a habit during this period: ${entryCount}

      Write a short, highly motivating 2-paragraph summary of their ${cadence} progress.
      In the first paragraph, praise their effort.
      In the second paragraph, give them a gentle, actionable tip to keep their momentum going.
      Do not use generic AI greetings, just give the insight directly.
    `;
  }

  // 5. Send the prompt to Gemini
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const aiContent = response.text || "Keep up the great work!";

  // 6. Save the generated insight to the database
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