import express from "express";
import {
  Login,
  Signup,
  ForgotPassword,
  OtpVerfication,
  ResetPassword,
} from "../controllers/user-controller.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forgot-password", ForgotPassword);
router.post("/verify-email/:id", OtpVerfication);
router.post("/reset-password/:id", ResetPassword);

export const userRouters = router;
