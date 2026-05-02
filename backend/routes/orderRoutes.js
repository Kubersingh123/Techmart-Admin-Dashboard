import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getOrders).post(createOrder);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/payment", updatePaymentStatus);

export default router;
