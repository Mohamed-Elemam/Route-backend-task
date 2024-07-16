import { Router } from "express";
import * as cc from "./category.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.get("/", auth, cc.getUserCategories);
router.post("/", auth, cc.addCategory);
router.put("/:id", auth, cc.updateCategory);
router.delete("/:id", auth, cc.deleteCategory);

export default router;
