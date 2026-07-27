"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insight_controller_1 = require("../controllers/insight.controller");
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
const router = (0, express_1.Router)();
// Middleware to ensure the user is logged in
router.use(async (req, res, next) => {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers),
    });
    if (!session) {
        res.status(401).json({ error: { message: "Unauthorized" } });
        return;
    }
    // Attach user ID to headers so the controller can use it
    req.headers["x-user-id"] = session.user.id;
    next();
});
// The actual API endpoints
router.get("/", insight_controller_1.getInsightsHandler);
router.post("/generate", insight_controller_1.generateInsightHandler);
exports.default = router;
