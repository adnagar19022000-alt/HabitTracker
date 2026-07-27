"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const mongodb_1 = require("better-auth/adapters/mongodb");
const mongodb_2 = require("mongodb");
const client = new mongodb_2.MongoClient(process.env.MONGODB_URI);
const db = client.db();
const ADMIN_EMAILS = [
    "admin@habittracker.com",
];
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, mongodb_1.mongodbAdapter)(db),
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [process.env.CLIENT_URL],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                input: false,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (ADMIN_EMAILS.includes(user.email)) {
                        return {
                            data: {
                                ...user,
                                role: "admin",
                            },
                        };
                    }
                    return { data: user };
                },
            },
        },
    },
});
