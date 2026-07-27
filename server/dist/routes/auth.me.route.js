"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Not authenticated
 */
router.get("/me", authenticate_1.authenticate, auth_controller_1.getMeHandler);
/**
 * @openapi
 * /api/auth/me:
 *   patch:
 *     summary: Update name
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Validation failed
 */
router.patch("/me", authenticate_1.authenticate, auth_controller_1.updateMeHandler);
/**
 * @openapi
 * /api/auth/password:
 *   patch:
 *     summary: Change password
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Change failed
 */
router.patch("/password", authenticate_1.authenticate, auth_controller_1.changePasswordHandler);
/**
 * @openapi
 * /api/auth/me:
 *   delete:
 *     summary: Delete own account
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       400:
 *         description: Delete failed
 */
router.delete("/me", authenticate_1.authenticate, auth_controller_1.deleteMeHandler);
exports.default = router;
