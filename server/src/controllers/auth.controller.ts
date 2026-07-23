import { Request, Response } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export async function getMeHandler(req: Request, res: Response) {
  // req.user is already populated by the `authenticate` middleware
  res.status(200).json(req.user);
}

export async function updateMeHandler(req: Request, res: Response) {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: { code: "VALIDATION_FAILED", message: "name is required" },
    });
  }

  try {
    const updated = await auth.api.updateUser({
      body: { name },
      headers: fromNodeHeaders(req.headers),
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({
      error: { code: "UPDATE_FAILED", message: (error as Error).message },
    });
  }
}

export async function changePasswordHandler(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_FAILED",
        message: "currentPassword and newPassword are required",
      },
    });
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: fromNodeHeaders(req.headers),
    });
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(400).json({
      error: { code: "PASSWORD_CHANGE_FAILED", message: (error as Error).message },
    });
  }
}

export async function deleteMeHandler(req: Request, res: Response) {
  try {
    await auth.api.deleteUser({
      body: {},
      headers: fromNodeHeaders(req.headers),
    });
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(400).json({
      error: { code: "DELETE_FAILED", message: (error as Error).message },
    });
  }
}