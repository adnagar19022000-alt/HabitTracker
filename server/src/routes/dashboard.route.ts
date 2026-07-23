import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { getDashboardData } from "../controllers/dashboard.controller";

const router = Router();

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     summary: Fetch aggregated data for Home Dashboard (day-strip, completion gauge, habits, mini heatmaps)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *         description: Date key in YYYY-MM-DD format (defaults to today)
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getDashboardData);

export default router;