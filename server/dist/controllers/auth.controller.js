"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeHandler = getMeHandler;
exports.updateMeHandler = updateMeHandler;
exports.changePasswordHandler = changePasswordHandler;
exports.deleteMeHandler = deleteMeHandler;
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
async function getMeHandler(req, res) {
    // req.user is already populated by the `authenticate` middleware
    res.status(200).json(req.user);
}
async function updateMeHandler(req, res) {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
        return res.status(400).json({
            error: { code: "VALIDATION_FAILED", message: "name is required" },
        });
    }
    try {
        const updated = await auth_1.auth.api.updateUser({
            body: { name },
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(400).json({
            error: { code: "UPDATE_FAILED", message: error.message },
        });
    }
}
async function changePasswordHandler(req, res) {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_FAILED",
                message: "currentPassword and newPassword are required",
            },
        });
    }
    try {
        await auth_1.auth.api.changePassword({
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            },
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        res.status(200).json({ message: "Password updated" });
    }
    catch (error) {
        res.status(400).json({
            error: { code: "PASSWORD_CHANGE_FAILED", message: error.message },
        });
    }
}
async function deleteMeHandler(req, res) {
    try {
        await auth_1.auth.api.deleteUser({
            body: {},
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        res.status(200).json({ message: "Account deleted" });
    }
    catch (error) {
        res.status(400).json({
            error: { code: "DELETE_FAILED", message: error.message },
        });
    }
}
