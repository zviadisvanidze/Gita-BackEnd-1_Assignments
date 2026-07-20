import { Router, Response } from "express";
import { getLeaderboard } from "./leaderboard.service";
import requireAuth, { AuthenticatedRequest } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);


router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const leaderboard = await getLeaderboard(limit);
    res.json({ leaderboard });
  } catch (error) {
    console.error("შეცდომა ლიდერბორდის წამოღებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

export default router;
