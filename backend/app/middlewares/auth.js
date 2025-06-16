import { User } from "../../models/userModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { createError } from "../middlewares/error.js";
import { config } from "dotenv";

import jwt from "jsonwebtoken";
config();
// authentication check
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(createError("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SCREATE_KEY);

  req.user = await User.findById(decoded.id);
  // console.log("i wanna check the decode data", req.user);
  next();
});
