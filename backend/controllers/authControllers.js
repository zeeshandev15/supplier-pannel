import crypto from 'crypto';

import Twilio from 'twilio';

import { catchAsyncError } from '../app/middlewares/catchAsyncError.js';
import { createError } from '../app/middlewares/error.js';
import { User } from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendToken } from '../utils/sendToken.js';

const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, phone, password, verificationMethod } = req.body;

    if (!name || !email || !phone || !password || !verificationMethod) {
      return next(createError('All fields are required.', 400));
    }

    function validatePhoneNumber(phone) {
      const phoneRegex = /^\+923\d{9}$/;
      return phoneRegex.test(phone);
    }

    if (!validatePhoneNumber(phone)) {
      return next(createError('Invalid phone number.', 400));
    }

    const existingUser = await User.findOne({
      $or: [
        { email, accountVerified: true },
        { phone, accountVerified: true },
      ],
    });

    if (existingUser) {
      return next(createError('Phone or Email is already used.', 400));
    }

    const registerationAttemptsByUser = await User.find({
      $or: [
        { phone, accountVerified: false },
        { email, accountVerified: false },
      ],
    });

    if (registerationAttemptsByUser.length > 3) {
      return next(
        createError('You have exceeded the maximum number of attempts (3). Please try again after an hour.', 400)
      );
    }

    const userData = { name, email, phone, password };
    const user = await User.create(userData);
    if (!user) {
      return next(createError('Failed to create user', 500));
    }

    const verificationCode = user.generateVerificationCode();
    await user.save(); // Save the user with verification code

    const { success, message } = await sendVerificationCode(verificationMethod, verificationCode, name, email, phone);

    if (!success) {
      return next(createError(message, 500));
    }

    res.status(200).json({
      success: true,
      message: `User registered successfully. ${message}`,
    });

    return { email, phone };
  } catch (error) {
    next(error);
  }
});

async function sendVerificationCode(verificationMethod, verificationCode, name, email, phone) {
  try {
    if (verificationMethod === 'email') {
      const message = generateEmailTemplate(verificationCode);
      await sendEmail({ email, subject: 'Your Verification Code', message });

      return {
        success: true,
        message: `Verification email successfully sent to ${name}.`,
      };
    } else if (verificationMethod === 'phone') {
      const verificationCodeWithSpace = verificationCode.toString().split('').join(' ');

      await client.calls.create({
        twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      return { success: true, message: 'OTP sent successfully via phone.' };
    } else {
      return {
        success: false,
        message: 'Invalid verification method.',
      };
    }
  } catch (error) {
    console.error('Error in sendVerificationCode:', error);
    return {
      success: false,
      message: 'Failed to send verification code.',
    };
  }
}

function generateEmailTemplate(verificationCode) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Dear User,</p>
        <p style="font-size: 16px; color: #333;">Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
            ${verificationCode}
          </span>
        </div>
        <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
        <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
          <p>Thank you,<br>Your Company Team</p>
          <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
        </footer>
      </div>
    `;
}

// export const verifyOTP = catchAsyncError(async (req, res, next) => {
//   const { email, otp, phone } = req.body;

//   function validatePhoneNumber(phone) {
//     const phoneRegex = /^\+923\d{9}$/;
//     return phoneRegex.test(phone);
//   }

//   if (!validatePhoneNumber(phone)) {
//     return next(createError("Invalid phone number.", 400));
//   }

//   try {
//     const userAllEntries = await User.find({
//       $or: [
//         {
//           email,
//           accountVerified: false,
//         },
//         {
//           phone,
//           accountVerified: false,
//         },
//       ],
//     }).sort({ createdAt: -1 });

//     if (!userAllEntries) {
//       return next(createError("User not found.", 404));
//     }

//     let user;

//     if (userAllEntries.length > 1) {
//       user = userAllEntries[0];

//       await User.deleteMany({
//         _id: { $ne: user._id },
//         $or: [
//           { phone, accountVerified: false },
//           { email, accountVerified: false },
//         ],
//       });
//     } else {
//       user = userAllEntries[0];
//     }

//     if (user.verificationCode !== Number(otp)) {
//       return next(createError("Invalid OTP.", 400));
//     }

//     const currentTime = Date.now();

//     const verificationCodeExpire = new Date(
//       user.verificationCodeExpire
//     ).getTime();

//     if (currentTime > verificationCodeExpire) {
//       return next(createError("OTP Expired.", 400));
//     }

//     user.accountVerified = true;
//     user.verificationCode = null;
//     user.verificationCodeExpire = null;

//     await user.save({ validateModifiedOnly: true });

//     sendToken(user, 200, "Account Verified.", res);
//   } catch (error) {
//     console.error("Error during OTP verification:", error);

//     return next(createError("Internal Server Error.", 500));
//   }
// });

// export const verifyOTP = catchAsyncError(async (req, res, next) => {
//   const { email, phone, otp } = req.body;

//   try {
//     const userAllEntries = await User.find({
//       $or: [
//         {
//           email,
//           accountVerified: false,
//         },
//         {
//           phone,
//           accountVerified: false,
//         },
//       ],
//     }).sort({ createdAt: -1 });

//     if (userAllEntries.length === 0) {
//       return next(createError("User not found.", 404));
//     }

//     let user = userAllEntries[0];

//     if (user.verificationCode !== Number(otp)) {
//       return next(createError("Invalid OTP.", 400));
//     }

//     const currentTime = Date.now();
//     const verificationCodeExpire = new Date(
//       user.verificationCodeExpire
//     ).getTime();

//     if (currentTime > verificationCodeExpire) {
//       return next(createError("OTP Expired.", 400));
//     }

//     user.accountVerified = true;
//     user.verificationCode = null;
//     user.verificationCodeExpire = null;

//     await user.save({ validateModifiedOnly: true });

//     sendToken(user, 200, "Account Verified.", res);
//   } catch (error) {
//     console.error("Error during OTP verification:", error);
//     return next(createError("Internal Server Error.", 500));
//   }
// });

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(createError('OTP  are required.', 400));
  }

  try {
    const user = await User.findOne({ accountVerified: false });
    console.log('User from DB:', user);

    if (!user) {
      return next(createError('User not found or already verified.', 404));
    }

    if (user.verificationCode !== Number(otp)) {
      return next(createError('Invalid OTP.', 400));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(createError('OTP expired.', 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, 'Account verified successfully.', res);
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return next(createError('Internal Server Error.', 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createError('Email and password are required.', 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select('+password');

  if (!user) {
    return next(createError('Invalid email or password.', 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(createError('Invalid email or password.', 400));
  }
  sendToken(user, 200, 'User logged in successfully.', res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully.',
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgetPassowrd = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if (!user) {
    return next(createError('User not found.', 404));
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${resetToken}`;
  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`;
  try {
    sendEmail({
      email: user.email,
      subject: 'MERN AUTHENTICATION APP RESET PASSWORD',
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(createError(error.message ? error.message : 'cannot send reset password token'));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log('🚀 ~ resetPassword ~ User:', User);

  if (!user) {
    return next(createError('Reset password token is invalid or has been expired.', 400));
  }

  if (password !== confirmPassword) {
    return next(createError('Password & confirm password do not match.', 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, 'Reset Password Successfully.', res);
});
