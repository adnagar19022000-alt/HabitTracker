"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
async function authenticate(req, res, next) {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers),
    });
    if (!session) {
        return res.status(401).json({
            error: { code: "UNAUTHENTICATED", message: "Login required" },
        });
    }
    req.user = session.user;
    req.session = session.session;
    next();
}
