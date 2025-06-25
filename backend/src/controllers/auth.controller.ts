import nodemailer from "nodemailer";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

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
        sameSite: "lax",      
        maxAge: 60 * 60 * 1000, 
      })
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });

  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { signupUser, sendEmailVerificationOTP, loginUser }