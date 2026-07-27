"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserDetail = getUserDetail;
exports.getPlatformStats = getPlatformStats;
const user_model_1 = require("../models/user.model");
const habit_model_1 = require("../models/habit.model");
const entry_model_1 = require("../models/entry.model");
async function listUsers(search) {
    const filter = search
        ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        }
        : {};
    const users = await user_model_1.AdminUserView.find(filter).sort({ createdAt: -1 }).lean();
    // Attach habit count per user
    const userIds = users.map((u) => String(u._id));
    const habitCounts = await habit_model_1.Habit.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(habitCounts.map((h) => [h._id, h.count]));
    return users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        joinDate: u.createdAt,
        habitCount: countMap.get(String(u._id)) ?? 0,
    }));
}
async function getUserDetail(userId) {
    const user = await user_model_1.AdminUserView.findById(userId).lean();
    if (!user)
        return null;
    const habitCount = await habit_model_1.Habit.countDocuments({ userId });
    const entryCount = await entry_model_1.Entry.countDocuments({ userId });
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
        habitCount,
        entryCount,
    };
}
async function getPlatformStats() {
    const totalUsers = await user_model_1.AdminUserView.countDocuments({});
    const totalHabits = await habit_model_1.Habit.countDocuments({ archived: false });
    // Category breakdown
    const categoryAgg = await habit_model_1.Habit.aggregate([
        { $match: { archived: false } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);
    const popularCategories = categoryAgg.map((c) => ({
        category: c._id,
        count: c.count,
    }));
    // Approximate average completion rate: entries logged in the last 30 days
    // vs. (active habits × 30). This is a simplification — it doesn't account
    // for each habit's individual targetFrequency (daily vs 2x/week etc.),
    // so treat it as a rough platform health signal, not an exact figure.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntryCount = await entry_model_1.Entry.countDocuments({
        date: { $gte: thirtyDaysAgo },
    });
    const expectedLogs = totalHabits * 30;
    const averageCompletionRate = expectedLogs > 0 ? Math.round((recentEntryCount / expectedLogs) * 100) : 0;
    return {
        totalUsers,
        totalHabits,
        averageCompletionRate,
        popularCategories,
    };
}
