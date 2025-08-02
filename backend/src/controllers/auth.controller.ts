import nodemailer from "nodemailer";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserModel from "../models/user.model";

const signupUser = async (req: Request, res: Response) => {

  const { role, employmentType, seniority, skills, name, email, department, password, maxCapacity } = req.body;
  console.log("req.body: ", req.body);

  try {
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      res.status(409).json({
        userExist: true,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("hashedPassword: ", hashedPassword);

    let user
    if (role === 'manager') {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
      });
    }
    else {
      const defaultCapacity = employmentType === "part-time" ? 50 : 100;
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        employmentType,
        seniority,
        skills,
        department,
        maxCapacity: defaultCapacity,
        availableCapacity: defaultCapacity
      });
    }

    if (!user) {
      res.status(500).json({ message: "User creation failed" });
      return;
    }

    const { password: _, ...userData } = user.toObject();
    res.status(201).json({
      userExist: false,
      data: user,
      message: "User registered successfully",
    });
  }
  catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendEmailVerificationOTP = async (req: Request, res: Response) => {
  const { OTP, email } = req.body;
  console.log("req.body: ", req.body);

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sonu.mondal.2027@gmail.com",
      pass: "ghfs wdlk pkwd pjmg",
    },
  });

  let mailOptions = {
    from: "sonu.mondal.2027@gmail.com",
    to: email,
    subject: "Verify your email",
    text: `Welcome to the engineering resource management system. Please, verify your email by entering the OTP. Your OTP is: ${OTP}`,
  };

  console.log("mailOptions: ", mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

const loginUser = async (req: Request, res: Response) => {
  console.log("req.body in login: ", req.body);
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(401).json({ message: "Email not found" });
      return
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET not defined in environment variables");

    const { password: _, ...userWithoutPassword } = foundUser.toObject();

    const token = jwt.sign(userWithoutPassword, jwtSecret, { expiresIn: "1h" });

    console.log("token: ", token);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path:"/",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });

  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, userId } = req.body;

  if (!userId) { res.status(401).json({ message: "Unauthorized" }); return }

  try {
    const user = await UserModel.findById(userId);
    if (!user) { res.status(404).json({ message: "User not found" }); return }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) { res.status(401).json({ message: "Incorrect current password" }); return }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const verifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: "Email is required." });
    return
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: "Email not found." });
      return
    }

    res.status(200).json({ success: true, message: "Email exists." });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// import { Request, Response } from "express";
// import User from "../models/user.model";
// import bcrypt from "bcryptjs";

const updatePassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password are required." });
    return
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("changePassword error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,

    // For vercel F to vercel B
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

    // For vercel F to render B
    secure: true,       // login ke jaise
    sameSite: "none",   // login ke jaise
    path: "/",          // default path ensured
  });

  res.status(200).json({ success: true, message: "Logged out successfully." });
};


const checkCookie = (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ success: false, message: "No token found" });
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.status(200).json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};



export { signupUser, sendEmailVerificationOTP, loginUser, changePassword, verifyEmail, updatePassword, logoutUser, checkCookie }