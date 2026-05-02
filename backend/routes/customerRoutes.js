import express from "express";
import { getCustomerById, getCustomers } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);

export default router;
