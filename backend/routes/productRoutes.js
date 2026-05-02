import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  importProducts,
  updateProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getProducts).post(createProduct);
router.post("/import", importProducts);
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
