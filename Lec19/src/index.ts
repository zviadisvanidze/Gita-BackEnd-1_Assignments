import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import productRoutes from "./modules/product/product.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3040;

app.use(express.json());

app.use("/api/products", productRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`სერვერი ჩაირთო პორტზე: http://localhost:${PORT}`);
  });
});
