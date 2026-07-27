"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const entry_route_1 = __importDefault(require("./entry.route"));
const habit_controller_1 = require("../controllers/habit.controller");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/habits:
 *   post:
 *     summary: Create a new habit
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category, icon, color, targetFrequency]
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               targetFrequency:
 *                 type: object
 *     responses:
 *       201:
 *         description: Habit created
 *       401:
 *         description: Not authenticated
 */
router.post("/", authenticate_1.authenticate, habit_controller_1.createHabitHandler);
/**
 * @openapi
 * /api/habits:
 *   get:
 *     summary: List the current user's habits
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of habits
 */
router.get("/", authenticate_1.authenticate, habit_controller_1.listHabitsHandler);
/**
 * @openapi
 * /api/habits/{id}:
 *   get:
 *     summary: Get a single habit by ID (own only), includes computed current/best streak
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
 *         description: Habit found, with streak object { current, best }
 *       404:
 *         description: Habit not found
 */
router.get("/:id", authenticate_1.authenticate, habit_controller_1.getHabitHandler);
/**
 * @openapi
 * /api/habits/{id}/streak:
 *   get:
 *     summary: Get current/best streak for a habit (lightweight, standalone lookup)
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
 *         description: Streak data { current, best }
 *       404:
 *         description: Habit not found
 */
router.get("/:id/streak", authenticate_1.authenticate, habit_controller_1.getHabitStreakHandler);
/**
 * @openapi
 * /api/habits/{id}:
 *   patch:
 *     summary: Edit a habit (own only)
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
 *         description: Habit updated
 *       404:
 *         description: Habit not found
 */
router.patch("/:id", authenticate_1.authenticate, habit_controller_1.updateHabitHandler);
/**
 * @openapi
 * /api/habits/{id}:
 *   delete:
 *     summary: Archive a habit (own only) — never hard-deletes
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
 *         description: Habit archived
 *       404:
 *         description: Habit not found
 */
router.delete("/:id", authenticate_1.authenticate, habit_controller_1.archiveHabitHandler);
router.use("/:id/entries", entry_route_1.default);
exports.default = router;
