import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import {
  listUsersHandler,
  getUserDetailHandler,
  getPlatformStatsHandler,
} from "../controllers/admin.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: List all users (admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by name or email
 *     responses:
 *       200:
 *         description: List of users with habit counts
 *       403:
 *         description: Forbidden — non-admin
 */
router.get("/users", authenticate, authorize("admin"), listUsersHandler);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a specific user's detail (admin only, aggregate data only — not their raw habit/entry records)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User detail
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden — non-admin
 */
router.get("/users/:id", authenticate, authorize("admin"), getUserDetailHandler);

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     summary: Platform-wide aggregate stats (admin only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Aggregate stats
 *       403:
 *         description: Forbidden — non-admin
 */
router.get("/stats", authenticate, authorize("admin"), getPlatformStatsHandler);

export default router;