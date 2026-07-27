"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHabit = createHabit;
exports.listHabits = listHabits;
exports.getHabitById = getHabitById;
exports.updateHabit = updateHabit;
exports.archiveHabit = archiveHabit;
const habit_model_1 = require("../models/habit.model");
async function createHabit(userId, data) {
    return habit_model_1.Habit.create({ ...data, userId });
}
async function listHabits(userId) {
    return habit_model_1.Habit.find({ userId, archived: false });
}
async function getHabitById(userId, habitId) {
    return habit_model_1.Habit.findOne({ _id: habitId, userId });
}
async function updateHabit(userId, habitId, data) {
    return habit_model_1.Habit.findOneAndUpdate({ _id: habitId, userId }, { $set: data }, { new: true });
}
async function archiveHabit(userId, habitId) {
    return habit_model_1.Habit.findOneAndUpdate({ _id: habitId, userId }, { $set: { archived: true } }, { new: true });
}
