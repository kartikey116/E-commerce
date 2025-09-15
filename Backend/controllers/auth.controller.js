import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import redis  from "../lib/redis.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefershToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 7
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent xss attacks , cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attack, cross site request forgery
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
};

export const signup = async (req, res) => {
  const user = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50),
    otp:z.string().min(6, "OTP must be at least 6 characters").max(6),
  });

  const { name, email, password ,otp} = await user.parseAsync(req.body);

  try {
    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    const purpose = "verify"; 
    const match = await OTP.findOne({ email, code: hashedOTP, purpose });

    if (!match) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.create({ name, email, password , isVerified:true });

    await OTP.deleteMany({ email, purpose }); 

    //authenticate user
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefershToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const input = z.object({
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50),
  });
  try {
    const { email, password } = await input.parseAsync(req.body);
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefershToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors[0].message });
    }
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is not present" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // prevent xss attacks , cross site scripting attack
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //prevents CSRF attack, cross site request forgery
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTP = async (email, purpose) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash("sha256").update(otpCode).digest("hex");

  await OTP.create({ email, code: hashedOTP, purpose });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: purpose === "verify" ? "Verify Your Email" : "Reset Your Password",
    html: `<p>Your OTP is <b>${otpCode}</b>. It expires in 10 minutes.</p>`
  });
};

export const requestOTP = async (req, res) => {
  const bodySchema = z.object({ email: z.string().email(), purpose: z.enum(["verify", "reset"]) });
  try {
    const { email, purpose } = bodySchema.parse(req.body);
    await OTP.deleteMany({ email, purpose }); // Remove previous OTPs
    await sendOTP(email, purpose);
    res.json({ message: `OTP sent to ${email}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  const schema = z.object({ email: z.string().email(), otp: z.string(), purpose: z.enum(["verify", "reset"]) });
  try {
    const { email, otp, purpose } = schema.parse(req.body);
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    const match = await OTP.findOne({ email, code: hashedOTP, purpose });

    if (!match) return res.status(400).json({ message: "Invalid or expired OTP" });
    await OTP.deleteMany({ email, purpose });

    if (purpose === "verify") {
      await User.updateOne({ email }, { isVerified: true });
      return res.json({ message: "Email verified successfully" });
    }

    res.json({ message: "OTP verified, proceed to reset password" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const schema = z.object({ email: z.string().email(), newPassword: z.string().min(6) });
  try {
    const { email, newPassword } = schema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};