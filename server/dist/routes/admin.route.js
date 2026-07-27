"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
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
router.get("/users", authenticate_1.authenticate, (0, authorize_1.authorize)("admin"), admin_controller_1.listUsersHandler);
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
router.get("/users/:id", authenticate_1.authenticate, (0, authorize_1.authorize)("admin"), admin_controller_1.getUserDetailHandler);
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
router.get("/stats", authenticate_1.authenticate, (0, authorize_1.authorize)("admin"), admin_controller_1.getPlatformStatsHandler);
exports.default = router;
