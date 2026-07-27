"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = getDashboardData;
const habit_model_1 = require("../models/habit.model");
const entry_model_1 = require("../models/entry.model");
const streak_service_1 = require("../services/streak.service");
/**
 * GET /api/dashboard
 * Aggregated endpoint for the Home Dashboard screen
 */
async function getDashboardData(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Selected date from query param (defaults to today)
        const selectedDateStr = req.query.date || (0, streak_service_1.formatDateKey)(new Date());
        const selectedDate = new Date(selectedDateStr);
        selectedDate.setHours(0, 0, 0, 0);
        const todayStr = (0, streak_service_1.formatDateKey)(new Date());
        // 1. Generate 7-Day Calendar Strip with Explicit Typing (fixes ts(7005))
        const dayStrip = [];
        for (let i = -3; i <= 3; i++) {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + i);
            const dateKey = (0, streak_service_1.formatDateKey)(d);
            dayStrip.push({
                date: dateKey,
                dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
                dayNumber: d.getDate(),
                isToday: dateKey === todayStr,
                isSelected: dateKey === selectedDateStr,
            });
        }
        // 2. Fetch User Habits & Recent Log Entries (last 30 days)
        const habits = await habit_model_1.Habit.find({ userId, archived: false });
        const thirtyDaysAgo = new Date(selectedDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const entries = await entry_model_1.Entry.find({
            userId,
            date: { $gte: thirtyDaysAgo },
        });
        const entryMap = new Map();
        entries.forEach((e) => {
            const key = `${e.habitId}_${(0, streak_service_1.formatDateKey)(e.date)}`;
            entryMap.set(key, e);
        });
        // 3. Process Habits for Dashboard Cards
        let scheduledCount = 0;
        let completedCount = 0;
        const habitCards = habits.map((habit) => {
            const isScheduledOnSelectedDate = (0, streak_service_1.isTargetDay)(habit, selectedDate);
            const selectedDateEntryKey = `${habit._id}_${selectedDateStr}`;
            const isCompletedOnSelectedDate = entryMap.has(selectedDateEntryKey);
            if (isScheduledOnSelectedDate) {
                scheduledCount++;
                if (isCompletedOnSelectedDate) {
                    completedCount++;
                }
            }
            // Generate 7-day mini heatmap strip for this habit
            const miniHeatmap = dayStrip.map((day) => {
                const key = `${habit._id}_${day.date}`;
                return {
                    date: day.date,
                    completed: entryMap.has(key),
                };
            });
            return {
                id: habit._id,
                title: habit.title,
                description: habit.description,
                category: habit.category,
                icon: habit.icon || "⭐",
                color: habit.color || "#3498db",
                targetFrequency: habit.targetFrequency,
                isScheduledOnSelectedDate,
                isCompletedOnSelectedDate,
                miniHeatmap,
            };
        });
        const overallCompletionRate = scheduledCount > 0
            ? Math.round((completedCount / scheduledCount) * 100)
            : 0;
        res.json({
            selectedDate: selectedDateStr,
            dayStrip,
            stats: {
                scheduledHabits: scheduledCount,
                completedHabits: completedCount,
                completionRate: overallCompletionRate,
            },
            habits: habitCards,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to load dashboard data" });
    }
}
