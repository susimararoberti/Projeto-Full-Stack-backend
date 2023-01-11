import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/auth";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "No token" });

  const parts = authHeader.split(" ");

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Not a Bearer token" });

  jwt.verify(token, jwtSecret, (error: any, decoded: any) => {
    if (error) return res.status(401).send({ error: "Invalid token" });

    req.user = decoded.params.id;

    return next();
  });
};
