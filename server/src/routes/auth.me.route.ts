import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  getMeHandler,
  updateMeHandler,
  changePasswordHandler,
  deleteMeHandler,
} from "../controllers/auth.controller";

const router = Router();

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
router.get("/me", authenticate, getMeHandler);

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
router.patch("/me", authenticate, updateMeHandler);

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
router.patch("/password", authenticate, changePasswordHandler);

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
router.delete("/me", authenticate, deleteMeHandler);

export default router;