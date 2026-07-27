"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEntry = logEntry;
exports.getEntriesForHabit = getEntriesForHabit;
exports.deleteEntry = deleteEntry;
const entry_model_1 = require("../models/entry.model");
const habit_model_1 = require("../models/habit.model");
async function logEntry(userId, habitId, data) {
    // Confirm the habit exists AND belongs to this user before logging against it
    const habit = await habit_model_1.Habit.findOne({ _id: habitId, userId });
    if (!habit) {
        throw new Error("HABIT_NOT_FOUND");
    }
    return entry_model_1.Entry.create({
        userId,
        habitId,
        date: data.date ?? new Date(),
        value: data.value,
        note: data.note,
    });
}
async function getEntriesForHabit(userId, habitId) {
    return entry_model_1.Entry.find({ userId, habitId }).sort({ date: -1 });
}
async function deleteEntry(userId, entryId) {
    return entry_model_1.Entry.findOneAndDelete({ _id: entryId, userId });
}
