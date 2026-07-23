import { Request, Response } from "express";
import * as habitService from "../services/habit.service";
import { calculateStreak } from "../services/streak.service";

export async function createHabitHandler(req: Request, res: Response) {
  try {
    const habit = await habitService.createHabit(req.user!.id, req.body);
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({
      error: { code: "CREATE_FAILED", message: (error as Error).message },
    });
  }
}

export async function listHabitsHandler(req: Request, res: Response) {
  const habits = await habitService.listHabits(req.user!.id);
  res.status(200).json(habits);
}

export async function getHabitHandler(req: Request, res: Response) {
  const habitId = req.params.id as string;
  const habit = await habitService.getHabitById(req.user!.id, habitId);
  if (!habit) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Habit not found" },
    });
  }

  const streak = await calculateStreak(habit);

  res.status(200).json({
    ...habit.toObject(),
    streak,
  });
}

export async function getHabitStreakHandler(req: Request, res: Response) {
  const habitId = req.params.id as string;
  const habit = await habitService.getHabitById(req.user!.id, habitId);
  if (!habit) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Habit not found" },
    });
  }

  const streak = await calculateStreak(habit);
  res.status(200).json(streak);
}

export async function updateHabitHandler(req: Request, res: Response) {
  const habitId = req.params.id as string;
  const habit = await habitService.updateHabit(req.user!.id, habitId, req.body);
  if (!habit) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Habit not found" },
    });
  }
  res.status(200).json(habit);
}

export async function archiveHabitHandler(req: Request, res: Response) {
  const habitId = req.params.id as string;
  const habit = await habitService.archiveHabit(req.user!.id, habitId);
  if (!habit) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Habit not found" },
    });
  }
  res.status(200).json(habit);
}