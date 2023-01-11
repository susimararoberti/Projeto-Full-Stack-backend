import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { jwtSecret } from "../utils/auth";
import bcrypt from "bcryptjs";

const authRouter = express.Router();

const generateToken = (params = {}) => {
  return jwt.sign({ params }, jwtSecret, {
    expiresIn: 86400,
  });
};

authRouter.get("/:userId", async (req, resp) => {
  const userId = req.params.userId;
  return resp.send(await User.findById(userId));
});

authRouter.get("/", async (req, resp) => {
  return resp.send(await User.find());
});

authRouter.post("/signup", async (req, resp) => {
  const { login } = req.body;
  try {
    if (await User.findOne({ login })) {
      return resp.status(400).send({ error: "User already exists" });
    }
    const newUser = await User.create(req.body);
    newUser.password = "protected";

    return resp.send({ newUser, token: generateToken({ id: newUser.id }) });
  } catch (err) {
    return resp.status(400).send({ err: "Registration failed: " + err });
  }
});

authRouter.post("/login", async (req, resp) => {
  const { login, password } = req.body;
  const userLogin = await User.findOne({ login }).select("+password");

  if (!userLogin || !(await bcrypt.compare(password, userLogin.password))) {
    return resp.status(400).send({ error: "Incorrect user or password" });
  }

  userLogin.password = "protected";

  return resp.send({ userLogin, token: generateToken({ id: userLogin.id }) });
});

export default authRouter;
