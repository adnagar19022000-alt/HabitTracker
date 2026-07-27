"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const health_route_1 = __importDefault(require("./routes/health.route"));
const node_1 = require("better-auth/node");
const auth_1 = require("./lib/auth");
const habit_route_1 = __importDefault(require("./routes/habit.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./functions/docs/swagger");
const entryStandalone_route_1 = __importDefault(require("./routes/entryStandalone.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const auth_me_route_1 = __importDefault(require("./routes/auth.me.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const insight_route_1 = __importDefault(require("./routes/insight.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use("/api/auth/me", express_1.default.json());
app.use("/api/auth/password", express_1.default.json());
app.use("/api/auth", auth_me_route_1.default);
app.all("/api/auth/*splat", (0, node_1.toNodeHandler)(auth_1.auth));
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use("/health", health_route_1.default);
app.use("/api/habits", habit_route_1.default);
app.use("/api/entries", entryStandalone_route_1.default);
app.use("/api/dashboard", dashboard_route_1.default);
app.use("/api/insights", insight_route_1.default);
app.use("/api/admin", admin_route_1.default);
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const clientDistPath = path_1.default.join(__dirname, "../../client/dist");
    app.use(express_1.default.static(clientDistPath));
    app.get("*splat", (req, res) => {
        res.sendFile(path_1.default.join(clientDistPath, "index.html"));
    });
}
exports.default = app;
