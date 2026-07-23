import { Request, Response } from "express";
import * as adminService from "../services/admin.service";

export async function listUsersHandler(req: Request, res: Response) {
  const search = req.query.search as string | undefined;
  const users = await adminService.listUsers(search);
  res.status(200).json(users);
}

export async function getUserDetailHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const user = await adminService.getUserDetail(userId);
  if (!user) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: "User not found" },
    });
  }
  res.status(200).json(user);
}

export async function getPlatformStatsHandler(req: Request, res: Response) {
  const stats = await adminService.getPlatformStats();
  res.status(200).json(stats);
}