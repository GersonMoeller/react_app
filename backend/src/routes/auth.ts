import { Router } from "express";
import { login, register,verifyToken } from "../controllers/authController";

const router = Router();

router.get('/verify-token', verifyToken);
router.post("/login", login);
router.post("/register", register);

export default router;
