import { Router } from "express";
import { getInsightsHandler, generateInsightHandler } from "../controllers/insight.controller";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router = Router();

// Middleware to ensure the user is logged in
router.use(async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
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
router.get("/", getInsightsHandler);
router.post("/generate", generateInsightHandler);

export default router;