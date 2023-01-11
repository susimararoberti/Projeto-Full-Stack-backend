import express from "express";
import { authMiddleware } from "../middleware/validateAuth.middleware";
import Customer from "../models/customer";

const customerRouter = express.Router();

customerRouter.use(authMiddleware);

customerRouter.get("/", async (req, resp) => {
  return resp.send(await Customer.find());
});

customerRouter.get("/:customerId", async (req, resp) => {
  const customerId = req.params.customerId;
  return resp.send(await Customer.findById(customerId));
});

customerRouter.post("/", async (req, resp) => {
  const { cpf } = req.body;
  try {
    if (await Customer.findOne({ cpf })) {
      return resp.status(400).send({ error: "Custoner already exists!" });
    }
    const newCustomer = await Customer.create(req.body);
    return resp.send(newCustomer);
  } catch (err) {
    return resp.status(400).send({ error: "Error: " + err });
  }
});

customerRouter.patch("/:customerId", async (req, resp) => {
  const customerId = req.params.customerId;
  try {
    await Customer.findByIdAndUpdate(customerId, req.body);
    return resp.status(203).send(await Customer.findById(customerId));
  } catch (err) {
    return resp.status(400).send({ error: "Error: " + err });
  }
});

customerRouter.delete("/:customerId", async (req, resp) => {
  const customerId = req.params.customerId;
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    return resp.status(203).send(deletedCustomer);
  } catch (err) {
    return resp.status(400).send({ error: "Error: " + err });
  }
});

export default customerRouter;
