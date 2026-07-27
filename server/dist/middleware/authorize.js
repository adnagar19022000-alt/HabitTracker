"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: { code: "UNAUTHENTICATED", message: "Login required" },
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: { code: "FORBIDDEN", message: "Insufficient permissions" },
            });
        }
        next();
    };
}
