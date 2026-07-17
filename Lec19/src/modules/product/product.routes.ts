import { Router, Request, Response } from "express";
import * as productService from "./product.service";
import validate from "../../middlewares/validate.middleware";
import isAdmin from "../../middlewares/isAdmin.middleware";
import { createProductSchema, updateProductSchema } from "./product.validation";

const router = Router();

// ყველა პროდუქტის წამოღება
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("შეცდომა პროდუქტების წამოღებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

// ერთი პროდუქტის წამოღება ID-ით
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "პროდუქტი ვერ მოიძებნა" });
    }

    res.json(product);
  } catch (error) {
    console.error("შეცდომა პროდუქტის წამოღებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

// ახალი პროდუქტის დამატება
router.post("/", validate(createProductSchema), async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("შეცდომა პროდუქტის დამატებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

// პროდუქტის განახლება - მხოლოდ ადმინს შეუძლია
router.put("/:id", isAdmin, validate(updateProductSchema), async (req: Request, res: Response) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ error: "პროდუქტი ვერ მოიძებნა" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("შეცდომა პროდუქტის განახლებისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

// პროდუქტის წაშლა - მხოლოდ ადმინს შეუძლია
router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "პროდუქტი ვერ მოიძებნა" });
    }

    res.json({ message: "პროდუქტი წარმატებით წაიშალა" });
  } catch (error) {
    console.error("შეცდომა პროდუქტის წაშლისას:", error);
    res.status(500).json({ error: "სერვერზე მოხდა შეცდომა" });
  }
});

export default router;
