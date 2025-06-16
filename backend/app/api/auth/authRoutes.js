import { isAuthenticated } from "../../middlewares/auth.js";
import {
  forgetPassowrd,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  verifyOTP,
} from "../../../controllers/authControllers.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/otpverification", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/user", isAuthenticated, getUser);
router.post("/password/forgot", forgetPassowrd);
router.put("/password/reset", resetPassword);
export default router;
