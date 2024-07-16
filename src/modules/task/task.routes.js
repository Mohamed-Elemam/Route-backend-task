import { Router } from "express";
import * as tc from "./task.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.post("/", auth, tc.addTask);
router.get("/", auth, tc.getUserTasks);
router.put("/:taskId", auth, tc.updateTask);
router.delete("/:taskId", auth, tc.deleteTask);
router.get("/public", tc.getPublicTasks);

export default router;
