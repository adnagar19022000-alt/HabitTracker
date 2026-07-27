"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsightsHandler = getInsightsHandler;
exports.generateInsightHandler = generateInsightHandler;
const insight_service_1 = require("../services/insight.service");
async function getInsightsHandler(req, res) {
    try {
        // The user's ID is automatically attached to the request by Better Auth
        const userId = req.headers["x-user-id"];
        const insights = await (0, insight_service_1.getUserInsights)(userId);
        res.json(insights);
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}
async function generateInsightHandler(req, res) {
    try {
        const userId = req.headers["x-user-id"];
        const insight = await (0, insight_service_1.generateWeeklyInsight)(userId);
        res.json(insight);
    }
    catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
}
