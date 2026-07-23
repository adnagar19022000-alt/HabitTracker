import { AdminUserView } from "../models/user.model";
import { Habit } from "../models/habit.model";
import { Entry } from "../models/entry.model";

export async function listUsers(search?: string) {
  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await AdminUserView.find(filter).sort({ createdAt: -1 }).lean();

  // Attach habit count per user
  const userIds = users.map((u) => String(u._id));
  const habitCounts = await Habit.aggregate([
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

export async function getUserDetail(userId: string) {
  const user = await AdminUserView.findById(userId).lean();
  if (!user) return null;

  const habitCount = await Habit.countDocuments({ userId });
  const entryCount = await Entry.countDocuments({ userId });

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

export async function getPlatformStats() {
  const totalUsers = await AdminUserView.countDocuments({});
  const totalHabits = await Habit.countDocuments({ archived: false });

  // Category breakdown
  const categoryAgg = await Habit.aggregate([
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

  const recentEntryCount = await Entry.countDocuments({
    date: { $gte: thirtyDaysAgo },
  });

  const expectedLogs = totalHabits * 30;
  const averageCompletionRate =
    expectedLogs > 0 ? Math.round((recentEntryCount / expectedLogs) * 100) : 0;

  return {
    totalUsers,
    totalHabits,
    averageCompletionRate,
    popularCategories,
  };
}