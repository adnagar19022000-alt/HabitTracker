import { Request, Response } from "express";
import * as entryService from "../services/entry.service";

export async function logEntryHandler(req: Request, res: Response) {
  const habitId = req.params.id as string;
  try {
    const entry = await entryService.logEntry(req.user!.id, habitId, req.body);
    res.status(201).json(entry);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "HABIT_NOT_FOUND") {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Habit not found" },
      });
    }
    // MongoDB duplicate key error code is 11000
    if ((error as any).code === 11000) {
      return res.status(409).json({
        error: { code: "DUPLICATE_ENTRY", message: "Already logged for this day" },
      });
    }
    res.status(400).json({
      error: { code: "LOG_FAILED", message },
    });
  }
}

export async function getEntriesHandler(req: Request, res: Response) {
  const habitId = req.params.id as string;
  const entries = await entryService.getEntriesForHabit(req.user!.id, habitId);
  res.status(200).json(entries);
}

export async function deleteEntryHandler(req: Request, res: Response) {
  const entryId = req.params.id as string;
  const entry = await entryService.deleteEntry(req.user!.id, entryId);
  if (!entry) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "Entry not found" },
    });
  }
  res.status(200).json({ message: "Entry deleted" });
}