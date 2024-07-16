import { Router } from "express";
import * as uc from "./user.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();
router.post("/register", uc.register);
router.post("/login", uc.login);

export default router;
