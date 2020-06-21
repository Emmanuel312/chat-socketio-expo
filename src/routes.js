import { Router } from "express";

const routes = Router();

routes.post("/", (req, res) => {
  console.log(req.io);
  res.json({ hello: "world" });
});

export default routes;
