import Router from "express";

const messageRoute = Router();

messageRoute.get("/send", (req, res) => {
  res.send("Message sent");
});

export default messageRoute;
