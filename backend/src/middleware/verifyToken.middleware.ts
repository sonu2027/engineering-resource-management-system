// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// const verifyToken = async (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   console.log("Received Token: ", token);

//   if (!token) return res.status(403).json({ message: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Verified User: ", verified);

//     req.user = verified;
//     next();
//   } catch (err) {
//     console.error("JWT Verification Error:", err.message);
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };

// const verifyToken = (req:Request, res:Response, next:NextFunction) => {
//   const token = req.header("Authorization")?.split(" ")[1] || req.cookies.token;

//   if (!token) {
//     return res.status(403).json({ message: "Access Denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error("JWT Error:", err.message);
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1] || req.cookies.token;

  console.log("Token: ", token);
  
  if (!token) {
    res.status(403).json({ message: "Access Denied" });
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { verifyToken };
