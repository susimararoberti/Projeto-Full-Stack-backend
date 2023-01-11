import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./controllers/authController";
import customerRouter from "./controllers/customerController";
import User from "./models/user";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use("/auth", authRouter);
app.use("/customer", customerRouter);

app.get("/", (req, resp) => {
  resp.send("API is running");
});

app.listen(port, async () => {
  const users = await User.find();

  if (!users[0]) {
    User.create({
      login: "desafiosharenergy",
      password: "sh@r3n3rgy",
    });
  }

  console.log("Server running on port: ", port);
});
