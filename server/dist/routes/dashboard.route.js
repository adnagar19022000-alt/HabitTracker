"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
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
router.get("/", authenticate_1.authenticate, dashboard_controller_1.getDashboardData);
exports.default = router;
