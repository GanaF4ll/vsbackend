import { db } from "../db/db.server";
const jwt = require("jsonwebtoken");
require("dotenv").config();
import { Request, Response, NextFunction } from "express";

export const userToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("Headers:", req.headers);

  let token = req.headers["authorization"] as string;

  console.log("Token:", token);

  if (!token) {
    return res.status(403).send({ message: "Aucun token fourni!" });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        console.log("JWT verification error:", err);
        return res.status(401).send({ message: "Non autorisé!" });
      }

      if (!decoded.mail) {
        console.log("Mail not found in token payload");
        return res.status(401).send({ message: "Non autorisé!" });
      }

      const userMailToken = decoded.mail;
      const userIdToken = decoded.id;

      console.log("Decoded email:", userMailToken);
      console.log("Decoded id:", userIdToken);

      const user = await db.users.findUnique({
        where: { id: userIdToken },
        select: { mail: true },
      });

      if (user && user.mail === userMailToken) {
        next();
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }
    }
  );
};

export const adminToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers["authorization"] as string;

  console.log("Token:", token);

  if (!token) {
    return res.status(403).send({ message: "Aucun token fourni!" });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        console.log("JWT verification error:", err);
        return res.status(401).send({ message: "Non autorisé!" });
      }

      const userIdToken = decoded.id;
      const userRole_idToken = decoded.role;

      console.log("Decoded id:", userIdToken);
      console.log(decoded.token);
      console.log("Decoded role:", userRole_idToken);

      const user = await db.users.findUnique({
        where: { id: userIdToken },
        select: { role_id: true },
      });

      if (user && user.role_id === 1 && userRole_idToken === 1) {
        next();
      } else {
        return res
          .status(401)
          .send({ message: "You are not supposed to be here !" });
      }
    }
  );
};
