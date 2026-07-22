import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { deleteEntryHandler } from "../controllers/entry.controller";

const router = Router();

/**
 * @openapi
 * /api/entries/{id}:
 *   delete:
 *     summary: Delete a specific entry (own only)
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
 *         description: Entry deleted
 *       404:
 *         description: Entry not found
 */
router.delete("/:id", authenticate, deleteEntryHandler);

export default router;