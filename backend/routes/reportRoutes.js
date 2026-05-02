import express from "express";
import { getDashboardReport, getInventoryReport, getSalesReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/dashboard", getDashboardReport);
router.get("/sales", getSalesReport);
router.get("/inventory", getInventoryReport);

export default router;
