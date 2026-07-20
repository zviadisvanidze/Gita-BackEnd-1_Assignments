import { Router, Request, Response } from "express";
import * as authService from "./auth.service";
import validate from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";

const router = Router();


router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "ასეთი სახელით ან ელფოსტით იუზერი უკვე არსებობს" });
    }
    console.error("შეცდომა რეგისტრაციისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});


router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);

    if (!result) {
      return res.status(401).json({ error: "ელფოსტა ან პაროლი არასწორია" });
    }

    res.json(result);
  } catch (error) {
    console.error("შეცდომა შესვლისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

export default router;
