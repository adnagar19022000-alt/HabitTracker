"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const entry_controller_1 = require("../controllers/entry.controller");
const router = (0, express_1.Router)({ mergeParams: true });
/**
 * @openapi
 * /api/habits/{id}/entries:
 *   post:
 *     summary: Log an entry for a habit
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               value:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entry logged
 *       404:
 *         description: Habit not found
 *       409:
 *         description: Already logged for this day
 */
router.post("/", authenticate_1.authenticate, entry_controller_1.logEntryHandler);
/**
 * @openapi
 * /api/habits/{id}/entries:
 *   get:
 *     summary: Get entry history for a habit
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
 *         description: List of entries
 */
router.get("/", authenticate_1.authenticate, entry_controller_1.getEntriesHandler);
exports.default = router;
