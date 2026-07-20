import { Router, Response } from "express";
import * as quizService from "./quiz.service";
import requireAuth, { AuthenticatedRequest } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);


router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  } catch (error) {
    console.error("შეცდომა ქუიზების წამოღებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});


router.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quiz = await quizService.getQuizPublicById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: "ქუიზი ვერ მოიძებნა" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("შეცდომა ქუიზის წამოღებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

export default router;
