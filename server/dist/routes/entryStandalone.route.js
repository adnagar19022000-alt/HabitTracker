"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const entry_controller_1 = require("../controllers/entry.controller");
const router = (0, express_1.Router)();
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
router.delete("/:id", authenticate_1.authenticate, entry_controller_1.deleteEntryHandler);
exports.default = router;
