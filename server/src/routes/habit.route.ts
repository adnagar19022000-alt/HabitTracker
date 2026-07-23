import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import entryRoute from "./entry.route";
import {
  createHabitHandler,
  listHabitsHandler,
  getHabitHandler,
  updateHabitHandler,
  archiveHabitHandler,
} from "../controllers/habit.controller";

const router = Router();

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
router.post("/", authenticate, createHabitHandler);

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
router.get("/", authenticate, listHabitsHandler);

/**
 * @openapi
 * /api/habits/{id}:
 *   get:
 *     summary: Get a single habit by ID (own only)
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
 *         description: Habit found
 *       404:
 *         description: Habit not found
 */
router.get("/:id", authenticate, getHabitHandler);

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
router.patch("/:id", authenticate, updateHabitHandler);

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
router.delete("/:id", authenticate, archiveHabitHandler);
router.use("/:id/entries", entryRoute);
export default router;