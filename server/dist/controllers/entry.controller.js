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
exports.logEntryHandler = logEntryHandler;
exports.getEntriesHandler = getEntriesHandler;
exports.deleteEntryHandler = deleteEntryHandler;
const entryService = __importStar(require("../services/entry.service"));
async function logEntryHandler(req, res) {
    const habitId = req.params.id;
    try {
        const entry = await entryService.logEntry(req.user.id, habitId, req.body);
        res.status(201).json(entry);
    }
    catch (error) {
        const message = error.message;
        if (message === "HABIT_NOT_FOUND") {
            return res.status(404).json({
                error: { code: "NOT_FOUND", message: "Habit not found" },
            });
        }
        // MongoDB duplicate key error code is 11000
        if (error.code === 11000) {
            return res.status(409).json({
                error: { code: "DUPLICATE_ENTRY", message: "Already logged for this day" },
            });
        }
        res.status(400).json({
            error: { code: "LOG_FAILED", message },
        });
    }
}
async function getEntriesHandler(req, res) {
    const habitId = req.params.id;
    const entries = await entryService.getEntriesForHabit(req.user.id, habitId);
    res.status(200).json(entries);
}
async function deleteEntryHandler(req, res) {
    const entryId = req.params.id;
    const entry = await entryService.deleteEntry(req.user.id, entryId);
    if (!entry) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Entry not found" },
        });
    }
    res.status(200).json({ message: "Entry deleted" });
}
