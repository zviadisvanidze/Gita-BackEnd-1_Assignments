import { Router, Response } from "express";
import * as userService from "./user.service";
import validate from "../../middlewares/validate.middleware";
import requireAuth, { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { createUserSchema, updateUserSchema } from "./user.validation";

const router = Router();

router.use(requireAuth);


router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("შეცდომა იუზერების წამოღებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});


router.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "იუზერი ვერ მოიძებნა" });
    }

    res.json(user);
  } catch (error) {
    console.error("შეცდომა იუზერის წამოღებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});


router.post("/", validate(createUserSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "ასეთი სახელით ან ელფოსტით იუზერი უკვე არსებობს" });
    }
    console.error("შეცდომა იუზერის დამატებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});


router.put("/:id", validate(updateUserSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);

    if (!updatedUser) {
      return res.status(404).json({ error: "იუზერი ვერ მოიძებნა" });
    }

    res.json(updatedUser);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "ასეთი სახელით ან ელფოსტით იუზერი უკვე არსებობს" });
    }
    console.error("შეცდომა იუზერის განახლებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});


router.delete("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "იუზერი ვერ მოიძებნა" });
    }

    res.json({ message: "იუზერი წარმატებით წაიშალა" });
  } catch (error) {
    console.error("შეცდომა იუზერის წაშლისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

export default router;
