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

      // Vérification supplémentaire : décodage du mail depuis le payload
      if (!decoded.mail) {
        console.log("Mail not found in token payload");
        return res.status(401).send({ message: "Non autorisé!" });
      }

      // Vous pouvez maintenant accéder au mail décodé depuis le token
      const userMailToken = decoded.mail;
      const userIdToken = decoded.id;
      console.log("Decoded email:", userMailToken);
      console.log("Decoded id:", userIdToken);

      // Vous pouvez également utiliser l'ID, le rôle, etc., depuis le payload si nécessaire
      // const userRole = decoded.role_id;

      const user = await db.users.findUnique({
        where: { id: userIdToken },
        select: { mail: true },
      });

      if (user && user.mail === userMailToken) {
        next();
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }

      // Vous pouvez ajouter des informations du token à la requête si nécessaire
      // req.userId = userId;
      // req.userRole = userRole;
    }
  );
};
