"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersHandler = listUsersHandler;
exports.getUserDetailHandler = getUserDetailHandler;
exports.getPlatformStatsHandler = getPlatformStatsHandler;
const adminService = __importStar(require("../services/admin.service"));
async function listUsersHandler(req, res) {
    const search = req.query.search;
    const users = await adminService.listUsers(search);
    res.status(200).json(users);
}
async function getUserDetailHandler(req, res) {
    const userId = req.params.id;
    const user = await adminService.getUserDetail(userId);
    if (!user) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "User not found" },
        });
    }
    res.status(200).json(user);
}
async function getPlatformStatsHandler(req, res) {
    const stats = await adminService.getPlatformStats();
    res.status(200).json(stats);
}
