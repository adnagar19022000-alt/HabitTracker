"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWeeklyInsight = generateWeeklyInsight;
exports.getUserInsights = getUserInsights;
const genai_1 = require("@google/genai");
const habit_model_1 = require("../models/habit.model");
const entry_model_1 = require("../models/entry.model");
const insight_model_1 = require("../models/insight.model");
// Initialize the Gemini AI client using your API key
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function generateWeeklyInsight(userId) {
    // 1. Calculate the date range for the last 7 days
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodEnd.getDate() - 7);
    // 2. Fetch the user's habits and recent check-ins
    const habits = await habit_model_1.Habit.find({ userId, archived: false }).lean();
    const entries = await entry_model_1.Entry.find({
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
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    const aiContent = response.text || "Keep up the great work!";
    // 5. Save the generated insight to the database
    const newInsight = await insight_model_1.Insight.create({
        userId,
        periodStart,
        periodEnd,
        cadence: "weekly",
        content: aiContent,
    });
    return newInsight;
}
async function getUserInsights(userId) {
    // Fetch all past insights, newest first
    return await insight_model_1.Insight.find({ userId }).sort({ createdAt: -1 }).lean();
}
